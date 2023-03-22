import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { BehaviorSubject, filter, Subject, take } from 'rxjs';
import { MessagesService } from '../messages/messages.service';
import { PresenceService } from '../shared/services/presence.service';

export const authConfigForMyApi: AuthConfig = {
  issuer: 'https://localhost:7122',
  redirectUri:"https://localhost:4200/home",
  clientId: 'interactive',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope: 'openid offline_access email_access_token profile email IdentityServerApi',//emailweatherapi
  showDebugInformation: false,
  sessionChecksEnabled: true,
  clearHashAfterLogin: false,
  useSilentRefresh: true,
  
  //silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  //useSilentRefresh: true,
  //silentRefreshTimeout: 5000, // For faster testing
  //timeoutFactor: 0.25, // For faster testing
}
// export const authConfigForMyApi: AuthConfig = {
//   //https://login.microsoftonline.com/5d3aafdf-d077-4419-bd3c-622d8000bc09/v2.0
//   issuer: 'https://login.microsoftonline.com/5d3aafdf-d077-4419-bd3c-622d8000bc09/v2.0',
//   //redirectUri: window.location.origin + '/home',
//   redirectUri:"https://localhost:7122/signin-microsoft",
//   clientId: '8d5e37cb-cb3f-4c5b-b083-e3dd6fb7732d',
//   responseType: 'code',
//   strictDiscoveryDocumentValidation: false,
//   //scope: 'email openid profile https://graph.microsoft.com/User.Read offline_access api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api ',
//   scope: 'openid email profile',
//   //openid 
//   //api://9ff45ee6-387f-4a22-928b-e3a26abed5d4/api <----- working
//   //9ff45ee6-387f-4a22-928b-e3a26abed5d4/api
//   //https://graph.microsoft.com/User.Read  api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api
//   //api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api
//   // openid offline_access email 
//   //
//   // oidc:false,
//   // gr
// }
@Injectable({
  providedIn: 'root'
})
export class IdentityServerService {

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();
  userProfileSubject = new Subject<UserInfo>();

  constructor(private readonly oAuthService: OAuthService,
     private readonly httpClient: HttpClient,
     private router: Router,
     private presenceService:PresenceService,
     private messagesService:MessagesService ) {
    this.load()
  }
  load(){

    // window.addEventListener('storage', (event) => {
    //   if (event.key !== 'access_token' && event.key !== null) {
    //     return;
    //   }
    //   console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');
    //   //this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
    //   if (!this.oAuthService.hasValidAccessToken()) {
    //     this.navigateToLoginPage();
    //   }
    // });

    this.oAuthService.events
      .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
      .subscribe(e =>
         this.navigateToLoginPage()
      );

    // this.oAuthService.events
    //   .subscribe(_ => {
    //     this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
    //   });
    // this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

    // this.oAuthService.events
    //   .pipe(filter(e => ['token_received'].includes(e.type)))
    //   .subscribe(e => this.oauthService.loadUserProfile());



    //this.oAuthService.configure(authConfigForMyApi);
  //   //oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";

  //   this.oAuthService.loadDiscoveryDocument("https://localhost:7122/.well-known/openid-configuration").then( () => {

  //   this.oAuthService.tryLoginCodeFlow() // (which picks up the fact that the user was just redirected from the B2C, and grabs the tokens)
  //   .then( ()=>{
  //     if (!this.oAuthService.hasValidAccessToken()) {
  //       console.log("sdfsadf");
  //       this.oAuthService.initLoginFlow()
  //     } else {
  //       //oAuthService.scope="";
  //       //console.log(this.oAuthService.getIdentityClaims());
  //       this.isDoneLoadingSubject$.next(true);
  //       this.oAuthService.loadUserProfile().then( (userProfile) => {
  //         this.userProfileSubject.next(userProfile as UserInfo)
  //       })
  //     }
  //   });
  //   });
  }
  private navigateToLoginPage() {
    // TODO: Remember current URL
    this.runInitialLoginSequence();
    //this.router.navigateByUrl('/');
  }

  public runInitialLoginSequence(): Promise<void> {

    this.oAuthService.configure(authConfigForMyApi);
//"https://localhost:7122/.well-known/openid-configuration"
    return this.oAuthService.loadDiscoveryDocument().then( () => {

    return this.oAuthService.tryLoginCodeFlow() // (which picks up the fact that the user was just redirected from the B2C, and grabs the tokens)
      .then( ()=>{
        if (!this.oAuthService.hasValidAccessToken()) {
          console.log("sdfsadf");
          this.oAuthService.initLoginFlow()
          this.isDoneLoadingSubject$.next(false);
          // return Promise.resolve();
        } else {
          //oAuthService.scope="";
          //console.log(this.oAuthService.getIdentityClaims());
          this.isDoneLoadingSubject$.next(true);
          
          // return this.oAuthService.loadUserProfile().then( (userProfile) => {
          //   this.userProfileSubject.next(userProfile as UserInfo)
          // })

          //presence
          this.presenceService.createHubConnection(this.oAuthService.getAccessToken());

          this.presenceService.getAllNotifications().pipe(take(1)).subscribe();

          //this.messagesService.stopHubConnection();
          this.messagesService.createHubConnection(this.oAuthService.getAccessToken())
        }
      });
    });
  }
}
