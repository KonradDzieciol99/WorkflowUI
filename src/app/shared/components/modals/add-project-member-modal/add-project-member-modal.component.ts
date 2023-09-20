import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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
import { ProjectService } from 'src/app/projects/services/project.service';
import {
  ISearchedMember,
  MemberStatusType,
} from 'src/app/shared/models/ISearchedMember';

@Component({
  selector: 'app-add-project-member-modal',
  templateUrl: './add-project-member-modal.component.html',
  styleUrls: ['./add-project-member-modal.component.scss'],
})
export class AddProjectMemberModalComponent implements OnInit, OnDestroy {
  searchMember: FormControl<string>;
  private searchedMemberSource$: BehaviorSubject<ISearchedMember[]>;
  searchedMember$: Observable<ISearchedMember[]>;
  memberStatusTypes: typeof MemberStatusType;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(
    public selfBsModalRef: BsModalRef,
    private toastrService: ToastrService,
    private projectService: ProjectService,
  ) {
    this.searchMember = new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    });
    this.searchedMemberSource$ = new BehaviorSubject([] as ISearchedMember[]);
    this.searchedMember$ = this.searchedMemberSource$.asObservable();
    this.ngUnsubscribeSource$ = new Subject<void>();
    this.memberStatusTypes = MemberStatusType;
  }

  ngOnInit(): void {
    // TODO: Przenieść do serwisu
    this.searchMember.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term) {
            return this.projectService
              .findMemberByEmailAndCheckState(term,true)
              .pipe(take(1), takeUntil(this.ngUnsubscribeSource$));
          }
          return of([]);
        }),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe((searchNewUsers) => {
        this.searchedMemberSource$.next([...searchNewUsers]);
      });
  }
  sendInvitation(potentialMmember: ISearchedMember): void {
    this.projectService
      .addMember(potentialMmember.email)
      .pipe(
        take(1),
        switchMap(() => this.searchedMember$.pipe(take(1))),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe((currentSearchedMembers) => {
        const searchNewUsers = currentSearchedMembers.map((currentSearchedMember) =>
        currentSearchedMember.id === potentialMmember.id
            ? { ...currentSearchedMember, status: MemberStatusType.Invited }
            : currentSearchedMember,
        );
        this.searchedMemberSource$.next(searchNewUsers);

        this.toastrService.success('The invitation has been sent');
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }
}
