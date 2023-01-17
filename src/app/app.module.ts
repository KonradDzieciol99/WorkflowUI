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
import { MsalModule, MsalService, MSAL_INSTANCE,MsalInterceptor, MsalRedirectComponent } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
// import {  } from '@azure/msal-angular/msal.interceptor';



export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '252df27f-5077-4892-a74f-b686e0d8cf69',
      redirectUri: "https://localhost:4200/microsoft-auth",
      //navigateToLoginRequestUrl:false,
    }
    // , cache: {
    //   cacheLocation: "localStorage",
    //   storeAuthStateInCookie: isIE,
    // },
  });
}

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
    MsalModule,

  ],
  providers: [{
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
  },{
    provide:HTTP_INTERCEPTORS,
    useClass:MsalInterceptor,
    multi:true
  },

  MsalService],
  bootstrap: [AppComponent,MsalRedirectComponent]
})
export class AppModule { }
