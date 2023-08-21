import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/shared/models/IUser';
import { ChatService } from '../../services/chat.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { MessagesService } from '../../messages.service';
import { Observable, debounceTime, distinctUntilChanged, filter, from, mergeMap, of, switchMap, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { IFriendInvitation } from 'src/app/shared/models/IFriendInvitation';

@Component({
  selector: 'app-accordion-my-chats',
  templateUrl: './accordion-my-chats.component.html',
  styleUrls: ['./accordion-my-chats.component.scss']
})
export class AccordionMyChatsComponent implements OnInit {
  isCollapsedAccordionMyChats: boolean;
  friendsWithActivityStatus$: Observable<IUser[]>;
  userClaims: Record<string, any>;
  searchUsersFormControl: FormControl<string>;
  constructor(public chatService:ChatService,
    private readonly oAuthService: OAuthService,
    private messagesService:MessagesService,
    private toastrService: ToastrService,
    ) {
    this.friendsWithActivityStatus$ = this.messagesService.friendsWithActivityStatus$;
    this.isCollapsedAccordionMyChats = false;
    this.userClaims = this.oAuthService.getIdentityClaims();
    this.searchUsersFormControl = new FormControl<string>('',{ nonNullable: true });

  }
  ngOnInit(): void {
    this.searchUsersFormControl?.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap((term: string)=>{
          return this.messagesService.GetConfirmedFriendRequests(term ?? "").pipe(take(1));
      })
    ).subscribe();
  }
  onFriendSelected(user:IUser){
    
    this.chatService.chatRecipient$.pipe(
      take(1),
      filter(chatRecipient => chatRecipient?.email !== user.email),
      mergeMap(()=>{
        this.chatService.stopHubConnectionAndDeleteMessageThread();
        return from(this.chatService.createHubConnection(user.email, this.oAuthService.getAccessToken()))
      })
    ).subscribe(()=>{
      this.chatService.chatRecipientSource.next(user)
    });

  }
  declineAcceptedFriendInvitation(friend:IUser){
    this.messagesService.declineAcceptedFriendInvitation(friend,this.userClaims['sub']).subscribe(invitations=>{
      //this.allFriendsInvitationsSource.next(invitations);
      this.toastrService.success("you removed the user from friends.");
    });
  }
}
