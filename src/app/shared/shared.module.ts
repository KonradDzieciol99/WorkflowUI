import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCustomComponent } from './components/input-custom/input-custom.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConfirmWindowComponent } from './components/confirm-window/confirm-window.component';
import { ReactiveInputComponent } from './components/reactive-input/reactive-input.component';
import { ReactiveDatePickerComponent } from './components/reactive-date-picker/reactive-date-picker.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveDropdownComponent } from './components/reactive-dropdown/reactive-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CReactiveDropdownComponent } from './components/c-reactive-dropdown/c-reactive-dropdown.component';
import { MapGetValuePipe } from './pipes/map-get-value.pipe';



@NgModule({
  declarations: [
    InputCustomComponent,
    ConfirmWindowComponent,
    ReactiveInputComponent,
    ReactiveDatePickerComponent,
    ReactiveDropdownComponent,
    CReactiveDropdownComponent,
    MapGetValuePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    NgbDatepickerModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),

  ]
  ,exports:[
    InputCustomComponent,
    ReactiveFormsModule,
    ReactiveInputComponent,
    ReactiveDatePickerComponent,
    ReactiveDropdownComponent,
    CReactiveDropdownComponent,
    MapGetValuePipe
  ]
})
export class SharedModule { }
