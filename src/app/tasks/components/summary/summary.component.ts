import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit{
  taskForm:FormGroup;
  constructor() {
    this.taskForm = new FormGroup({
      name: new FormControl<string>('',{ nonNullable: true, validators: [Validators.required]}),
      state: new FormControl<string>('',{ nonNullable: true, validators: [Validators.required]}),
      // description: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
      // projectId: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
      // taskAssigneeMemberId: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
      // priority: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
      // state: new FormControl<State>('',[Validators.required,Validators.minLength(6)]),
      // dueDate: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
      // startDate: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
      // taskLeaderId: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
    });    
  }
  ngOnInit(): void {

  }


}
