import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { authAppInitializerFactory } from './initializers/auth-app-initializer.factory';
import { IdentityServerService } from '../authentication/identity-server.service';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NotificationsPanelComponent } from './components/notifications-panel/notifications-panel.component';


@NgModule({
  declarations: [
    NavBarComponent,
    HeaderComponent,
    NotificationCardComponent,
    NotificationsPanelComponent
  ],
  imports: [
    ModalModule.forRoot(),
    CommonModule,
    RouterModule,
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    
  ],
  exports: [HeaderComponent],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: authAppInitializerFactory, deps: [IdentityServerService],
      multi: true
    }
  ]
})
export class CoreModule { }
