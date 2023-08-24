import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OAuthService } from 'angular-oauth2-oidc';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, take } from 'rxjs';
import { ProjectService } from 'src/app/projects/services/project.service';
import { CustomValidators } from 'src/app/shared/Validators/CustomValidators';
import { IAppTask, Priority, State } from 'src/app/shared/models/IAppTask';
import { ICreateAppTask } from 'src/app/shared/models/ICreateAppTask';
import { IProjectMember } from 'src/app/shared/models/IProjectMember';
import { ITextIconPair } from 'src/app/shared/models/ITextIconPair';
import { TasksService } from 'src/app/tasks/tasks.service';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss']
})
export class CreateTaskModalComponent implements OnInit  {
  // private resultSource$: Subject<boolean>;
  //taskForm?: FormGroup;
  stateMap: Map<State, ITextIconPair>;
  priorityMap: Map<Priority, ITextIconPair>;
  minNgbDateStruct?: NgbDateStruct;
  projectMembers$?: Observable<(IProjectMember|undefined)[]>
  statuses: State[];
  priorites: Priority[];
  updatedTask?:IAppTask;
  taskForm?: FormGroup<{ id: FormControl<string>; name: FormControl<string>; description: FormControl<string>; projectId: FormControl<string>; state: FormControl<State>; priority: FormControl<Priority>; dueDate: FormControl<NgbDateStruct>; startDate: FormControl<NgbDateStruct>; assignee: FormControl<IProjectMember | undefined>; leader: FormControl<IProjectMember | undefined>; }>;
  constructor(public selfBsModalRef: BsModalRef,
              private tasksService:TasksService,
              private toastrService:ToastrService,
              private projectService:ProjectService,
              private oAuthService:OAuthService
              )
    {
      // this.resultSource$ = new Subject<boolean>();
      
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
    const currentDate = new Date();

    currentDate.setMonth(currentDate.getMonth() + 1); 
    this.minNgbDateStruct = this.mapDateToNgbDateStruct(currentDate)
    this.projectService.project$.pipe().subscribe(x=>{  
      if (!x || !this.minNgbDateStruct) 
        return;

      currentDate.setDate(currentDate.getDate() + 7)
      const dueDate = this.mapDateToNgbDateStruct(currentDate)

      const userClaims = this.oAuthService.getIdentityClaims();
      const leader = x.projectMembers.find(x=>x.userId===userClaims['sub']);
      
      this.taskForm = new FormGroup({
        id: new FormControl<string>('',{ nonNullable: true, validators: []}),
        name: new FormControl<string>('',{ nonNullable: true, validators: [Validators.required]}),
        description: new FormControl<string>('',{ nonNullable: true, validators: []}),
        projectId: new FormControl<string>(x.id,{ nonNullable: true, validators: []}),       
        state: new FormControl<State>(State.ToDo,{ nonNullable: true, validators: [Validators.required]}),
        priority: new FormControl<Priority>(Priority.Medium,{ nonNullable: true, validators: [Validators.required]}),
        dueDate: new FormControl<NgbDateStruct>(dueDate,{ nonNullable: true, validators: [Validators.required]}),
        startDate: new FormControl<NgbDateStruct>(this.minNgbDateStruct,{ nonNullable: true, validators: [Validators.required]}),
        assignee: new FormControl<IProjectMember|undefined>(undefined,{nonNullable: true,validators: []}),
        leader: new FormControl<IProjectMember|undefined>(leader,{nonNullable: true, validators: [Validators.required]}),
      }, { validators:  CustomValidators.checkDateOrder() });

      if (this.updatedTask) {
        this.taskForm.get('name')?.setValue(this.updatedTask.name);
        this.taskForm.get('description')?.setValue(this.updatedTask.description ?? '');
        this.taskForm.get('projectId')?.setValue(this.updatedTask.projectId);
        this.taskForm.get('state')?.setValue(this.updatedTask.state);
        this.taskForm.get('priority')?.setValue(this.updatedTask.priority);
        this.taskForm.get('dueDate')?.setValue(this.mapDateToNgbDateStruct( new Date(this.updatedTask.dueDate)));
        this.taskForm.get('startDate')?.setValue(this.mapDateToNgbDateStruct( new Date(this.updatedTask.startDate)));
        this.taskForm.get('assignee')?.setValue(this.updatedTask.taskAssignee);
        this.taskForm.get('leader')?.setValue(this.updatedTask.taskLeader);
        this.taskForm.get('id')?.setValue(this.updatedTask.id);

        this.taskForm.get('id')?.setValidators(Validators.required)
    }else{
      this.taskForm.get('dueDate')?.setValidators(CustomValidators.minimumDateNgb(this.minNgbDateStruct!))
      this.taskForm.get('startDate')?.setValidators(CustomValidators.minimumDateNgb(this.minNgbDateStruct!))
    }
    });

    this.projectMembers$ = this.projectService.project$.pipe(

      //filter
      map(x => {
        const members = x?.projectMembers ?? [];
        return [undefined , ...members] ;
      })
    );
  }
  create(){

    if (!this.taskForm) return;
  
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const values = this.taskForm.getRawValue()

   const dueDateNgbDateStruct = values.dueDate;
   const startDateNgbDateStruct = values.startDate;
   const dueDateDate= new Date(dueDateNgbDateStruct.year,dueDateNgbDateStruct.month - 1 ,dueDateNgbDateStruct.day);
   const startDateDateDate= new Date(startDateNgbDateStruct.year,startDateNgbDateStruct.month - 1,startDateNgbDateStruct.day);

    const createAppTask:ICreateAppTask={
      name:values.name,
      description:values.description,
      projectId:values.projectId ,
      priority:values.priority ,
      state:values.state ,
      dueDate:dueDateDate ,
      startDate:startDateDateDate,
      taskAssigneeMemberId:values.assignee?.id,
      taskAssignee:values.assignee,
      taskLeaderId:values.leader?.id,
      taskLeader:values.leader
    }

    this.tasksService.create(createAppTask)
    .pipe(take(1))
    .subscribe({
      next:()=>{
        this.toastrService.success(`Task has been created`);
        this.selfBsModalRef.hide();
      },
      error:(error:unknown)=>{
        if (error instanceof HttpErrorResponse)
          this.taskForm?.setErrors({serverError: error.error}); 
        else 
          console.error('Nieznany błąd:', error);

        },
      });
  }
 update(){
  if (!this.taskForm) return;
  
  if (this.taskForm.invalid) {
    this.taskForm.markAllAsTouched();
    return;
  }
  
  const values = this.taskForm.getRawValue()

  const dueDateNgbDateStruct = values.dueDate
  
  const startDateNgbDateStruct = values.startDate

  const dueDateDate= new Date(dueDateNgbDateStruct.year,dueDateNgbDateStruct.month - 1,dueDateNgbDateStruct.day);
  const startDateDateDate= new Date(startDateNgbDateStruct.year,startDateNgbDateStruct.month - 1,startDateNgbDateStruct.day);

  const updatedTask:IAppTask={
    name: values.name,
    description: values.description,
    projectId: values.projectId,
    priority: values.priority,
    state: values.state,
    dueDate: dueDateDate,
    startDate: startDateDateDate,
    taskAssigneeMemberId: values.assignee?.id,
    taskAssignee: values.assignee,
    taskLeaderId: values.leader?.id,
    taskLeader: values.leader,
    id: values.id
  }

  this.tasksService.update(updatedTask)
  .pipe(take(1))
  .subscribe({
    next:()=>{
      this.toastrService.success(`Task has been updated`);
      this.selfBsModalRef.hide();
    },
    error:(error:unknown)=>{
          if (error instanceof HttpErrorResponse)
        this.taskForm?.setErrors({serverError: error.error});  
          else 
        console.error('Nieznany błąd:', error);
      }}
    );
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
