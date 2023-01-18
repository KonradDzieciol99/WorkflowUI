import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';


export const authConfig: AuthConfig = {
  //https://login.microsoftonline.com/5d3aafdf-d077-4419-bd3c-622d8000bc09/v2.0
  issuer: 'https://login.microsoftonline.com/5d3aafdf-d077-4419-bd3c-622d8000bc09/v2.0',
  //redirectUri: window.location.origin + '/home',
  redirectUri:"https://localhost:4200/home",
  clientId: '16d44edc-9af3-4c4f-9626-66bd339b5f79',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  //scope: 'email openid profile https://graph.microsoft.com/User.Read offline_access api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api ',
  scope: 'api://9ff45ee6-387f-4a22-928b-e3a26abed5d4/api ',
  //openid 
  //api://9ff45ee6-387f-4a22-928b-e3a26abed5d4/api <----- working
  //9ff45ee6-387f-4a22-928b-e3a26abed5d4/api
  //https://graph.microsoft.com/User.Read  api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api
  //api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api
  // openid offline_access email 
  //
  // oidc:false,
  // gr
}

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
export class MicrosoftOpeinIDAuthService {

  gmail = 'https://gmail.googleapis.com'

  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService, private readonly httpClient: HttpClient) {
    // confiure oauth2 service
    oAuthService.configure(authConfig);
    // manually configure a logout url, because googles discovery document does not provide it
    oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";
    //oAuthService.userinfoEndpoint=""
    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    //oAuthService.resd
    oAuthService.loadDiscoveryDocument("https://login.microsoftonline.com/5d3aafdf-d077-4419-bd3c-622d8000bc09/v2.0/.well-known/openid-configuration").then( () => {
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
      //oAuthService.userinfoEndpoint="https://graph.microsoft.com/v2.0"

      
      oAuthService.tryLoginCodeFlow().then( ()=>{
        if (!oAuthService.hasValidAccessToken()) {
          console.log("sdfsadf");
          oAuthService.initLoginFlow()
        } else {
          //oAuthService.scope="";
          console.log(this.oAuthService.getIdentityClaims());
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
