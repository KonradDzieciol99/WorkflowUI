import { Component } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { INotification } from 'src/app/shared/models/INotification';
import { PresenceService } from 'src/app/shared/services/presence.service';

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent {
  //notificationsLength$: Observable<number>;
  unreadNotificationsLength$?: Observable<number>;
  allNotificationsCount$?: Observable<number>;
  curentNotificationsCount$?: Observable<number>;
  isNotificationPanelExpanded: boolean;
  notifications$: Observable<INotification[]>;
  constructor(private presenceService: PresenceService) {
    this.isNotificationPanelExpanded = false;

    // this.notificationsLength$=this.presenceService.notifications$.pipe(
    //   map(x=>{ return x.filter(n=>n.displayed==false).length})
    // );

    this.unreadNotificationsLength$ =
      presenceService.unreadNotificationsIds$.pipe(
        map((x) => {
          return x.length;
        }),
      );

    this.allNotificationsCount$ = presenceService.allNotificationsCount$;

    this.notifications$ = this.presenceService.notifications$;
    this.curentNotificationsCount$ = this.presenceService.notifications$.pipe(
      map((x) => {
        return x.length;
      }),
    );
  }

  onOpenChange(isOpen: boolean): void {
    this.isNotificationPanelExpanded = isOpen;
  }

  loadMoreNotifications() {
    this.presenceService.getAllNotifications()
    .pipe(
      take(1)
    )
    .subscribe()

  //   this.isloadingOlderMessages = true;
  //   this.chatService
  //     .getMessages(this.chatRecipient, 15)
  //     .pipe(take(1), takeUntil(this.ngUnsubscribeSource$))
  //     .subscribe((messages) => {
  //       if (messages.length < 15) this.hasMoreData = false;

  //       this.isloadingOlderMessages = false;
  //     });
  }
}
