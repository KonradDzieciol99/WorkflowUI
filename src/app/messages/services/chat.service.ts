import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { Message } from 'src/app/shared/models/IMessage';
import { IPerson } from 'src/app/shared/models/IPerson';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private onlineUsersSource = new BehaviorSubject<IPerson[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  private chatUrl:string;
  private hubUrl:string; 
  private hubConnection: HubConnection|undefined;
  private messageThreadSource:BehaviorSubject<Message[]>;
  messageThread$:Observable<Message[]>;
  private recipientIsWatchingSource:BehaviorSubject<boolean>;
  recipientIsWatching$:Observable<boolean>;
  constructor(private http: HttpClient) {
    this.chatUrl = environment.chatUrl;
    this.hubUrl=environment.signalRhubUrl;
    this.messageThreadSource = new BehaviorSubject<Message[]>([]);
    this.messageThread$ = this.messageThreadSource.asObservable();
    this.recipientIsWatchingSource = new BehaviorSubject<boolean>(false);
    this.recipientIsWatching$ = this.recipientIsWatchingSource.asObservable();
   }

  createHubConnection(recipientEmail:string,userAccessToken:string):Promise<void> {
    //this.busyService.busy();
    //user: IPerson,
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'Chat?RecipientEmail=' + recipientEmail, {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    // this.hubConnection.on('ReceiveMessageThread', messages => {
    //   this.messageThreadSource.next(messages);
    // })

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
    });
    
    var hubConnectionState = this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(/*() => this.busyService.idle()*/);

    return hubConnectionState;
  }
  sendMessage(recipientEmail: string, content: string){
    return this.http.post(`${this.chatUrl}api/Chat`,{recipientEmail: recipientEmail, content:content});
  }

  getMessageThreadAndAssign(recipientEmail: string){
    return this.http.get<Message[]>(`${this.chatUrl}api/Chat?recipientEmail=${recipientEmail}`).pipe(
      tap(messages => this.messageThreadSource.next(messages))
    );
  }
  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop();
    }
  }
}
