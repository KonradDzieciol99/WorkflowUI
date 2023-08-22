import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { HeaderComponent } from './components/header/header.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';
import { ThemeSwitchButtonComponent } from './components/theme-switch-button/theme-switch-button.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { JwtInterceptorInterceptor } from './interceptors/jwt-interceptor.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';


@NgModule({
  declarations: [
    NavBarComponent,
    HeaderComponent,
    NotificationCardComponent,
    ThemeSwitchButtonComponent,
    UserMenuComponent,
    NotificationPanelComponent,
  ],
  imports: [
    ModalModule.forRoot(),
    CommonModule,
    RouterModule,
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    BreadcrumbModule,
    NgbCollapseModule
  ],
  exports: [HeaderComponent],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true },
  ]
})
export class CoreModule { }
