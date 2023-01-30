import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { OAuthModule } from 'angular-oauth2-oidc';

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
    OAuthModule.forRoot(
    //   {
    //   resourceServer: {
    //     allowedUrls: ['https://localhost:8080/api'],
    //     sendAccessToken: true
    //   }
    // }
    ),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
