import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, combineLatest, concatMap, map, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFriendInvitation } from '../shared/models/IFriendInvitation';
import { IUser } from '../shared/models/IUser';
import { ISearchedUser } from '../shared/models/ISearchedUser';
import { PresenceService } from '../shared/services/presence.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class MessagesService  {
  private confirmedInvitationsSource : BehaviorSubject<IFriendInvitation[]>;
  confirmedInvitations$:Observable<IFriendInvitation[]>;
  //onlineUsers$:Observable<string[]>; 
  private receivedFriendRequestsSource: BehaviorSubject<IFriendInvitation[]>;
  receivedFriendRequests$ :Observable<IFriendInvitation[]>; 
  friendsWithActivityStatus$:Observable<IUser[]>; 
  private chatUrl:string;
  private identityServerUrl:string
  private aggregatorUrl:string
  private hubUrl:string; 
  private hubConnection?: HubConnection;
  constructor(private http: HttpClient,private readonly presenceService:PresenceService,private readonly oAuthService: OAuthService) {
    this.chatUrl = environment.chatUrl;
    this.hubUrl=environment.signalRhubUrl;
    this.identityServerUrl=environment.identityServerUrl;
    this.aggregatorUrl=environment.aggregator;
    //this.onlineUsers$ = presenceService.onlineUsers$; // sunscription?
    this.confirmedInvitationsSource = new BehaviorSubject<IFriendInvitation[]>([]);
    this.confirmedInvitations$ = this.confirmedInvitationsSource.asObservable();
    this.receivedFriendRequestsSource = new BehaviorSubject<IFriendInvitation[]>([]);
    this.receivedFriendRequests$= this.receivedFriendRequestsSource.asObservable();

    const userClaims = this.oAuthService.getIdentityClaims();

    let user:IUser = {
      email: userClaims['email'],
      id: userClaims['sub'],
      photoUrl: userClaims['picture']
    }

    this.friendsWithActivityStatus$ = this.getFriendsWithActivityStatus(user);
   }
  findUsersByEmailAndCheckState(email:string){
    return this.http.get<Array<ISearchedUser>>(`${this.aggregatorUrl}/Identity/search/${email}`);
  }
  sendInvitation(user:IUser){
    return this.http.post<IFriendInvitation>(`${this.chatUrl}/FriendRequests`,user);
  }
  GetReceivedFriendRequests(){
    return this.http.get<IFriendInvitation[]>(`${this.chatUrl}/FriendRequests/GetReceivedFriendRequests`).pipe(
      take(1),
      tap(invitations=>this.receivedFriendRequestsSource.next(invitations))
    );
  }

  private getFriendsWithActivityStatus(user:IUser){
    return combineLatest([this.confirmedInvitations$,this.presenceService.onlineUsers$])
    .pipe(
      map(([confirmedInvitations,onlineUsers])=> {
        return confirmedInvitations.map(invitation=>{
          let friendEmail = invitation.inviterUserEmail === user.email ? invitation.invitedUserEmail : invitation.inviterUserEmail;
          let friendId =  invitation.inviterUserId === user.id ? invitation.invitedUserId : invitation.inviterUserId;
          let friendPhoto = invitation.inviterPhotoUrl === user.photoUrl ? invitation.invitedPhotoUrl : invitation.inviterPhotoUrl
          let person : IUser ={
            email: friendEmail,
            id: friendId,
            photoUrl: friendPhoto,
            isOnline: false,
          }
          if(onlineUsers.find(x=>x===friendEmail)){person.isOnline=true;}
          return person;
        })
      }),
    );
  }
  acceptFriendInvitation(invitationId:{inviterUserId:string,invitedUserId:string}){
    return this.http.put(`${this.chatUrl}/FriendRequests/${invitationId.inviterUserId}`,{}).pipe(
      mergeMap(()=> {
        return this.receivedFriendRequests$.pipe(
          take(1),
          tap(receivedFriendRequests=>{
            let newReceivedFriendRequests = receivedFriendRequests.filter(receivedFriendRequest=>{
              return !((receivedFriendRequest.inviterUserId===invitationId.invitedUserId && receivedFriendRequest.invitedUserId === invitationId.inviterUserId) 
              || (receivedFriendRequest.inviterUserId===invitationId.inviterUserId && receivedFriendRequest.invitedUserId === invitationId.invitedUserId));
            })
            this.receivedFriendRequestsSource.next(newReceivedFriendRequests);
          }))
      })
    );
  }
  declineFriendInvitation(invitationId:{inviterUserId:string,invitedUserId:string}){
    return this.http.delete(`${this.chatUrl}/FriendRequests/${invitationId.inviterUserId}`).pipe(
      mergeMap(()=> {
        return this.receivedFriendRequests$.pipe(
          take(1),
          map(invitations=>{
            let invitationIndex = invitations.findIndex(invitation=>{
             return (invitation.inviterUserId===invitationId.invitedUserId && invitation.invitedUserId === invitationId.inviterUserId) 
             || (invitation.inviterUserId===invitationId.inviterUserId && invitation.invitedUserId === invitationId.invitedUserId)
            })
            if (invitationIndex !== -1) {
              invitations.splice(invitationIndex,1)//?? invitations.splice(invitationIndex)
              this.receivedFriendRequestsSource.next(invitations)
            }
          }))
      })
    );
  }
  // declineAcceptedFriendInvitation(friendId:string,currentUserId:string){
  //   //invitationId:{inviterUserId:string,invitedUserId:string}
  //   return this.http.delete(`${this.chatUrl}/FriendRequests/${friendId}`).pipe(
  //     take(1),
  //     tap(x=>{this.confirmedInvitations$.pipe(take(1)).subscribe(invitations=>{
  //       let invitationIndex = invitations.findIndex(invitation=>{
  //         return (invitation.inviterUserId===friendId && invitation.invitedUserId === currentUserId) 
  //         || (invitation.inviterUserId===currentUserId && invitation.invitedUserId === friendId)
  //        });
  //        if (invitationIndex !== -1) {
  //         invitations.splice(invitationIndex,1)//invitations.splice(invitationIndex)
  //         this.confirmedInvitationsSource.next(invitations)
  //       }
  //     })}
  //   ))
  // }

  declineAcceptedFriendInvitation(friend:IUser, currentUserId:string) {
    return this.http.delete(`${this.chatUrl}/FriendRequests/${friend.id}`).pipe(
      take(1),
      concatMap(() =>
        combineLatest([
          this.confirmedInvitations$,
          this.presenceService.onlineUsers$
        ]).pipe(take(1))
      ),
      tap(([confirmedInvitations, onlineUsers]) => {
        var filteredConfirmedInvitations = confirmedInvitations.filter(confirmedInvitation =>
          !((confirmedInvitation.inviterUserId === friend.id && confirmedInvitation.invitedUserId === currentUserId) 
          || (confirmedInvitation.inviterUserId === currentUserId && confirmedInvitation.invitedUserId === friend.id))
        );
        this.confirmedInvitationsSource.next(filteredConfirmedInvitations);
        var filteredOnlineUsers = onlineUsers.filter(email=>email !== friend.email)
        this.presenceService.onlineUsersSource.next(filteredOnlineUsers);
      }),
     
    );
  }
  
  GetConfirmedFriendRequests(){ //zakkceptowane zaproszenia
    return this.http.get<IFriendInvitation[]>(`${this.chatUrl}/FriendRequests/GetConfirmedFriendRequests`).pipe(
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

    this.hubConnection.on('FriendInvitationAccepted', (invitation: IFriendInvitation) => { ///FriendActeptedmyInvitation
      this.confirmedInvitations$.pipe(take(1)).subscribe(invitations=>{///FriendActeptedmyInvitation
        this.confirmedInvitationsSource.next([...invitations,invitation]);
      })//totaj nie intations tylko friends!!
    });
    this.hubConnection.on('NewInvitationToFriendsReceived', (invitation: IFriendInvitation) => { ///FriendActeptedmyInvitation
      this.receivedFriendRequests$.pipe(take(1)).subscribe(invitations=>{///FriendActeptedmyInvitation
        this.receivedFriendRequestsSource.next([...invitations,invitation]);
      })
    });
    this.hubConnection.on('FriendRequestRemoved', (removerEmail: string) => {
      combineLatest([
        this.confirmedInvitations$,
        this.presenceService.onlineUsers$
      ]).pipe(
        take(1),
      ).subscribe(([confirmedInvitations, onlineUsers])=>{
        var filterdConfirmedInvitations = confirmedInvitations.filter(c=>!(c.invitedUserEmail===removerEmail || c.inviterUserEmail === removerEmail));
        this.confirmedInvitationsSource.next(filterdConfirmedInvitations);
        var filteredOnlineUsers = onlineUsers.filter(email=>email !== removerEmail)
        this.presenceService.onlineUsersSource.next(filteredOnlineUsers);
      })
    });

    var hubConnectionState = this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(/*() => this.busyService.idle()*/);

    return hubConnectionState;
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
