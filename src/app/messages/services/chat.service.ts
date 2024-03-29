import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import {
  BehaviorSubject,
  Observable,
  Subject,
  concatMap,
  debounceTime,
  filter,
  from,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { Message } from 'src/app/shared/models/IMessage';
import { IUser } from 'src/app/shared/models/IUser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private hubConnection?: HubConnection;
  private messageThreadSource$: BehaviorSubject<Message[] | undefined>;
  messageThread$: Observable<Message[] | undefined>;
  private recipientIsWatchingSource$: BehaviorSubject<boolean>;
  private chatRecipientSource$: BehaviorSubject<IUser | undefined>;
  recipientIsWatching$: Observable<boolean>;
  private recipientIsTypingSource$: BehaviorSubject<boolean>;
  recipientIsTyping$: Observable<boolean>;
  chatRecipient$: Observable<IUser | undefined>;
  baseUrl: string;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.WorkflowUrl}/chat`;
    this.messageThreadSource$ = new BehaviorSubject(
      undefined as Message[] | undefined,
    );
    this.ngUnsubscribeSource$ = new Subject<void>();
    this.messageThread$ = this.messageThreadSource$.asObservable();
    this.recipientIsWatchingSource$ = new BehaviorSubject(false);
    this.recipientIsWatching$ = this.recipientIsWatchingSource$.asObservable();
    this.recipientIsTypingSource$ = new BehaviorSubject(false);
    this.recipientIsTyping$ = this.recipientIsTypingSource$.asObservable();
    this.chatRecipientSource$ = new BehaviorSubject(
      undefined as IUser | undefined,
    );
    this.chatRecipient$ = this.chatRecipientSource$.asObservable();

    this.recipientIsTyping$
      .pipe(
        debounceTime(1500),
        filter((bool)=> bool !== false),
        takeUntil(this.ngUnsubscribeSource$)
      )
      .subscribe({
        next: () => this.recipientIsTypingSource$.next(false)
      });
  }

  createHubConnection(
    recipientEmail: string,
    userAccessToken: string,
  ): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.WorkflowUrl}/hub/Chat?RecipientEmail=${recipientEmail}`, {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
      this.messageThreadSource$.next(messages.reverse());
    });

    this.hubConnection.on('UserIsTyping', (userEmail: string) => {
      if (userEmail === recipientEmail) 
        this.recipientIsTypingSource$.next(true);
      
    });

    this.hubConnection.on('UpdatedGroup', (group: string[]) => {
      const recipient = group.find((x) => x === recipientEmail);
      if (recipient) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: (messages) => {
            messages?.forEach((message) => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            });
            this.messageThreadSource$.next(
              messages ? [...messages] : undefined,
            );
          },
        });
        this.recipientIsWatchingSource$.next(true);
      } else {
        this.recipientIsWatchingSource$.next(false);
      }
    });

    this.hubConnection.on('NewMessage', (message: Message) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: (messages) => {
          this.messageThreadSource$.next(
            messages ? [...messages, message] : [message],
          );
        },
      });
    });

    const hubConnectionState = this.hubConnection
      .start()
      .catch((error) => console.log(error))
      .finally();

    return hubConnectionState;
  }
  userIsTyping() {
    if (this.hubConnection) {
      const promise = this.hubConnection.invoke<void>('UserIsTyping');
      return from(promise);
    }
    return of();
  }
  sendMessage(recipient: IUser, content: string) {
    return this.http.post(`${this.baseUrl}/api/Messages`, {
      recipientUserId: recipient.id,
      recipientEmail: recipient.email,
      content: content,
    });
  }
  getMessages(recipient: IUser, take = 15) {
    return this.messageThread$.pipe(
      filter((messages): messages is Message[] => messages !== undefined),
      concatMap((currentMessages) => {
        let params = new HttpParams();
        params = params.append('RecipientEmail', recipient.email);
        params = params.append('RecipientId', recipient.id);
        params = params.append('Skip', currentMessages.length.toString());
        params = params.append('Take', take.toString());

        return this.http
          .get<Message[]>(`${this.baseUrl}/api/Messages`, { params: params })
          .pipe(
            tap((oldestMessages) => {
              this.messageThreadSource$.next([
                ...oldestMessages.reverse(),
                ...currentMessages,
              ]);
            }),
          );
      }),
    );
  }
  chatRecipientNext(next: IUser) {
    this.chatRecipientSource$.next(next);
  }
  async stopHubConnectionAndDeleteMessageThread() {
    this.messageThreadSource$.next(undefined);
    this.chatRecipientSource$.next(undefined);
    await this.hubConnection?.stop();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
    this.ngUnsubscribeSource$.complete();
  }

}
