import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IFriendInvitation } from 'src/app/shared/models/IFriendInvitation';
import { MessagesService } from '../../messages.service';

@Component({
  selector: 'app-accordion-invitations',
  templateUrl: './accordion-invitations.component.html',
  styleUrls: ['./accordion-invitations.component.scss'],
})
export class AccordionInvitationsComponent {
  public isCollapsedAccordionInvitations: boolean;
  constructor(
    public messagesService: MessagesService,
    private toastrService: ToastrService,
  ) {
    this.isCollapsedAccordionInvitations = false;
  }
  acceptFriendInvitation(invitation: IFriendInvitation) {
    this.messagesService
      .acceptFriendInvitation({
        inviterUserId: invitation.inviterUserId,
        invitedUserId: invitation.invitedUserId,
      })
      .subscribe(() => {
        this.toastrService.success('Invitation accepted.');
      });
  }
  declineFriendInvitation(invitation: IFriendInvitation) {
    this.messagesService.declineFriendInvitation(invitation).subscribe(() => {
      this.toastrService.success('Invitation canceled.');
    });
  }
}
