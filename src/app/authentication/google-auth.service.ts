import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, LoginOptions, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';





const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',

  // strict discovery document disallows urls which not start with issuers url
  strictDiscoveryDocumentValidation: false,
  
  // URL of the SPA to redirect the user to after login
  dummyClientSecret:"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",
  //redirectUri: window.location.origin + '/index.html',
  redirectUri: "https://localhost:4200/home",
  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  //clientId: '763790726888-7lhqbmnv2rav13818o28qv0i4j6es0h1.apps.googleusercontent.com',
  clientId:'763790726888-7lhqbmnv2rav13818o28qv0i4j6es0h1.apps.googleusercontent.com',
  useSilentRefresh:true,
  //acce
  //refres
  //useSilentRefresh:true,
  // set the scope for the permissions the client should request
  //scope: 'openid profile email offline_access',
  scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly offline_access',
  //offline_access offline_access
  responseType: 'code',
  
  showDebugInformation: true,
};

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}



@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  gmail = 'https://gmail.googleapis.com'

  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService, private readonly httpClient: HttpClient) {
    // confiure oauth2 service
    oAuthService.configure(authCodeFlowConfig);
    // manually configure a logout url, because googles discovery document does not provide it
    oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";

    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    oAuthService.loadDiscoveryDocument().then( () => {
      // // This method just tries to parse the token(s) within the url when
      // // the auth-server redirects the user back to the web-app
      // // It doesn't send the user the the login page

      // oAuthService.tryLoginImplicitFlow().then( () => {

      //   // when not logged in, redirecvt to google for login
      //   // else load user profile
      //   if (!oAuthService.hasValidAccessToken()) {
      //     oAuthService.initLoginFlow()
      //   } else {
      //     oAuthService.loadUserProfile().then( (userProfile) => {
      //       this.userProfileSubject.next(userProfile as UserInfo)
      //     })
      //   }
      //
      // })
      // console.log("sdfsadf");
      // let sdf = new LoginOptions()
      // oAuthService.login
      //oAuthService.configure()
      oAuthService.tryLoginCodeFlow().then( ()=>{
        if (!oAuthService.hasValidAccessToken()) {
          console.log("sdfsadf");
          oAuthService.initLoginFlow()
        } else {
          oAuthService.loadUserProfile().then( (userProfile) => {
            console.log(userProfile);
            this.userProfileSubject.next(userProfile as UserInfo)
          })
        }
      })

    });

    this
    .oAuthService
    .events
    .subscribe(e => {
        if(e.type == 'token_expires')
        {
          this.oAuthService.silentRefresh();
        }
    });
  }

  emails(userId: string): Observable<any> {
    return this.httpClient.get(`${this.gmail}/gmail/v1/users/${userId}/messages`, { headers: this.authHeader() })
  }

  getMail(userId: string, mailId: string): Observable<any> {
    return this.httpClient.get(`${this.gmail}/gmail/v1/users/${userId}/messages/${mailId}`, { headers: this.authHeader() })
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }

  signOut() {
    this.oAuthService.logOut()
    this.oAuthService.revokeTokenAndLogout()
  }
  private authHeader() : HttpHeaders {
    return new HttpHeaders ({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
    })
  }

}
