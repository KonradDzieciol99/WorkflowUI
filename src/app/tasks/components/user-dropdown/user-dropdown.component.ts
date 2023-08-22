import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { IProjectMember } from 'src/app/shared/models/IProjectMember';

@Component({
  selector: 'app-user-dropdown[projectMember]',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss']
})
export class UserDropdownComponent implements OnInit,ControlValueAccessor  {
  @Input() projectMember: IProjectMember[]|null = [];
  control?: FormControl;
  isStatusPanelOpen: boolean;
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
