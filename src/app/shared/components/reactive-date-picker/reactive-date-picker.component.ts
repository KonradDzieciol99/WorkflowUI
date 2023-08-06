import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { inputs } from '@syncfusion/ej2-angular-grids/src/grid/grid.component';

@Component({
  selector: 'date-picker',
  templateUrl: './reactive-date-picker.component.html',
  styleUrls: ['./reactive-date-picker.component.scss']
})
export class ReactiveDatePickerComponent implements ControlValueAccessor,OnInit {
  @Input() validatorsKeyValue: {key: string, value: string}[] = [{key: 'required', value: 'Field is required.'},
                                                                 {key: "minimumDateNgb", value: 'The date provided is too early.'}];                                             
  @Input() label?:string;
  @Input() readonly:boolean = false; 
  @Input() minDate?:NgbDateStruct;
  control?: FormControl<any>;
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
