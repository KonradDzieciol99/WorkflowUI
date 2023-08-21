import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, of, switchMap, take } from 'rxjs';
import { ProjectService } from 'src/app/projects/services/project.service';
import { ISearchedMember, MemberStatusType } from 'src/app/shared/models/ISearchedMember';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-add-project-member-modal',
  templateUrl: './add-project-member-modal.component.html',
  styleUrls: ['./add-project-member-modal.component.scss']
})
export class AddProjectMemberModalComponent implements OnInit {
  searchMember: FormControl<string>;
  searchedMemberSource: BehaviorSubject<Array<ISearchedMember>>;
  searchedMember$: Observable<Array<ISearchedMember>>;
  memberStatusTypes: typeof MemberStatusType = MemberStatusType;
  constructor(public selfBsModalRef: BsModalRef,
    private tasksService:TasksService,
    private toastrService:ToastrService,
    private modalService: BsModalService,
    private projectService:ProjectService,
    private oAuthService:OAuthService
    ){
      this.searchMember = new FormControl<string>('',{nonNullable: true, validators: [Validators.required]});
      this.searchedMemberSource = new BehaviorSubject<Array<ISearchedMember>>([]);
      this.searchedMember$ = this.searchedMemberSource.asObservable()
    }
  ngOnInit(): void {
    this.searchMember.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap((term: string)=>{
        if (Boolean(term)) {return this.projectService.findMemberByEmailAndCheckState(term).pipe(take(1));}
        return of([]);
      })
    ).subscribe(searchNewUsers=>{
      
      this.searchedMemberSource.next([...searchNewUsers,...searchNewUsers,...searchNewUsers,...searchNewUsers,...searchNewUsers,...searchNewUsers,...searchNewUsers,...searchNewUsers,...searchNewUsers]);
    });
  }
  sendInvitation(user:ISearchedMember):void{
    this.projectService.addMember(user.email).pipe(
    take(1),
    switchMap(() => this.searchedMember$.pipe(take(1)))
    ).subscribe((searchedMembers)=>{
      const searchNewUsers = searchedMembers.map(user =>
        user.id === user.id ? { ...user, status: MemberStatusType.Invited } : user
      );
      this.searchedMemberSource.next(searchNewUsers);
    
      this.toastrService.success("The invitation has been sent")
    })
  }
}
