import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Observable, of, switchMap, take, tap } from 'rxjs';
import { IFriendInvitation } from '../shared/models/IFriendInvitation';
import { IUser } from '../shared/models/IUser';
import { ISearchedUser, UserFriendStatusType } from '../shared/models/ISearchedUser';
import { MessagesService } from './messages.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messagesForm: FormGroup = new FormGroup({
    searchNewUsers: new FormControl<string>('',[]),
  });
  custom="border border-0";
  searchNewUsers$: Observable<Array<ISearchedUser>> ;
  searchNewUsersSource: BehaviorSubject<Array<ISearchedUser>>;
  //invitations$: Observable<Array<IFriendInvitation>> ;
  //friends$: Observable<Array<IPerson>>;
  userClaims: Record<string, any>;
  messageContent?:FormControl;
  //loading?:boolean;
  // private allFriendsInvitationsSource : BehaviorSubject<IFriendInvitation[]>;
  // allFriendsInvitations$:Observable<IFriendInvitation[]>;
  UserFriendStatusTypes: typeof UserFriendStatusType = UserFriendStatusType;
  friendsWithActivityStatus$?: Observable<IUser[]>;

  constructor(public messagesService:MessagesService,
    private toastrService: ToastrService,
    private readonly oAuthService: OAuthService,
    public chatService:ChatService)
    { 
      this.userClaims = this.oAuthService.getIdentityClaims();
      this.searchNewUsersSource = new BehaviorSubject<Array<ISearchedUser>>([]);
      this.searchNewUsers$ = this.searchNewUsersSource.asObservable();
    }


  ngOnInit(): void {
    this.messageContent = new FormControl('Hello');
    this.friendsWithActivityStatus$ = this.messagesService.friendsWithActivityStatus$;
    //this.messagesService.receivedFriendRequests$.subscribe(x=>x.length)
    this.messagesService.stopHubConnection();
    this.messagesService.createHubConnection(this.oAuthService.getAccessToken())
    //this.searchNewUsers$=
    this.messagesForm.get('searchNewUsers')?.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap((term: string)=>{
        if (Boolean(term)) {return this.messagesService.findUsersByEmailAndCheckState(term).pipe(take(1));}
        return of([]);
      })
    ).subscribe(searchNewUsers=>{
      this.searchNewUsersSource.next(searchNewUsers);
    });

    merge(
      this.messagesService.GetConfirmedFriendRequests(),
      this.messagesService.GetReceivedFriendRequests(),
    )
    .pipe(
      //retry({count: 10,delay: 3000}),
    )
    .subscribe();
  }


  sendInvitation(searchUser: ISearchedUser) {
    let searchedUser: IUser = {
      email: searchUser.email,
      id: searchUser.id,
      photoUrl: searchUser.photoUrl
    }
  
    this.messagesService.sendInvitation(searchedUser).pipe(
      take(1),
      switchMap(() => this.searchNewUsers$.pipe(take(1))),
    ).subscribe((users: Array<ISearchedUser>) => {
      this.toastrService.success("The invitation has been sent.")
      const searchNewUsers = users.map(user =>
        user.id === searchUser.id ? { ...user, status: UserFriendStatusType.InvitedByYou } : user
      );
      this.searchNewUsersSource.next(searchNewUsers);
    });
  }
  
  acceptFriendInvitation(invitation:IFriendInvitation){
    this.messagesService.acceptFriendInvitation({inviterUserId:invitation.inviterUserId,invitedUserId:invitation.invitedUserId}).subscribe(()=>{
      this.toastrService.success("Invitation accepted.")
    });
  }
  declineAcceptedFriendInvitation(friend:IUser){
    this.messagesService.declineAcceptedFriendInvitation(friend,this.userClaims['sub']).subscribe(invitations=>{
      //this.allFriendsInvitationsSource.next(invitations);
      this.toastrService.success("you removed the user from friends.");
    });
  }

  // declineAcceptedFriendInvitation(friend:IPerson,index:number){
  //   this.allFriendsInvitations$.pipe(
  //     take(1),
  //     mergeMap(invitations => {
  //       let invitation=invitations[index]
  //       if (!invitation) {
  //         this.toastrService.error("invitation could not be found.");
  //         throw new Error("invitation could not be found");
  //       }
  //       return this.messagesService.declineAcceptedFriendInvitation(invitation)
  //     }),
  //     mergeMap(()=>{
  //         return this.allFriendsInvitations$.pipe(take(1),map(invitations=>{
  //           invitations.splice(index,1);
  //           return invitations;
  //         }))}),
  //   ).subscribe(invitations=>{
  //     this.allFriendsInvitationsSource.next(invitations);
  //     this.toastrService.success("Invitation canceled.");
  //   });
  // }
  declineFriendInvitation(invitation:IFriendInvitation){
    this.messagesService.declineFriendInvitation(invitation).subscribe(()=>{
      this.toastrService.success("Invitation canceled.")
      
      //this.invitations$=this.invitations$.pipe(map(invitations=>invitations.filter(x=>x===invitation)));
    });
  }
   chatRecipient:IUser|undefined;
   onFriendSelected(user:IUser){
    
    if (this.chatRecipient?.email!=user.email) {
      this.chatService.stopHubConnectionAndDeleteMessageThread();
      this.chatService.createHubConnection(user.email, this.oAuthService.getAccessToken()).then(()=>{
        this.chatRecipient=user;
        // this.chatService.getMessageThreadAndAssign(user.email).pipe(
        //   take(1)
        //   //retry({count: 5, delay: 500}),
        // ).subscribe();
      });
    }
  }

}