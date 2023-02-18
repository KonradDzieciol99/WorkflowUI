import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFriendInvitation } from '../shared/models/IFriendInvitation';
//import { Group } from '../shared/models/IGroup';
import { Message } from '../shared/models/IMessage';
import { IPerson } from '../shared/models/IPerson';
import { ISearchedFriend } from '../shared/models/ISearchedFriend';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  //private baseUrl = environment.apiUrl;
  private onlineUsersSource = new BehaviorSubject<IPerson[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  private chatUrl:string;
  private hubUrl:string; 
  private hubConnection: HubConnection|undefined;
  //private messageThreadSource:BehaviorSubject<Message[]>;
  //messageThread$:Observable<Message[]>;
  //private recipientIsWatchingSource:BehaviorSubject<boolean>;
  //recipientIsWatching$:Observable<boolean>;
  constructor(private http: HttpClient) {
    this.chatUrl = environment.chatUrl;
    this.hubUrl=environment.signalRhubUrl;
    // this.messageThreadSource = new BehaviorSubject<Message[]>([]);
    // this.messageThread$ = this.messageThreadSource.asObservable();
    // this.recipientIsWatchingSource = new BehaviorSubject<boolean>(false);
    // this.recipientIsWatching$ = this.recipientIsWatchingSource.asObservable();
   }
  findUsersByEmailAndCheckState(email:string){
    return this.http.get<Array<ISearchedFriend>>(`${this.chatUrl}api/Users/test/${email}`);
  }
  addUserToFriends(user:IPerson){
    return this.http.post(`${this.chatUrl}api/FriendInvitation`,user);
  }
  getAllFriendInvitation(){
    return this.http.get<Array<IFriendInvitation>>(`${this.chatUrl}api/FriendInvitation/GetAllInvitations`);
  }
  acceptFriendInvitation(invitation:IFriendInvitation){
    return this.http.post(`${this.chatUrl}api/FriendInvitation/AcceptFriendInvitation`,invitation);
  }
  declineFriendInvitation(invitation:IFriendInvitation){
    return this.http.post(`${this.chatUrl}api/FriendInvitation/DeclineFriendInvitation`,invitation);
  }
  getAllFriends(){
    return this.http.get<Array<IFriendInvitation>>(`${this.chatUrl}api/FriendInvitation/GetAllFriends`);
  }
  createHubConnection(userAccessToken:string):Promise<void> {
    //this.busyService.busy();
    //user: IPerson,
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

    this.hubConnection.on('UserIsOnline', (person:IPerson) => {
      this.onlineUsers$.pipe(take(1)).subscribe(x => {
        var z = x.findIndex(x=>x.email == person.email)
        if (z == -1){
          this.onlineUsersSource.next([...x, person]);
        }
      })
    })

    this.hubConnection.on('UserIsOffline', (person:IPerson) => {
      this.onlineUsers$.pipe(take(1)).subscribe(x => {
        this.onlineUsersSource.next([...x.filter(x => x.email !== person.email)]);
      })
    })

    this.hubConnection.on('GetOnlineUsers', (persons: IPerson[]) => {
      this.onlineUsersSource.next(persons);
    })
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
