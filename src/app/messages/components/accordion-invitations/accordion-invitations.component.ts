import { Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { IFriendInvitation } from 'src/app/shared/models/IFriendInvitation';
import { MessagesService } from '../../messages.service';

@Component({
  selector: 'app-accordion-invitations',
  templateUrl: './accordion-invitations.component.html',
  styleUrls: ['./accordion-invitations.component.scss'],
})
export class AccordionInvitationsComponent implements OnDestroy {
  public isCollapsedAccordionInvitations: boolean;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(
    public messagesService: MessagesService,
    private toastrService: ToastrService,
  ) {
    this.isCollapsedAccordionInvitations = true;
    this.ngUnsubscribeSource$ = new Subject<void>();
  }
  acceptFriendInvitation(invitation: IFriendInvitation) {
    this.messagesService
      .acceptFriendInvitation({
        inviterUserId: invitation.inviterUserId,
        invitedUserId: invitation.invitedUserId,
      })
      .pipe(takeUntil(this.ngUnsubscribeSource$))
      .subscribe(() => {
        this.toastrService.success('Invitation accepted.');
      });
  }
  declineFriendInvitation(invitation: IFriendInvitation) {
    this.messagesService
      .declineFriendInvitation(invitation)
      .pipe(takeUntil(this.ngUnsubscribeSource$))
      .subscribe(() => {
        this.toastrService.success('Invitation canceled.');
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }
}
