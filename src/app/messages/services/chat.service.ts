import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, concatMap, debounce, debounceTime, delay, filter, from, interval, map, mergeMap, Observable, of, skip, take, takeUntil, tap, timer } from 'rxjs';
import { IChatGroupMember } from 'src/app/shared/models/IChatGroupMember';
import { Message } from 'src/app/shared/models/IMessage';
import { IUser } from 'src/app/shared/models/IUser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatUrl:string;
  private hubUrl:string; 
  private hubConnection?: HubConnection;
  private messageThreadSource:BehaviorSubject<Message[]|undefined>;
  messageThread$:Observable<Message[]|undefined>;
  private recipientIsWatchingSource:BehaviorSubject<boolean>;
  chatRecipientSource:BehaviorSubject<IUser|undefined>;
  recipientIsWatching$:Observable<boolean>;
  recipientIsTypingSource:BehaviorSubject<boolean>;
  recipientIsTyping$:Observable<boolean>;
  chatRecipient$: Observable<IUser | undefined>;
  constructor(private http: HttpClient) {
    this.chatUrl = environment.chatUrl;
    this.hubUrl=environment.signalRhubUrl;
    this.messageThreadSource = new BehaviorSubject<Message[]|undefined>(undefined);
    this.messageThread$ = this.messageThreadSource.asObservable();
    this.recipientIsWatchingSource = new BehaviorSubject<boolean>(false);
    this.recipientIsWatching$ = this.recipientIsWatchingSource.asObservable();
    this.recipientIsTypingSource = new BehaviorSubject<boolean>(false);
    this.recipientIsTyping$ = this.recipientIsTypingSource.asObservable();
    this.chatRecipientSource = new BehaviorSubject<IUser|undefined>(undefined);
    this.chatRecipient$ = this.chatRecipientSource.asObservable()
   }

  createHubConnection(recipientEmail:string,userAccessToken:string):Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'Chat?RecipientEmail=' + recipientEmail, {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessageThread', (messages:Message[]) => {
      this.messageThreadSource.next(messages.reverse());
    })
    
    this.hubConnection.on('UserIsTyping', (userEmail: string) => { 
      if (userEmail === recipientEmail) {

        this.recipientIsTypingSource.next(true)

        this.recipientIsTyping$.pipe(
          takeUntil(this.messageThread$.pipe(skip(1))),
          debounceTime(1500),
          take(1),
        ).subscribe({ 
          next:()=> this.recipientIsTypingSource.next(false),
          complete:()=>this.recipientIsTypingSource.next(false)
        }) 

      }
    })

    this.hubConnection.on('UpdatedGroup', (group: Array<string>) => {
      let recipient = group.find(x => x === recipientEmail)
      if (recipient) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages => {
            messages?.forEach(message => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now())
              }
            })
            this.messageThreadSource.next(messages ? [...messages] : undefined);
          }
        })
        this.recipientIsWatchingSource.next(true);
      }
      else{
        this.recipientIsWatchingSource.next(false);
      }
    })

    this.hubConnection.on('NewMessage', (message:Message) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: (messages) => {
          this.messageThreadSource.next(messages ? [...messages, message] : [message] );
        }
      })
    });
    
    var hubConnectionState = this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(/*() => this.busyService.idle()*/);

    return hubConnectionState;
  }
  userIsTyping(){
    if (this.hubConnection) {
      const promise = this.hubConnection.invoke<void>("UserIsTyping");
      return from(promise);
    }
    return of()
  }
  sendMessage(recipient: IUser, content: string){
    return this.http.post(`${this.chatUrl}/Messages`,{recipientUserId:recipient.id,recipientEmail: recipient.email, content:content});
  }
  getMessages(recipient:IUser,take:number=15): Observable<Message[]>{
    return this.messageThread$.pipe(
      filter((messages): messages is Message[] => messages !== undefined),
      concatMap((currentMessages)=> {

        let params = new HttpParams();
        
        params = params.append('RecipientEmail', recipient.email);
        params = params.append('RecipientId', recipient.id);
        params = params.append('Skip', currentMessages.length.toString());
        params = params.append('Take', take.toString());

        return this.http.get<Array<Message>>(`${this.chatUrl}/Messages`,{params: params}).pipe(         
            tap((oldestMessages)=>{
              this.messageThreadSource.next([...oldestMessages.reverse(), ...currentMessages]);
            })
          );
      })
    )
  }
  stopHubConnectionAndDeleteMessageThread() {
    if (this.hubConnection) {
      this.messageThreadSource.next(undefined);
      this.chatRecipientSource.next(undefined);
      this.hubConnection.stop();
    }
  }
}
