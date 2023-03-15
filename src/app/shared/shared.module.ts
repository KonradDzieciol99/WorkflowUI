import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCustomComponent } from './components/input-custom/input-custom.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConfirmWindowComponent } from './components/confirm-window/confirm-window.component';



@NgModule({
  declarations: [
    InputCustomComponent,
    ConfirmWindowComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
  ]
  ,exports:[
    InputCustomComponent,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
