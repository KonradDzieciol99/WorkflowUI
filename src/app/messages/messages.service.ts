import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, map, mergeMap, Observable, of, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFriendInvitation } from '../shared/models/IFriendInvitation';
//import { Group } from '../shared/models/IGroup';
import { Message } from '../shared/models/IMessage';
import { IPerson } from '../shared/models/IPerson';
import { ISearchedUser } from '../shared/models/ISearchedUser';
import { ISimplePerson } from '../shared/models/ISimplePerson';

@Injectable({
  providedIn: 'root'
})
export class MessagesService  {
  //private baseUrl = environment.apiUrl;
  private confirmedInvitationsSource : BehaviorSubject<IFriendInvitation[]>=new BehaviorSubject<IFriendInvitation[]>([]);;
  confirmedInvitations$:Observable<IFriendInvitation[]> = this.confirmedInvitationsSource.asObservable();
  private onlineUsersSource = new BehaviorSubject<ISimplePerson[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  private invitationRequestSource = new BehaviorSubject<IFriendInvitation[]>([]);
  invitationRequests$ = this.invitationRequestSource.asObservable();
  friends$ = new Observable<Array<IPerson>>();

  //invitations$: Observable<Array<IFriendInvitation>> ;
  private chatUrl:string;
  private identityServerUrl:string
  private hubUrl:string; 
  private hubConnection: HubConnection|undefined;
  //private messageThreadSource:BehaviorSubject<Message[]>;
  //messageThread$:Observable<Message[]>;
  //private recipientIsWatchingSource:BehaviorSubject<boolean>;
  //recipientIsWatching$:Observable<boolean>;
  constructor(private http: HttpClient) {
    this.chatUrl = environment.chatUrl;
    this.hubUrl=environment.signalRhubUrl;
    this.identityServerUrl=environment.identityServerUrl
    // this.messageThreadSource = new BehaviorSubject<Message[]>([]);
    // this.messageThread$ = this.messageThreadSource.asObservable();
    // this.recipientIsWatchingSource = new BehaviorSubject<boolean>(false);
    // this.recipientIsWatching$ = this.recipientIsWatchingSource.asObservable();
   }
  findUsersByEmailAndCheckState(email:string){
    //return this.http.get<Array<ISearchedFriend>>(`${this.chatUrl}api/Users/test/${email}`);
    return this.http.get<Array<ISearchedUser>>(`${this.identityServerUrl}/IdentityUser/search/${email}`);
  }
  sendInvitation(user:IPerson){
    return this.http.post(`${this.chatUrl}/FriendRequests`,user);
  }
  getAllFriendInvitation(){
    return this.http.get<IFriendInvitation[]>(`${this.chatUrl}/FriendRequests/GetAllInvitations`).pipe(
      take(1),
      tap(invitations=>this.invitationRequestSource.next(invitations))
    );
  }

  getFriendsWithActivityStatus(user:IPerson){
    return combineLatest({confirmedInvitations: this.confirmedInvitations$, activeUsers: this.onlineUsers$})
    .pipe(
      map(response=> {
        return response.confirmedInvitations.map(invitation=>{
          let friendEmail = invitation.inviterUserEmail === user.email ? invitation.invitedUserEmail : invitation.inviterUserEmail;
          let friendId =  invitation.inviterUserId === user.id ? invitation.invitedUserId : invitation.inviterUserId;
          let friendPhoto = invitation.inviterPhotoUrl === user.photoUrl ? invitation.invitedPhotoUrl : invitation.inviterPhotoUrl
          let person : IPerson ={
            email: friendEmail,
            id: friendId,
            photoUrl: friendPhoto,
            isOnline: false,
          }
          if(response.activeUsers.find(x=>x.userEmail===friendEmail)){person.isOnline=true;}
          return person;
        })
      }),
    );
    // this.friends$ = combineLatest({confirmedInvitations: this.confirmedInvitations$, activeUsers: this.onlineUsers$})
    // .pipe(
    //   map(response=> {
    //     return response.confirmedInvitations.map(invitation=>{
    //       let friendEmail = invitation.inviterUserEmail === user.email ? invitation.invitedUserEmail : invitation.inviterUserEmail;
    //       let friendId =  invitation.inviterUserId === user.id ? invitation.invitedUserId : invitation.inviterUserId;
    //       let friendPhoto = invitation.inviterPhotoUrl === user.photoUrl ? invitation.invitedPhotoUrl : invitation.inviterPhotoUrl
    //       let person : IPerson ={
    //         email: friendEmail,
    //         id: friendId,
    //         photoUrl: friendPhoto,
    //         isOnline: false,
    //       }
    //       if(response.activeUsers.find(x=>x.userEmail===friendEmail)){person.isOnline=true;}
    //       return person;
    //     })


    //   }),
     
    // );
  }
  // acceptFriendInvitation(invitation:IFriendInvitation){
  //   return this.http.post(`${this.chatUrl}api/FriendInvitation/AcceptFriendInvitation`,invitation).pipe(
  //     mergeMap(()=> {
  //       return this.invitations$.pipe(
  //         take(1),
  //         map(invitations=>invitations.filter(x=>x!==invitation)),
  //         tap(invitations=>this.invitationsSource.next(invitations)))
  //     }),
  //   );
  // }
  acceptFriendInvitation(invitationId:{inviterUserId:string,invitedUserId:string}){

    //{inviterUserId:string,invitedUserId:string}
    return this.http.post(`${this.chatUrl}api/FriendRequests/AcceptFriendInvitation`,invitationId).pipe(
      mergeMap(()=> {
        return this.invitationRequests$.pipe(
          take(1),
          map(invitations=>{
            let invitationIndex = invitations.findIndex(invitation=>{
             return (invitation.inviterUserId===invitationId.invitedUserId && invitation.invitedUserId === invitationId.inviterUserId) 
             || (invitation.inviterUserId===invitationId.inviterUserId && invitation.invitedUserId === invitationId.invitedUserId)
            })
            if (invitationIndex !== -1) {
              invitations.splice(invitationIndex)
              this.invitationRequestSource.next(invitations)
            }
          }))
      })
    );
  }
  declineFriendInvitation(invitationId:{inviterUserId:string,invitedUserId:string}){
    return this.http.post(`${this.chatUrl}api/FriendInvitation/DeclineFriendInvitation`,invitationId).pipe(
      mergeMap(()=> {
        return this.invitationRequests$.pipe(
          take(1),
          map(invitations=>{
            let invitationIndex = invitations.findIndex(invitation=>{
             return (invitation.inviterUserId===invitationId.invitedUserId && invitation.invitedUserId === invitationId.inviterUserId) 
             || (invitation.inviterUserId===invitationId.inviterUserId && invitation.invitedUserId === invitationId.invitedUserId)
            })
            if (invitationIndex !== -1) {
              invitations.splice(invitationIndex)
              this.invitationRequestSource.next(invitations)
            }
          }))
      })
    );
  }

  // declineAcceptedFriendInvitation(invitation:IFriendInvitation){
  //   return this.http.post(`${this.chatUrl}api/FriendInvitation/DeclineFriendInvitation`,invitation)
  // }

  declineAcceptedFriendInvitation(invitationId:{inviterUserId:string,invitedUserId:string}){

    return this.http.post(`${this.chatUrl}api/FriendInvitation/DeclineFriendInvitation`,invitationId).pipe(
      take(1),
      tap(x=>{this.confirmedInvitations$.pipe(take(1)).subscribe(invitations=>{
        let invitationIndex = invitations.findIndex(invitation=>{
          return (invitation.inviterUserId===invitationId.invitedUserId && invitation.invitedUserId === invitationId.inviterUserId) 
          || (invitation.inviterUserId===invitationId.inviterUserId && invitation.invitedUserId === invitationId.invitedUserId)
         });
         if (invitationIndex !== -1) {
          invitations.splice(invitationIndex)
          this.confirmedInvitationsSource.next(invitations)
        }
      })}
    ))
  }

  getAllFriends(){ //zakkceptowane zaproszenia
    return this.http.get<IFriendInvitation[]>(`${this.chatUrl}api/FriendInvitation/GetAllFriends`).pipe(
      take(1),
      tap(friends=>this.confirmedInvitationsSource.next(friends))
    );
  }
  createHubConnection(userAccessToken:string):Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl +'Messages', {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    // this.hubConnection.on('ReceiveMessageThread', messages => {
    //   this.messageThreadSource.next(messages);
    // })

    // this.hubConnection.on('UpdatedGroup', (group: Array<string>) => {
      
    //   if (group.some(x => x === recipientEmail)) {
    //     this.messageThread$.pipe(take(1)).subscribe({
    //       next: messages => {
    //         messages.forEach(message => {
    //           if (!message.dateRead) {
    //             message.dateRead = new Date(Date.now())
    //           }
    //         })
    //         this.messageThreadSource.next([...messages]);
    //       }
    //     })
    //     this.recipientIsWatchingSource.next(true);
    //   }
    //   else{
    //     this.recipientIsWatchingSource.next(false);
    //   }
    // })

    // this.hubConnection.on('NewMessage', message => {
    //   this.messageThread$.pipe(take(1)).subscribe({
    //     next: messages => {
    //       this.messageThreadSource.next([...messages, message])
    //     }
    //   })
    // });

    this.hubConnection.on('UserIsOnline', (person:ISimplePerson) => {
      this.onlineUsers$.pipe(take(1)).subscribe(x => {
        var z = x.findIndex(x=>x.userEmail == person.userEmail)
        if (z == -1){
          this.onlineUsersSource.next([...x, person]);
        }
      })
    });

    this.hubConnection.on('UserIsOffline', (person:ISimplePerson) => {
      this.onlineUsers$.pipe(take(1)).subscribe(x => {
        this.onlineUsersSource.next([...x.filter(x => x.userEmail !== person.userEmail)]);
      })
    });

    this.hubConnection.on('GetOnlineUsers', (persons: ISimplePerson[]) => {
      this.onlineUsersSource.next(persons);
    });

    this.hubConnection.on('FriendInvitationAccepted', (invitation: IFriendInvitation) => { ///FriendActeptedmyInvitation
      this.confirmedInvitations$.pipe(take(1)).subscribe(invitations=>{///FriendActeptedmyInvitation
        this.confirmedInvitationsSource.next([...invitations,invitation]);
      })//totaj nie intations tylko friends!!
    });
    this.hubConnection.on('NewInvitationToFriendsReceived', (invitation: IFriendInvitation) => { ///FriendActeptedmyInvitation
      this.invitationRequests$.pipe(take(1)).subscribe(invitations=>{///FriendActeptedmyInvitation
        this.invitationRequestSource.next([...invitations,invitation]);
      })
    });
    var hubConnectionState = this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(/*() => this.busyService.idle()*/);

    return hubConnectionState;
  }

  stopHubConnection() {
    if (this.hubConnection) {
      //this.messageThreadSource.next([]);
      this.hubConnection.stop();
    }
  }
  // async sendMessage(recipientEmail: string, content: string) {
  //   return this.hubConnection?.invoke('SendMessage', {recipientEmail: recipientEmail, content:content})
  //     .catch(error => console.log(error));
  // }
  // sendMessage(recipientEmail: string, content: string){
  //   return this.http.post(`${this.chatUrl}api/Chat`,{recipientEmail: recipientEmail, content:content});
  // }

  // getMessageThreadAndAssign(recipientEmail: string){
  //   return this.http.get<Message[]>(`${this.chatUrl}api/Chat?recipientEmail=${recipientEmail}`).pipe(
  //     tap(messages => this.messageThreadSource.next(messages))
  //   );
  // }

    // this.hubConnection.on('ReceiveMessageThread', messages => {
    //   this.messageThreadSource.next(messages);
    // })
}

// declineFriendInvitation(invitationId:{inviterUserId:string,invitedUserId:string}){
//   return this.http.post(`${this.chatUrl}api/FriendInvitation/DeclineFriendInvitation`,invitation).pipe(
//     mergeMap(()=> {
//       return this.invitations$.pipe(
//         take(1),
//         map(invitations=>invitations.filter(x=>x!==invitation)),
//         tap(invitations=>this.invitationsSource.next(invitations)))
//     }),
//   );
// }