import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, filter, of, switchMap, take, takeUntil } from 'rxjs';
import { Message } from 'src/app/shared/models/IMessage';
import { IUser } from 'src/app/shared/models/IUser';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat[chatRecipient]',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() chatRecipient?: IUser;
  messageContent: FormControl<string>;
  loading: boolean;
  isloadingOlderMessages: boolean;
  hasMoreData: boolean;
  indexOfLastDisplayed?: number;
  hasScrolledOnce: boolean;
  @ViewChildren('messages') messages?: QueryList<ElementRef>;
  @ViewChild('chat') chat?: ElementRef<HTMLDivElement>;
  @ViewChild('formInput') formInput?: ElementRef;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(public chatService: ChatService) {
    this.messageContent = new FormControl('Hello', {
      nonNullable: true,
      validators: [Validators.required],
    });
    this.loading = false;
    this.isloadingOlderMessages = false;
    this.hasMoreData = true;
    this.hasScrolledOnce = false;
    this.ngUnsubscribeSource$ = new Subject<void>();
  }
  ngOnInit(): void {
    this.messageContent.valueChanges
      .pipe(
        switchMap((term) => {
          if (term) {
            return this.chatService.userIsTyping().pipe(take(1));
          }
          return of([]);
        }),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe();
    this.chatService.messageThread$
      .pipe(
        filter((messages): messages is Message[] => messages !== undefined),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe((x) => {
        for (let index = 0; index < x.length; index++) {
          if (
            this.chatRecipient &&
            x[index].senderEmail !== this.chatRecipient.email &&
            x[index].dateRead
          ) {
            this.indexOfLastDisplayed = index;
          }
        }
      });
  }
  ngAfterViewInit() {
    this.messages?.changes
      .pipe(takeUntil(this.ngUnsubscribeSource$))
      .subscribe(() => this.scrollToBottom('auto'));
  }
  scrollToBottom = (behavior: ScrollBehavior) => {
    if (!this.chat) return;

    const element = this.chat.nativeElement;

    const totalHeightHowFarUserIsFromTheTopInPx =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    const isUserAtBottom = totalHeightHowFarUserIsFromTheTopInPx < 200;

    if (!isUserAtBottom && this.hasScrolledOnce) return;

    element.scroll({
      top: element.scrollHeight,
      left: 0,
      behavior: behavior,
    });

    this.hasScrolledOnce = true;
  };
  sendMessage(chatRecipient: IUser) {
    if (chatRecipient.email && this.messageContent.value) {
      this.loading = true;
      this.chatService
        .sendMessage(chatRecipient, this.messageContent.value)
        .pipe(takeUntil(this.ngUnsubscribeSource$))
        .subscribe({
          next: () => {
            this.messageContent.reset();
          },
          complete: () => {
            this.loading = false;
          },
        });
    }
  }
  async ngOnDestroy() {
    this.ngUnsubscribeSource$.next();
    await this.chatService.stopHubConnectionAndDeleteMessageThread();
  }

  loadMoreMessages() {
    if (!this.chatRecipient) return;

    this.isloadingOlderMessages = true;
    this.chatService
      .getMessages(this.chatRecipient, 15)
      .pipe(take(1), takeUntil(this.ngUnsubscribeSource$))
      .subscribe((messages) => {
        if (messages.length < 15) this.hasMoreData = false;

        this.isloadingOlderMessages = false;
      });
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (!this.hasMoreData) return;

    if (!this.chat) return;

    if (this.chat.nativeElement.scrollTop === 0) this.loadMoreMessages();
  }
}
