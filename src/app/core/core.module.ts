import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from './interceptors/jwt-interceptor.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';


@NgModule({
  declarations: [
    NavBarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    ButtonsModule.forRoot(),
  ],
  exports: [HeaderComponent],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true },
  ]
})
export class CoreModule { }
