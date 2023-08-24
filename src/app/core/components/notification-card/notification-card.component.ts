import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { mergeMap, of, take, takeUntil, tap } from 'rxjs';
import { MessagesService } from 'src/app/messages/messages.service';
import { ProjectsService } from 'src/app/projects/projects.service';
import { ConfirmWindowComponent } from 'src/app/shared/components/confirm-window/confirm-window.component';
import {
  INotification,
  NotificationType,
  isINotification,
} from 'src/app/shared/models/INotification';
import { PresenceService } from 'src/app/shared/services/presence.service';

@Component({
  selector: 'app-notification-card[notification]',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent implements OnChanges {
  @Input('notification') notificationValue?: INotification;
  notification?: INotification;
  notificationsTypes: typeof NotificationType = NotificationType;
  constructor(
    public messagesService: MessagesService,
    private toastrService: ToastrService,
    private presenceService: PresenceService,
    private modalService: BsModalService,
    private projectsService: ProjectsService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificationValue']) {
      if (!this.notificationValue || !isINotification(this.notificationValue)) {
        throw new Error(
          "Invalid input value 'notificationValue' in NotificationCardComponent",
        );
      }
      this.notification = this.notificationValue;
    }
  }
  acceptProjectInvitation(notification: INotification) {
    this.projectsService
      .acceptProjectInvitation(notification.notificationPartnerId)
      .pipe(
        take(1),
        mergeMap(() =>
          this.presenceService.setADifferentTypeOfNotification(
            notification.id,
            NotificationType.InvitationToProjectAccepted,
            true,
          ),
        ),
      )
      .subscribe(() => {
        this.toastrService.success('Invitation accepted.');
      });
  }
  rejectProjectInvitation(notification: INotification) {
    this.projectsService
      .declineProjectInvitation(notification.notificationPartnerId)
      .pipe(
        take(1),
        mergeMap(() =>
          this.presenceService.setADifferentTypeOfNotification(
            notification.id,
            NotificationType.InvitationToProjectDeclined,
            true,
          ),
        ),
      )
      .subscribe(() => {
        this.toastrService.success('Invitation declined.');
      });
  }
  acceptFriendInvitation(notification: INotification) {
    this.messagesService
      .acceptFriendInvitation({
        inviterUserId: notification.notificationPartnerId,
        invitedUserId: notification.userId,
      })
      .pipe(
        take(1),
        mergeMap(() =>
          this.presenceService.setADifferentTypeOfNotification(
            notification.id,
            NotificationType.FriendRequestAccepted,
          ),
        ),
      )
      .subscribe(() => {
        this.toastrService.success('Invitation accepted.');
      });
  }
  rejectFriendInvitation(notification: INotification) {
    this.messagesService
      .declineFriendInvitation({
        inviterUserId: notification.notificationPartnerId,
        invitedUserId: notification.userId,
      })
      .pipe(
        take(1),
        mergeMap(() =>
          this.presenceService.setADifferentTypeOfNotification(
            notification.id,
            NotificationType.FriendRequestAccepted,
          ),
        ),
      )
      .subscribe(() => {
        this.toastrService.success('Invitation declined.');
      });
  }
  markNotificationAsRead(notification: INotification) {
    if (notification.displayed) return;

    this.presenceService
      .markNotificationAsRead(notification.id)
      .subscribe(() => {
        this.toastrService.success('Notification marked as read.');
      });
  }

  deleteNotification(notification: INotification) {
    const bsModalRef = this.modalService.show(ConfirmWindowComponent, {
      class: 'modal-sm',
    });
    bsModalRef.content?.result$
      .pipe(
        take(1),
        mergeMap((x) => {
          if (x) {
            return this.presenceService.deleteNotification(notification).pipe(
              take(1),
              tap(() =>
                this.toastrService.success('Notification has been removed.'),
              ),
            );
          }
          return of();
        }),
        takeUntil(this.modalService.onHide),
        takeUntil(this.modalService.onHidden),
      )
      .subscribe();
  }
  stopPropagation($event: MouseEvent) {
    $event.stopPropagation();
  }
}
