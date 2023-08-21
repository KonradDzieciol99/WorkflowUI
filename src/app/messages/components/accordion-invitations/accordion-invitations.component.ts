import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../messages.service';
import { IFriendInvitation } from 'src/app/shared/models/IFriendInvitation';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-accordion-invitations',
  templateUrl: './accordion-invitations.component.html',
  styleUrls: ['./accordion-invitations.component.scss']
})
export class AccordionInvitationsComponent implements OnInit {
  public isCollapsedAccordionInvitations: boolean;
  // searchUsersFormControl: FormControl<string>;
  constructor(public messagesService:MessagesService,
  private toastrService: ToastrService) {
    this.isCollapsedAccordionInvitations=false;
    // this.searchUsersFormControl = new FormControl<string>('',{ nonNullable: true });

  }
  ngOnInit(): void {
    // this.searchUsersFormControl?.valueChanges.pipe(
    //   debounceTime(600),
    //   distinctUntilChanged(),
    //   switchMap((term: string)=>{
    //     if (Boolean(term)) {return this.messagesService.findUsersByEmailAndCheckState(term).pipe(take(1));}
    //     return of([]);
    //   })
    // ).subscribe(users=>{
    //   this.receivedFriendRequestsSource.next(users);
    // });
  }
  acceptFriendInvitation(invitation:IFriendInvitation){
    this.messagesService.acceptFriendInvitation({inviterUserId:invitation.inviterUserId,invitedUserId:invitation.invitedUserId}).subscribe(()=>{
      this.toastrService.success("Invitation accepted.")
    });
  }
  declineFriendInvitation(invitation:IFriendInvitation){
    this.messagesService.declineFriendInvitation(invitation).subscribe(()=>{
      this.toastrService.success("Invitation canceled.")  
    });
  }
}
