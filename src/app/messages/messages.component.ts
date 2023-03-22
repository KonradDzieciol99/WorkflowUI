import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, forkJoin, from, map, merge, mergeMap, Observable, of, pipe, retry, retryWhen, switchMap, take, tap, zip } from 'rxjs';
import { IFriendInvitation } from '../shared/models/IFriendInvitation';
import { Message } from '../shared/models/IMessage';
import { IPerson } from '../shared/models/IPerson';
import { ISearchedUser, UserFriendStatusType } from '../shared/models/ISearchedUser';
import { IUser } from '../shared/models/IUser';
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
  //invitations$: Observable<Array<IFriendInvitation>> ;
  //friends$: Observable<Array<IPerson>>;
  userClaims: Record<string, any>;
  messageContent:FormControl;
  loading:boolean;
  // private allFriendsInvitationsSource : BehaviorSubject<IFriendInvitation[]>;
  // allFriendsInvitations$:Observable<IFriendInvitation[]>;
  UserFriendStatusTypes: typeof UserFriendStatusType = UserFriendStatusType;
  friends$: Observable<IPerson[]>;

  constructor(public messagesService:MessagesService,
    private toastrService: ToastrService,
    private readonly oAuthService: OAuthService,
    public chatService:ChatService,)
    {
      // this.allFriendsInvitationsSource = new BehaviorSubject<IFriendInvitation[]>([]);
      // this.allFriendsInvitations$ = this.allFriendsInvitationsSource.asObservable();

      this.searchNewUsers$ = new Observable<Array<ISearchedUser>>();
      //this.invitations$ = new Observable<Array<IFriendInvitation>>();
      /////////this.friends$ = new Observable<Array<IFriendInvitation>>(); old
      //this.friends$ = new Observable<Array<IPerson>>();new
      this.userClaims = this.oAuthService.getIdentityClaims();
      this.messageContent = new FormControl('Hello');
      this.loading=false;
     
      let user:IPerson={
        email: this.userClaims['email'],
        id: this.userClaims['sub'],
        photoUrl:this.userClaims['sub']
      }
      this.friends$=this.messagesService.getFriendsWithActivityStatus(user);
      
    }


  ngOnInit(): void {


    this.messagesService.invitationRequests$.subscribe(x=>x.length)

    console.log(this.userClaims)

    // this.messagesService.stopHubConnection();
    // this.messagesService.createHubConnection(this.oAuthService.getAccessToken())


    this.searchNewUsers$=this.messagesForm.controls['searchNewUsers'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string)=>{
        if (Boolean(term)) {return this.messagesService.findUsersByEmailAndCheckState(term).pipe(take(1));}
        return of([]);
      })
    );
    
    //this.invitations$=this.messagesService.getAllFriendInvitation().pipe(take(1));
    
    //this.friends$=this.messagesService.getAllFriends().pipe(take(1));
    // this.friends$=this.messagesService.getAllFriends().pipe(
    //   take(1),
    //   //map
    //   mergeMap((invitations:IFriendInvitation[])=>{

    //     this.messagesService.onlineUsers$.

    //     return invitations.map(invitation=>{
    //       let person : IPerson ={
    //         email: invitation.inviterUserEmail === this.userClaims['email'] ? invitation.invitedUserEmail : invitation.inviterUserEmail,
    //         id: invitation.inviterUserId === this.userClaims['sub'] ? invitation.invitedUserId : invitation.inviterUserId,
    //         photoUrl: invitation.inviterPhotoUrl === this.userClaims['picture'] ? invitation.invitedPhotoUrl : invitation.inviterPhotoUrl,
    //         isOnline: false
    //       }
    //       return person;
    //     })
    //   })
    //   );
    //   let test=this.messagesService.getAllFriends().pipe(
    //     take(1),
    //     //map
    //     mergeMap((invitations:IFriendInvitation[])=>{
    //       return invitations.map(invitation=>{
    //         let person : IPerson ={
    //           email: invitation.inviterUserEmail === this.userClaims['email'] ? invitation.invitedUserEmail : invitation.inviterUserEmail,
    //           id: invitation.inviterUserId === this.userClaims['sub'] ? invitation.invitedUserId : invitation.inviterUserId,
    //           photoUrl: invitation.inviterPhotoUrl === this.userClaims['picture'] ? invitation.invitedPhotoUrl : invitation.inviterPhotoUrl,
    //           isOnline: false
    //         }
    //         return person;
    //       })
    //     })
    //     );
        merge(
          this.messagesService.getAllFriends(),
          this.messagesService.getAllFriendInvitation(),
        )
        .pipe(
          retry({count: 10,delay: 3000}),
        )
        .subscribe();

        // this.messagesService.getAllFriends().subscribe();
        // this.messagesService.getAllFriendInvitation().subscribe();




        // forkJoin({
        //   requestOne: this.messagesService.getAllFriends(),
        //   requestTwo: this.messagesService.getAllFriendInvitation(),
        // })
        // .subscribe(({requestOne, requestTwo}) => {
        //   this.propOne = requestOne;
        //   this.propTwo = requestTwo;
        // });



        //this.allFriendsInvitations$ = this.messagesService.getAllFriends();//take?
        // this.messagesService.getAllFriends().pipe(take(1)).subscribe(res=>{
        //   this.allFriendsInvitationsSource.next(res);
        // });
        // this.friends$ = combineLatest({invitations: this.allFriendsInvitations$, activeUsers: this.messagesService.onlineUsers$})
        // .pipe(
        //   map(response => {
        //     console.log("test");
        //     return response.invitations.map(invitation=>{
        //       let userEmail = invitation.inviterUserEmail === this.userClaims['email'] ? invitation.invitedUserEmail : invitation.inviterUserEmail;
              
        //       let person : IPerson ={
        //         email: userEmail,
        //         id: invitation.inviterUserId === this.userClaims['sub'] ? invitation.invitedUserId : invitation.inviterUserId,
        //         photoUrl: invitation.inviterPhotoUrl === this.userClaims['sub'] ? invitation.invitedPhotoUrl : invitation.inviterPhotoUrl,
        //         isOnline: false,
        //       }
        //       if(response.activeUsers.find(x=>x.userEmail===userEmail)) {person.isOnline=true;}
        //       return person;
        //     })


        //   }),
         
        // );
  }
  sendInvitation(searchUser:ISearchedUser){

    let user:IPerson={
      email: searchUser.email,
      id: searchUser.id
    }

    this.messagesService.sendInvitation(user).pipe(
      take(1),
    ).subscribe(()=>{
      this.toastrService.success("The invitation has been sent.")
      //searchUser.isAlreadyInvited=true;
      searchUser.status=UserFriendStatusType.InvitedByYou;
    });
    
  }
  acceptFriendInvitation(invitation:IFriendInvitation){
    this.messagesService.acceptFriendInvitation({inviterUserId:invitation.inviterUserId,invitedUserId:invitation.invitedUserId}).subscribe(()=>{
      this.toastrService.success("Invitation accepted.")
    });
  }
  declineAcceptedFriendInvitation(friend:IPerson){
    this.messagesService.declineAcceptedFriendInvitation({inviterUserId:friend.id,invitedUserId:this.userClaims['sub']}).subscribe(invitations=>{
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
   chatRecipient:IPerson|undefined;
   onFriendSelected(user:IPerson){
    
    if (this.chatRecipient?.email!=user.email) {
      this.chatService.stopHubConnectionAndDeleteMessageThread();
      this.chatService.createHubConnection(user.email, this.oAuthService.getAccessToken()).then(()=>{
        this.chatRecipient=user;
        this.chatService.getMessageThreadAndAssign(user.email).pipe(
          take(1)
          //retry({count: 5, delay: 500}),
        ).subscribe();
      });
    }
  }

}


// this.friends$ = zip(this.allFriendsInvitations$,
//   this.messagesService.onlineUsers$/* take?*/,
//   (invitations:IFriendInvitation[], activeUsers: IPerson[]) => ({ invitations: invitations, activeUsers: activeUsers}))
// .pipe(
// map(response => {
//   console.log("test");
//   return response.invitations.map(invitation=>{
//     let userEmail = invitation.inviterUserEmail === this.userClaims['email'] ? invitation.invitedUserEmail : invitation.inviterUserEmail;
    
//     let person : IPerson ={
//       email: userEmail,
//       id: invitation.inviterUserId === this.userClaims['sub'] ? invitation.invitedUserId : invitation.inviterUserId,
//       photoUrl: invitation.inviterPhotoUrl === this.userClaims['picture'] ? invitation.invitedPhotoUrl : invitation.inviterPhotoUrl,
//       isOnline: false,
//     }
//     if(response.activeUsers.find(x=>x.email)) {person.isOnline=true;}
//     return person;
//   })


// }),

// );