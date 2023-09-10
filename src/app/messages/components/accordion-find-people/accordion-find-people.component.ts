import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import {
  ISearchedUser,
  UserFriendStatusType,
} from 'src/app/shared/models/ISearchedUser';
import { IUser } from 'src/app/shared/models/IUser';
import { MessagesService } from '../../messages.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-accordion-find-people',
  templateUrl: './accordion-find-people.component.html',
  styleUrls: ['./accordion-find-people.component.scss'],
})
export class AccordionFindPeopleComponent implements OnInit, OnDestroy {
  UserFriendStatusTypes: typeof UserFriendStatusType;
  isCollapsedAccordionFindPeople: boolean;
  searchNewUsers: FormControl<string>;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(
    public messagesService: MessagesService,
    private toastrService: ToastrService,
  ) {
    this.isCollapsedAccordionFindPeople = true;
    this.searchNewUsers = new FormControl('', { nonNullable: true });
    this.UserFriendStatusTypes = UserFriendStatusType;
    this.ngUnsubscribeSource$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.searchNewUsers.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (term) {
            return this.messagesService
              .findUsersByEmailAndCheckState(term,false)
              .pipe(take(1));
          }
          return of([]);
        }),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe();
  }

  sendInvitation(searchUser: ISearchedUser) {
    const searchedUser: IUser = {
      email: searchUser.email,
      id: searchUser.id,
      photoUrl: searchUser.photoUrl,
    };

    this.messagesService
      .sendInvitation(searchedUser)
      .pipe(
        take(1),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe(() => {
        this.toastrService.success('The invitation has been sent.');
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }
  loadMore(){

    const term = this.searchNewUsers.value;

    if (!term) return;
      
    return this.messagesService.findUsersByEmailAndCheckState(term,true)
      .pipe(take(1))
      .subscribe();
  }
}
