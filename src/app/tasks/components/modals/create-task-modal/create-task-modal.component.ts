import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OAuthService } from 'angular-oauth2-oidc';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, map, take } from 'rxjs';
import { ProjectService } from 'src/app/projects/services/project.service';
import { CustomValidators } from 'src/app/shared/Validators/CustomValidators';
import { Priority, State } from 'src/app/shared/models/IAppTask';
import { IProjectMember, ProjectMemberType } from 'src/app/shared/models/IProjectMember';
import { ITextIconPair } from 'src/app/shared/models/ITextIconPair';
import { IUser } from 'src/app/shared/models/IUser';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss']
})
export class CreateTaskModalComponent implements OnInit  {
  result: Subject<boolean>;
  taskForm?: FormGroup;
  stateMap: Map<State, ITextIconPair>;
  priorityMap: Map<Priority, ITextIconPair>;
  minNgbDateStruct?: NgbDateStruct;
  projectMembers$?: Observable<(IProjectMember|null)[]>
  projectMembersLeaders$?: Observable<IProjectMember[]>;
  statuses: State[];
  priorites: Priority[];
  constructor(public selfBsModalRef: BsModalRef,
              private tasksService:TasksService,
              private toastrService:ToastrService,
              private modalService: BsModalService,
              private projectService:ProjectService,
              private oAuthService:OAuthService
              )
    {
      this.result = new Subject<boolean>();

      // const userClaims = this.oAuthService.getIdentityClaims();//currentuserservice

      // let user:IProjectMember = {
      //   email: userClaims['email'],
      //   id: userClaims['sub'],
      //   photoUrl: userClaims['picture']
      // }
      
      this.statuses=[State.ToDo,State.InProgress,State.Done];
      this.priorites=[Priority.Low,Priority.Medium,Priority.High]
      
      this.stateMap = new Map<State, ITextIconPair>([      
        [State.ToDo,{text:"To Do"}],
        [State.InProgress,{text:"In Progress"}],
        [State.Done,{text:"Done" ,iconClass:"bi bi-check-square text-success me-1" }]
      ]);
      this.priorityMap = new Map<Priority, ITextIconPair>([      
        [Priority.Low,{text:"Low",iconClass:"bi bi-thermometer text-info"}],
        [Priority.Medium,{text:"Medium",iconClass:"bi bi-thermometer-half text-warning"}],
        [Priority.High,{text:"High",iconClass:"bi bi-thermometer-high text-danger"}]
      ]);
    }
  ngOnInit(): void {
    let currentDate = new Date();

    this.minNgbDateStruct = {
      year: currentDate.getFullYear(),
      month:  currentDate.getMonth() + 1 ,
      day: currentDate.getDate() + 1
    };

    const dueDate = {
      year: currentDate.getFullYear(),
      month:  currentDate.getMonth() + 1 ,
      day: currentDate.getDate() + 7
    };
    this.projectService.project$.pipe().subscribe(x=>{  
      if (!x) 
        return;

      // this.taskForm.get('projectId')?.setValue(x?.id);
      const leader = x.projectMembers.find(x=>x.type===ProjectMemberType.Leader);

      this.taskForm = new FormGroup({
        name: new FormControl<string>('',{ nonNullable: true, validators: [Validators.required]}),
        description: new FormControl<string>('',{ nonNullable: true, validators: []}),
        projectId: new FormControl<string>('',{ nonNullable: true, validators: []}),       
        state: new FormControl<State>(State.ToDo,{ nonNullable: true, validators: [Validators.required]}),
        priority: new FormControl<Priority>(Priority.Medium,{ nonNullable: true, validators: [Validators.required]}),
        dueDate: new FormControl<NgbDateStruct>(dueDate,{ nonNullable: true, validators: [Validators.required,CustomValidators.minimumDateNgb(this.minNgbDateStruct!)]}),
        startDate: new FormControl<NgbDateStruct>(this.minNgbDateStruct!,{ nonNullable: true, validators: [Validators.required,CustomValidators.minimumDateNgb(this.minNgbDateStruct!)]}),
        assignee: new FormControl<IProjectMember|null>(null,{validators: []}),
        leader: new FormControl<IProjectMember>(leader!,{nonNullable: true,validators: [Validators.required]}),
      }, { validators:  CustomValidators.checkDateOrder() });


    });//destroy!

    // this.projectMembers$ = this.projectService.project$.pipe(map(x=>{
    //   let members = x?.projectMembers ?? [];
    //   return members;
    // }));

    this.projectMembers$ = this.projectService.project$.pipe(
      map(x => {
        let members = x?.projectMembers ?? [];
        return [null , ...members] ;
      })
    );
    this.projectMembersLeaders$ = this.projectService.project$.pipe(map(x=>x?.projectMembers ?? []));
  }
  create(taskForm:FormGroup){

    if (this.taskForm?.invalid) {
      taskForm.markAllAsTouched();
      return;
    }
    
    // this.tasksService.create(this.taskForm.value as IProjectCreateRequest)
    // .pipe(take(1))
    // .subscribe({
    //   next:(project)=>{
    //     this.toastrService.success(`Project has been created`);
    //     this.bsModalRef.hide();
    //   },
    //   error:(err:HttpErrorResponse)=>{
    //       this.taskForm.setErrors({serverError: err.error}); 
    //     },
    //   });
  }
  // onOpenChange(isOpen: boolean): void {
  //   this.isStatusPanelOpen = isOpen;
  // }

}
