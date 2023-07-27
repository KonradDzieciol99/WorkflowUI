import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { IProjectMember } from 'src/app/shared/models/IProjectMember';
import { IUser } from 'src/app/shared/models/IUser';

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
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }
}
