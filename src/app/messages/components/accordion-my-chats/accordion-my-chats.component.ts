import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  mergeMap,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { IUser } from 'src/app/shared/models/IUser';
import { MessagesService } from '../../messages.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-accordion-my-chats',
  templateUrl: './accordion-my-chats.component.html',
  styleUrls: ['./accordion-my-chats.component.scss'],
})
export class AccordionMyChatsComponent implements OnInit, OnDestroy {
  isCollapsedAccordionMyChats: boolean;
  friendsWithActivityStatus$: Observable<IUser[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userClaims: Record<string, any>;
  searchUsersFormControl: FormControl<string>;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(
    public chatService: ChatService,
    private readonly oAuthService: OAuthService,
    private messagesService: MessagesService,
    private toastrService: ToastrService,
  ) {
    this.friendsWithActivityStatus$ =
      this.messagesService.friendsWithActivityStatus$;
    this.isCollapsedAccordionMyChats = false;
    this.userClaims = this.oAuthService.getIdentityClaims();
    this.searchUsersFormControl = new FormControl<string>('', {
      nonNullable: true,
    });
    this.ngUnsubscribeSource$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.searchUsersFormControl.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((term) =>
          this.messagesService.GetConfirmedFriendRequests(term).pipe(take(1)),
        ),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe();
  }
  onFriendSelected(user: IUser) {
    this.chatService.chatRecipient$
      .pipe(
        take(1),
        filter((chatRecipient) => chatRecipient?.email !== user.email),
        mergeMap(async () => {
          await this.chatService.stopHubConnectionAndDeleteMessageThread();
          return from(
            this.chatService.createHubConnection(
              user.email,
              this.oAuthService.getAccessToken(),
            ),
          );
        }),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe(() => this.chatService.chatRecipientNext(user));
  }
  declineAcceptedFriendInvitation(friend: IUser) {
    this.messagesService
      .declineAcceptedFriendInvitation(friend, this.userClaims['sub'] as string)
      .pipe(takeUntil(this.ngUnsubscribeSource$))
      .subscribe(() => {
        //this.allFriendsInvitationsSource.next(invitations);
        this.toastrService.success('you removed the user from friends.');
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }
}
