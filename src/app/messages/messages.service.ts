import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
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
  private socialApiUrl:string;
  private hubUrl:string; 
  private hubConnection: HubConnection|undefined;
  private messageThreadSource:BehaviorSubject<Message[]>;
  messageThread$:Observable<Message[]>;
  private recipientIsWatchingSource:BehaviorSubject<boolean>;
  recipientIsWatching$:Observable<boolean>;
  constructor(private http: HttpClient) {
    this.socialApiUrl = environment.socialApiUrl;
    this.hubUrl=environment.socialApihubUrl;
    this.messageThreadSource = new BehaviorSubject<Message[]>([]);
    this.messageThread$ = this.messageThreadSource.asObservable();
    this.recipientIsWatchingSource = new BehaviorSubject<boolean>(false);
    this.recipientIsWatching$ = this.recipientIsWatchingSource.asObservable();
   }
  findUsersByEmailAndCheckState(email:string){
    return this.http.get<Array<ISearchedFriend>>(`${this.socialApiUrl}api/Users/test/${email}`);
  }
  addUserToFriends(user:IPerson){
    return this.http.post(`${this.socialApiUrl}api/FriendInvitation`,user);
  }
  getAllFriendInvitation(){
    return this.http.get<Array<IFriendInvitation>>(`${this.socialApiUrl}api/FriendInvitation/GetAllInvitations`);
  }
  acceptFriendInvitation(invitation:IFriendInvitation){
    return this.http.post(`${this.socialApiUrl}api/FriendInvitation/AcceptFriendInvitation`,invitation);
  }
  declineFriendInvitation(invitation:IFriendInvitation){
    return this.http.post(`${this.socialApiUrl}api/FriendInvitation/DeclineFriendInvitation`,invitation);
  }
  getAllFriends(){
    return this.http.get<Array<IFriendInvitation>>(`${this.socialApiUrl}api/FriendInvitation/GetAllFriends`);
  }
  createHubConnection(recipientEmail:string,userAccessToken:string) {
    //this.busyService.busy();
    //user: IPerson,
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'Messages?RecipientEmail=' + recipientEmail, {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(/*() => this.busyService.idle()*/);

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    })

    this.hubConnection.on('UpdatedGroup', (group: Array<string>) => {
      
      if (group.some(x => x === recipientEmail)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages => {
            messages.forEach(message => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now())
              }
            })
            this.messageThreadSource.next([...messages]);
          }
        })
        this.recipientIsWatchingSource.next(true);
      }
      else{
        this.recipientIsWatchingSource.next(false);
      }
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next([...messages, message])
        }
      })
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop();
    }
  }
  async sendMessage(recipientEmail: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', {recipientEmail: recipientEmail, content:content})
      .catch(error => console.log(error));
  }
}
