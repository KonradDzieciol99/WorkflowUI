import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OAuthService } from 'angular-oauth2-oidc';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, map, take } from 'rxjs';
import { ProjectService } from 'src/app/projects/services/project.service';
import { CustomValidators } from 'src/app/shared/Validators/CustomValidators';
import { IAppTask, Priority, State } from 'src/app/shared/models/IAppTask';
import { ICreateAppTask } from 'src/app/shared/models/ICreateAppTask';
import { IProjectCreateRequest } from 'src/app/shared/models/IProjectCreateRequest';
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
  projectMembers$?: Observable<(IProjectMember|undefined)[]>
  statuses: State[];
  priorites: Priority[];
  updatedTask?:IAppTask;
  constructor(public selfBsModalRef: BsModalRef,
              private tasksService:TasksService,
              private toastrService:ToastrService,
              private modalService: BsModalService,
              private projectService:ProjectService,
              private oAuthService:OAuthService
              )
    {
      this.result = new Subject<boolean>();


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
    // currentDate.setMonth(currentDate.getMonth() + 1); 
    // this.minNgbDateStruct = {
    //   year: currentDate.getFullYear(),
    //   month:  currentDate.getMonth() ,
    //   day: currentDate.getDate()
    // };
    currentDate.setMonth(currentDate.getMonth() + 1); 
    this.minNgbDateStruct = this.mapDateToNgbDateStruct(currentDate)
    this.projectService.project$.pipe().subscribe(x=>{  
      if (!x) 
        return;
 
        // currentDate.setDate(currentDate.getDate() + 7); 
        // const dueDate: NgbDateStruct = {
        //   year: currentDate.getFullYear(),
        //   month:  currentDate.getMonth(),
        //   day: currentDate.getDate()
        // }; 

      currentDate.setDate(currentDate.getDate() + 7)
      const dueDate = this.mapDateToNgbDateStruct(currentDate)

      const userClaims = this.oAuthService.getIdentityClaims();//currentuserservice
      const leader = x.projectMembers.find(x=>x.userId===userClaims['sub']);
      
      this.taskForm = new FormGroup({
        id: new FormControl<string|undefined>(undefined,{ nonNullable: true, validators: []}),
        name: new FormControl<string>('',{ nonNullable: true, validators: [Validators.required]}),
        description: new FormControl<string>('',{ nonNullable: true, validators: []}),
        projectId: new FormControl<string>(x.id,{ nonNullable: true, validators: []}),       
        state: new FormControl<State>(State.ToDo,{ nonNullable: true, validators: [Validators.required]}),
        priority: new FormControl<Priority>(Priority.Medium,{ nonNullable: true, validators: [Validators.required]}),
        dueDate: new FormControl<NgbDateStruct>(dueDate,{ nonNullable: true, validators: [Validators.required]}),
        startDate: new FormControl<NgbDateStruct>(this.minNgbDateStruct!,{ nonNullable: true, validators: [Validators.required]}),
        assignee: new FormControl<IProjectMember|undefined>(undefined,{nonNullable: true,validators: []}),
        leader: new FormControl<IProjectMember|undefined>(leader,{nonNullable: true, validators: [Validators.required]}),
      }, { validators:  CustomValidators.checkDateOrder() });

      if (this.updatedTask) {
        this.taskForm.get('name')?.setValue(this.updatedTask?.name);
        this.taskForm.get('description')?.setValue(this.updatedTask?.description);
        this.taskForm.get('projectId')?.setValue(this.updatedTask?.projectId);
        this.taskForm.get('state')?.setValue(this.updatedTask?.state);
        this.taskForm.get('priority')?.setValue(this.updatedTask?.priority);
        this.taskForm.get('dueDate')?.setValue(this.mapDateToNgbDateStruct( new Date(this.updatedTask?.dueDate)));
        this.taskForm.get('startDate')?.setValue(this.mapDateToNgbDateStruct( new Date(this.updatedTask?.startDate)));
        this.taskForm.get('assignee')?.setValue(this.updatedTask?.taskAssignee);
        this.taskForm.get('leader')?.setValue(this.updatedTask?.taskLeader);
        this.taskForm.get('id')?.setValue(this.updatedTask?.id);

        this.taskForm.get('id')?.setValidators(Validators.required)
    }else{
      this.taskForm.get('dueDate')?.setValidators(CustomValidators.minimumDateNgb(this.minNgbDateStruct!))
      this.taskForm.get('startDate')?.setValidators(CustomValidators.minimumDateNgb(this.minNgbDateStruct!))
    }
    const ff= new Date()
    console.log();
    });//destroy!

    this.projectMembers$ = this.projectService.project$.pipe(
      map(x => {
        let members = x?.projectMembers ?? [];
        return [undefined , ...members] ;
      })
    );
    // this.projectMembersLeaders$ = this.projectService.project$.pipe(map(x=>{
    //   let members = x?.projectMembers ?? [];
    //   return [undefined , ...members] ;
    // }));
  }
  create(taskForm:FormGroup){

    if (this.taskForm?.invalid) {
      taskForm.markAllAsTouched();
      return;
    }

    let ggg= this.taskForm?.value;

   let dueDateNgbDateStruct = this.taskForm?.value.dueDate as NgbDateStruct;

   let startDateNgbDateStruct = this.taskForm?.value.startDate as NgbDateStruct;

   let dueDateDate= new Date(dueDateNgbDateStruct.year,dueDateNgbDateStruct.month - 1 ,dueDateNgbDateStruct.day);
   let startDateDateDate= new Date(startDateNgbDateStruct.year,startDateNgbDateStruct.month - 1,startDateNgbDateStruct.day);

    const createAppTask:ICreateAppTask={
      name:this.taskForm?.value.name,
      description:this.taskForm?.value.description,
      projectId:this.taskForm?.value.projectId ,
      priority:this.taskForm?.value.priority ,
      state:this.taskForm?.value.state ,
      dueDate:dueDateDate ,
      startDate:startDateDateDate,
      taskAssigneeMemberId:this.taskForm?.value?.assignee?.id,
      taskAssignee:this.taskForm?.value?.assignee,
      taskLeaderId:this.taskForm?.value?.leader?.id,
      taskLeader:this.taskForm?.value?.leader
      // taskAssigneeMemberEmail:this.taskForm?.value?.assignee?.userEmail,
      // taskAssigneeMemberPhotoUrl:this.taskForm?.value?.assignee?.photoUrl
    }

    // taskLeaderId?:string,
    // taskLeader?:IProjectMember,
    // taskAssigneeMemberId?:string,
    // taskAssignee?:IProjectMember,


    this.tasksService.create(createAppTask)
    .pipe(take(1))
    .subscribe({
      next:(project)=>{
        this.toastrService.success(`Task has been created`);
        this.selfBsModalRef.hide();
      },
      error:(err:HttpErrorResponse)=>{
          this.taskForm?.setErrors({serverError: err.error}); 
        },
      });
  }
  // onOpenChange(isOpen: boolean): void {
  //   this.isStatusPanelOpen = isOpen;
  // }
 update(taskForm:FormGroup){
  if (this.taskForm?.invalid) {
    taskForm.markAllAsTouched();
    return;
  }

  let dueDateNgbDateStruct = this.taskForm?.value.dueDate as NgbDateStruct;
  let startDateNgbDateStruct = this.taskForm?.value.startDate as NgbDateStruct;

  let dueDateDate= new Date(dueDateNgbDateStruct.year,dueDateNgbDateStruct.month - 1,dueDateNgbDateStruct.day);
  let startDateDateDate= new Date(startDateNgbDateStruct.year,startDateNgbDateStruct.month - 1,startDateNgbDateStruct.day);

  const updatedTask:IAppTask={
    name: this.taskForm?.value.name,
    description: this.taskForm?.value.description,
    projectId: this.taskForm?.value.projectId,
    priority: this.taskForm?.value.priority,
    state: this.taskForm?.value.state,
    dueDate: dueDateDate,
    startDate: startDateDateDate,
    taskAssigneeMemberId: this.taskForm?.value?.assignee?.id,
    taskAssignee: this.taskForm?.value?.assignee,
    taskLeaderId: this.taskForm?.value?.leader?.id,
    taskLeader: this.taskForm?.value?.leader,
    id: this.taskForm?.value.id
  }

  this.tasksService.update(updatedTask)
  .pipe(take(1))
  .subscribe({
    next:()=>{
      this.toastrService.success(`Task has been updated`);
      this.selfBsModalRef.hide();
    },
    error:(err:HttpErrorResponse)=>{
        this.taskForm?.setErrors({serverError: err.error}); 
      },
    });
 }
 mapDateToNgbDateStruct(date:Date):NgbDateStruct{
  const bgbDateStruct:NgbDateStruct={
    year: date.getFullYear(),
    month:  date.getMonth(),
    day: date.getDate()
  }

  return bgbDateStruct;
 }

}
