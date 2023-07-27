import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-reactive-input',
  templateUrl: './reactive-input.component.html',
  styleUrls: ['./reactive-input.component.scss'],
})
export class ReactiveInputComponent implements ControlValueAccessor,OnInit {
  @Input() validatorsKeyValue: {key: string, value: string}[] = [];
  @Input() readonly:boolean = false; 
  @Input() formFloating:boolean = true; 
  @Input() label?:string; 
  @Input() type:string = 'text'; 
  @Input() placeholder:string=''; 
  public edit=false;
  public errorsList:any=[];
  //public errorsList2:string[]=[];
  control?: FormControl;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }
  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }
}
