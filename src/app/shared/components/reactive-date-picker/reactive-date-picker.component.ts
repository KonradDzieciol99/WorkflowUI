import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-picker',
  templateUrl: './reactive-date-picker.component.html',
  styleUrls: ['./reactive-date-picker.component.scss']
})
export class ReactiveDatePickerComponent implements ControlValueAccessor,OnInit {
  @Input() validatorsKeyValue: {key: string, value: string}[] = [{key: 'required', value: 'Field is required.'},
                                                                 {key: "minimumDateNgb", value: 'The date provided is too early.'}];                                             
  @Input() label?:string;
  @Input() readonly:boolean
  @Input() minDate?:NgbDateStruct;
  control?: FormControl;
  constructor(@Self() public controlDir: NgControl) {
    this.readonly=false;
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
