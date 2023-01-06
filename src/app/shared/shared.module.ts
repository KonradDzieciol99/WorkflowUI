import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCustomComponent } from './components/input-custom/input-custom.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InputCustomComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
  ,exports:[
    InputCustomComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
