import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { authAppInitializerFactory } from './core/initializers/auth-app-initializer.factory';
import { IdentityServerService } from './core/authentication/identity-server.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    OAuthModule.forRoot(),
  ],

  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: authAppInitializerFactory,
      deps: [IdentityServerService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
