import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    TooltipModule.forRoot()


  ]
})
export class HomeModule { }
