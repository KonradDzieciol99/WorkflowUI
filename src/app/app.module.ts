import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressBar:true
    }),
    NgxSpinnerModule.forRoot({ type: 'ball-clip-rotate-multiple' }),
    ButtonsModule.forRoot(),
    AuthModule.forRoot({
      domain: 'dev-b8y3ge9o.eu.auth0.com',
      clientId: '3b3Fk8P2knWjPc31HBwz8L78ccY85BCo',
      redirectUri:'https://localhost:4200/home',
      audience: 'https://localhost:44346',
      scope: 'read:current_user',
      useRefreshTokens: true,
      httpInterceptor: {
        allowedList: [
          '/api',
          '/api/*',
          // {
          //   // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
          //   uri: 'https://localhost:44346/api/*',
          //   tokenOptions: {
          //     // The attached token should target this audience
          //     audience: 'https://localhost:44346/*',
    
          //     // The attached token should have these scopes
          //     scope: 'read:current_user',
          //   }
          // }
        ]
      }
    }),
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
