import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  take,
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
export class AccordionFindPeopleComponent implements OnInit {
  UserFriendStatusTypes: typeof UserFriendStatusType = UserFriendStatusType;
  private searchNewUsersSource$: BehaviorSubject<ISearchedUser[]>;
  searchNewUsers$: Observable<ISearchedUser[]>;
  isCollapsedAccordionFindPeople: boolean;
  searchNewUsers: FormControl<string>;
  constructor(
    public messagesService: MessagesService,
    private toastrService: ToastrService,
  ) {
    this.searchNewUsersSource$ = new BehaviorSubject([] as ISearchedUser[]);
    this.searchNewUsers$ = this.searchNewUsersSource$.asObservable();
    this.isCollapsedAccordionFindPeople = false;
    this.searchNewUsers = new FormControl('', { nonNullable: true });
  }
  ngOnInit(): void {
    this.searchNewUsers.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (term) {
            return this.messagesService
              .findUsersByEmailAndCheckState(term)
              .pipe(take(1));
          }
          return of([]);
        }),
      )
      .subscribe((searchNewUsers) => {
        this.searchNewUsersSource$.next(searchNewUsers);
      });
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
        switchMap(() => this.searchNewUsers$.pipe(take(1))),
      )
      .subscribe((users: ISearchedUser[]) => {
        this.toastrService.success('The invitation has been sent.');
        const searchNewUsers = users.map((user) =>
          user.id === searchUser.id
            ? { ...user, status: UserFriendStatusType.InvitedByYou }
            : user,
        );
        this.searchNewUsersSource$.next(searchNewUsers);
      });
  }
}
