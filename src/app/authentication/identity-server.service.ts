import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { BehaviorSubject, filter, Subject, take } from 'rxjs';
import { MessagesService } from '../messages/messages.service';
import { PresenceService } from '../shared/services/presence.service';
import { BusyService } from '../core/services/busy.service';



export const authConfig: AuthConfig = {
  issuer: 'https://localhost:5001',
  redirectUri:"https://localhost:4200/home",
  clientId: 'interactive',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope: 'openid profile offline_access IdentityServerApi chat notification photos project signalR tasks aggregator',
  showDebugInformation: false,
  sessionChecksEnabled: true,//Chyba to mi pomagało z tym że jeśli któraś z innych kart w przeglądarce wyloguje uzytkownika to on za pomocą tego eventu terminated pozwoli również na wylogowanie
  clearHashAfterLogin: false,
  postLogoutRedirectUri: "https://localhost:4200",
  //useSilentRefresh: true,
  
  
  //silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  //useSilentRefresh: true,
  //silentRefreshTimeout: 5000, // For faster testing
  //timeoutFactor: 0.5, // For faster testing
}

@Injectable({
  providedIn: 'root'
})
export class IdentityServerService {

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();
  userProfileSubject = new Subject<UserInfo>();

  constructor(private readonly oAuthService: OAuthService) {
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

    ///---------------------
    // this.oAuthService.events
    //   .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
    //   .subscribe(e =>
    //      this.navigateToLoginPage()
    //   );
    ///---------------------

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

  this.oAuthService.events
  .pipe(filter(e => e.type == 'token_expires'))
  .subscribe(e => {
      console.debug("token_expires event");
  });

  
    this.oAuthService.events
      .pipe(filter(e => e.type == 'session_terminated'))
      .subscribe(()=>{

        console.debug("session_terminated event");

        if(this.oAuthService.hasValidAccessToken()){
          this.oAuthService.logOut(); 
        }
      }
      );

  }
  private navigateToLoginPage() {
    // TODO: Remember current URL
    this.runInitialLoginSequence();
    //this.router.navigateByUrl('/');
  }


  public async runInitialLoginSequence(): Promise<void> {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    await this.oAuthService.loadDiscoveryDocument();
    await this.oAuthService.tryLoginCodeFlow()

    if (this.oAuthService.hasValidAccessToken()) 
      this.isDoneLoadingSubject$.next(true);  
    else {
      this.oAuthService.initLoginFlow();
      this.isDoneLoadingSubject$.next(false);
      throw new Error('The token is invalid or does not exist');
    }
    
  }
}
  
  // public runInitialLoginSequence(): Promise<void> {

  //   this.busyService.busy();

  //   this.oAuthService.configure(authConfig);

  //   this.oAuthService.setupAutomaticSilentRefresh();

  //   console.log("CZY TEST TEST TEST TESTES TEST")
  //   return this.oAuthService.loadDiscoveryDocument().then( () => {

  //   return this.oAuthService.tryLoginCodeFlow() // (which picks up the fact that the user was just redirected from the B2C, and grabs the tokens)
  //     .then( ()=>{
  //       if (!this.oAuthService.hasValidAccessToken()) {
  //         console.log("sdfsadf");
  //         this.oAuthService.initLoginFlow()
  //         this.isDoneLoadingSubject$.next(false);
          
  //         // return Promise.resolve();
  //       } else {
  //         //oAuthService.scope="";
  //         //console.log(this.oAuthService.getIdentityClaims());
  //         this.isDoneLoadingSubject$.next(true);
          
          
  //         // return this.oAuthService.loadUserProfile().then( (userProfile) => {
  //         //   this.userProfileSubject.next(userProfile as UserInfo)
  //         // })

  //         //presence
  //         //////////////////////////// this.presenceService.createHubConnection(this.oAuthService.getAccessToken());

  //         //////////////////////////// this.presenceService.getAllNotifications().pipe(take(1)).subscribe();

  //         //this.messagesService.stopHubConnection();
  //         ////////////this.messagesService.createHubConnection(this.oAuthService.getAccessToken());

  //         this.busyService.idle();
  //         //////////////////////////// To CHYBA POWINOO byc W  app.component.ts takie inicjowanie
  //       }
  //     });
  //   });
  // }

