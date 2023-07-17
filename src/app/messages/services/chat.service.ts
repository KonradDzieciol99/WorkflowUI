import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, debounce, debounceTime, delay, from, interval, map, mergeMap, Observable, of, skip, take, takeUntil, tap, timer } from 'rxjs';
import { IChatGroupMember } from 'src/app/shared/models/IChatGroupMember';
import { Message } from 'src/app/shared/models/IMessage';
import { IUser } from 'src/app/shared/models/IUser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // private onlineUsersSource = new BehaviorSubject<IPerson[]>([]);
  // onlineUsers$ = this.onlineUsersSource.asObservable();
  private chatUrl:string;
  private hubUrl:string; 
  private hubConnection?: HubConnection;
  private messageThreadSource:BehaviorSubject<Message[]>;
  messageThread$:Observable<Message[]>;
  private recipientIsWatchingSource:BehaviorSubject<boolean>;
  recipientIsWatching$:Observable<boolean>;
  recipientIsTypingSource:BehaviorSubject<boolean>;
  recipientIsTyping$:Observable<boolean>;

  constructor(private http: HttpClient) {
    this.chatUrl = environment.chatUrl;
    this.hubUrl=environment.signalRhubUrl;
    this.messageThreadSource = new BehaviorSubject<Message[]>([]);
    this.messageThread$ = this.messageThreadSource.asObservable();
    this.recipientIsWatchingSource = new BehaviorSubject<boolean>(false);
    this.recipientIsWatching$ = this.recipientIsWatchingSource.asObservable();
    this.recipientIsTypingSource = new BehaviorSubject<boolean>(false);
    this.recipientIsTyping$ = this.recipientIsTypingSource.asObservable();
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

    this.hubConnection.on('ReceiveMessageThread', (messages:Message[]) => {
      this.messageThreadSource.next(messages);
    })
    
    this.hubConnection.on('UserIsTyping', (userEmail: string) => { 
      if (userEmail === recipientEmail) {
        // this.recipientIsTyping$.pipe(
        //   take(1),
        //   mergeMap(x=>{
        //     if (x == false) {
        //       return of(this.recipientIsTypingSource.next(true)).pipe(
        //         take(1),
        //         delay(3000),
        //         tap(()=>this.recipientIsTypingSource.next(false))
        //       );
        //     }
        //     return of();
        //   })).subscribe({ 
        //     next:()=> {}
        //   }) 
        this.recipientIsTypingSource.next(true)

        // of(null).pipe(
        //   // take(1),
        //   debounce(() => interval(3000)),
        //   map((event: any) => 1)
        // ).subscribe({ 
        //   next:()=> {this.recipientIsTypingSource.next(false)}
        // }) 
        this.recipientIsTyping$.pipe(
          takeUntil(this.messageThread$.pipe(skip(1))),
          debounceTime(1500),
          take(1),
        ).subscribe({ 
          next:()=> this.recipientIsTypingSource.next(false),
          complete:()=>this.recipientIsTypingSource.next(false)
        }) 

      }

      // this.recipientIsTyping$.pipe(
      //   takeUntil(this.messageThread$),
      //   debounceTime(1500),//https://indepth.dev/reference/rxjs/operators/debounce-time
      // ).subscribe({ 
      //   next:() => this.recipientIsTypingSource.next(false),
      //   complete: () =>this.recipientIsTypingSource.next(false),
      // }) 
    })

    this.hubConnection.on('UpdatedGroup', (group: Array<string>) => { //ActiveUsersInGroup
      let recipient = group.find(x => x === recipientEmail)
      if (recipient) {
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
      else{this.recipientIsWatchingSource.next(false);}

      // if (recipient?.isTyping) {

        //const source = timer(3000);
        // source.
        // of(this.recipientIsTypingSource.next(true)).pipe(
        //   take(1),
        //   delay(3000),
        // )
        // .subscribe({ 
        //   next:()=> this.recipientIsTypingSource.next(false)
        // }) 

        // this.recipientIsTyping$.pipe(
        // take(1),
        // mergeMap(x=>{
        //   if (x == false) {
        //     return of(this.recipientIsTypingSource.next(true)).pipe(
        //       take(1),
        //       delay(3000),
        //       tap(()=>this.recipientIsTypingSource.next(false))
        //     );
        //   }
        //   return of();
        // })).subscribe({ 
        //   next:()=> {}
        // }) 
        
        // .subscribe(x=>{
        //   if (x) {}
        //   else {
        //     this.recipientIsTypingSource.next(true)
        //   }
        // })

      // }
      // else{this.recipientIsTypingSource.next(false);}
      // if (group.some(x => x.userEmail === recipientEmail)) {
      //   this.messageThread$.pipe(take(1)).subscribe({
      //     next: messages => {
      //       messages.forEach(message => {
      //         if (!message.dateRead) {
      //           message.dateRead = new Date(Date.now())
      //         }
      //       })
      //       this.messageThreadSource.next([...messages]);
      //     }
      //   })
      //   this.recipientIsWatchingSource.next(true);
      // }
      // else{
      //   this.recipientIsWatchingSource.next(false);
      // }
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next([...messages, message]);
          //this.me

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
      //.catch(error => console.log(error));
    }
    return of()
  }
  sendMessage(recipient: IUser, content: string){
    return this.http.post(`${this.chatUrl}/Messages`,{recipientUserId:recipient.id,recipientEmail: recipient.email, content:content});
  }
  // sendMessage(recipientEmail: string, content: string){
  //   return this.http.post(`${this.chatUrl}/Messages`,{recipientUserId:,recipientEmail: recipientEmail, content:content});
  // }
  // getMessageThreadAndAssign(recipientEmail: string){
  //   return this.http.get<Message[]>(`${this.chatUrl}api/Chat?recipientEmail=${recipientEmail}`).pipe(
  //     tap(messages => this.messageThreadSource.next(messages))
  //   );
  // }
  stopHubConnectionAndDeleteMessageThread() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop();
    }
  }
}
