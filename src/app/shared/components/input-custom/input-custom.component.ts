import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-custom',
  templateUrl: './input-custom.component.html',
  styleUrls: ['./input-custom.component.scss']
})
export class InputCustomComponent  implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input() nameFormControl!:string;
  @Input() validatorsKeyValue: {key: string, value: string}[]=[];
  @Input() readonly:boolean=true; 
  @Input() label:string = 'WYPEŁNIJ'; 
  @Input() type:string = 'text'; 
  public edit=false;
  public errorsList:any=[];
  public errorsList2:string[]=[];
  constructor() {
   }

  ngOnInit(): void {
    this.formGroup.get(this.nameFormControl)?.valueChanges.subscribe(x=>{  
    })
  }
}
