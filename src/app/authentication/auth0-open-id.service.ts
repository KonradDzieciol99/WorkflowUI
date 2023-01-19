import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';


export const authConfigForGraph: AuthConfig = {
  //https://login.microsoftonline.com/5d3aafdf-d077-4419-bd3c-622d8000bc09/v2.0
  issuer: 'https://login.microsoftonline.com/5d3aafdf-d077-4419-bd3c-622d8000bc09/v2.0',
  //redirectUri: window.location.origin + '/home',
  redirectUri:"https://localhost:4200/home",
  clientId: '16d44edc-9af3-4c4f-9626-66bd339b5f79',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  //scope: 'email openid profile https://graph.microsoft.com/User.Read offline_access api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api ',
  scope: 'openid',
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
export const authConfigForMyApi: AuthConfig = {
  customQueryParams: {
    // Your API's name
    audience: 'https://localhost:44346'
  },
  //https://login.microsoftonline.com/5d3aafdf-d077-4419-bd3c-622d8000bc09/v2.0
  issuer: 'https://dev-b8y3ge9o.eu.auth0.com/',
  //redirectUri: window.location.origin + '/home',
  redirectUri:"https://localhost:4200/home",
  clientId: '3b3Fk8P2knWjPc31HBwz8L78ccY85BCo',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  logoutUrl: 'https://dev-g-61sdfs.eu.auth0.com/v2/logout',
  //scope: 'email openid profile https://graph.microsoft.com/User.Read offline_access api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api ',
  scope: 'openid profile email offline_access',
  //red
  //User.Read  
  //openid offline_access https://provisioningdemodev.onmicrosoft.com/ng-azureb2c-pkce-demo/api
  //openid  openid User.Read email profile offline_access
  //api://9ff45ee6-387f-4a22-928b-e3a26abed5d4/api <----- working
  //9ff45ee6-387f-4a22-928b-e3a26abed5d4/api
  //https://graph.microsoft.com/User.Read  api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api
  //api://16d44edc-9af3-4c4f-9626-66bd339b5f79/api
  // openid offline_access email 
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
export class Auth0OpenIDService {
  gmail = 'https://gmail.googleapis.com'
  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService, private readonly httpClient: HttpClient) {

    oAuthService.configure(authConfigForMyApi);
    oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";
    oAuthService.loadDiscoveryDocument("https://dev-b8y3ge9o.eu.auth0.com/.well-known/openid-configuration").then( () => {

    oAuthService.tryLoginCodeFlow().then( ()=>{
      if (!oAuthService.hasValidAccessToken()) {
        console.log("sdfsadf");
        oAuthService.initLoginFlow()
      } else {
        //oAuthService.scope="";
        //console.log(this.oAuthService.getIdentityClaims());
        oAuthService.loadUserProfile().then( (userProfile) => {
          this.userProfileSubject.next(userProfile as UserInfo)
        })
      }
    })
    });
  }

}
