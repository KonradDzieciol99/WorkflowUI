import { KeyValue } from '@angular/common';
import { Component, ContentChild, Input, OnInit, Self, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { State } from '../../models/IAppTask';
import { ITextIconPair } from '../../models/ITextIconPair';

@Component({
  selector: 'app-c-reactive-dropdown',
  templateUrl: './c-reactive-dropdown.component.html',
  styleUrls: ['./c-reactive-dropdown.component.scss']
})
export class CReactiveDropdownComponent <T>implements OnInit,ControlValueAccessor  {
  isStatusPanelOpen: boolean;
  statuses: typeof State = State;
  control?: FormControl<T>;
  @Input() map?: Map<T, ITextIconPair>;
  currentValue?:ITextIconPair;
  sub?:Subscription;
  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
    this.isStatusPanelOpen=false;
  }
  ngOnInit(): void {

    this.control = this.controlDir.control as FormControl;

    this.currentValue = this.map?.get(this.control?.value);
    this.sub = this.control?.valueChanges.subscribe(state=>{
      this.currentValue = this.map?.get(state);
    })
  }
  onOpenChange(isOpen: boolean): void {
    this.isStatusPanelOpen = isOpen;
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
