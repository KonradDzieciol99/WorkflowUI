import { Component, ContentChild, Input, OnInit, Self, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { State } from '../../models/IAppTask';
import { ITextIconPair } from '../../models/ITextIconPair';

@Component({
  selector: 'app-reactive-dropdown [map]',
  templateUrl: './reactive-dropdown.component.html',
  styleUrls: ['./reactive-dropdown.component.scss']
})
export class ReactiveDropdownComponent<T>implements OnInit,ControlValueAccessor  {
  @ContentChild('selectButtonTemplate') selectButtonTemplate?: TemplateRef<T>;
  @ContentChild('triggerButtonTemplate') triggerButtonTemplate?: TemplateRef<T>;
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onOpenChange(isOpen: boolean): void {
    this.isStatusPanelOpen = isOpen;
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
