import { Component, ContentChild, Input, OnInit, Self, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { State } from '../../models/IAppTask';
import { ITextIconPair } from '../../models/ITextIconPair';
import { Subscription } from 'rxjs';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-reactive-dropdown [map]',
  templateUrl: './reactive-dropdown.component.html',
  styleUrls: ['./reactive-dropdown.component.scss']
})
export class ReactiveDropdownComponent<T>implements OnInit,ControlValueAccessor  {
  @ContentChild('selectButtonTemplate') selectButtonTemplate!: TemplateRef<T>;
  @ContentChild('triggerButtonTemplate') triggerButtonTemplate!: TemplateRef<T>;
  isStatusPanelOpen: boolean;
  statuses: typeof State = State;
  control?: FormControl<T>;
  @Input() map: T[]|null=[];
  @Input() additionalKeyValue?: Map<T, ITextIconPair>;
  currentValue?:ITextIconPair;
  sub?:Subscription;
  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
    this.isStatusPanelOpen=false;
  }
  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl;
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
