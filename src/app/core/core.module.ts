import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';
import { ThemeSwitchButtonComponent } from './components/theme-switch-button/theme-switch-button.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { JwtInterceptorInterceptor } from './interceptors/jwt-interceptor.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { SharedModule } from '../shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RetryInterceptor } from './interceptors/http-policy.interceptor';

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
    RouterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressBar: true,
    }),
    SharedModule,
    NgxSpinnerModule.forRoot({ type: 'ball-clip-rotate-multiple' }),
  ],
  exports: [
    HeaderComponent,
    ToastrModule,
    NgxSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RetryInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
