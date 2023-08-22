import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-reactive-input',
  templateUrl: './reactive-input.component.html',
  styleUrls: ['./reactive-input.component.scss'],
})
export class ReactiveInputComponent implements ControlValueAccessor,OnInit {
  @Input() validatorsKeyValue:{key: string, value: string}[];
  @Input() readonly:boolean; 
  @Input() formFloating:boolean; 
  @Input() label?:string; 
  @Input() type:string;
  @Input() placeholder:string; 
  edit:boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorsList:any;
  control?: FormControl;

  constructor(@Self() public controlDir: NgControl) {
    this.validatorsKeyValue= []
    this.readonly = false; 
    this.formFloating = true;
    this.type = 'text';
    this.placeholder = ''; 
    this.edit=false;
    this.errorsList=[];
    this.controlDir.valueAccessor = this;
  }
  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  writeValue(obj: any): void {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  setDisabledState?(isDisabled: boolean): void {
  }
}
