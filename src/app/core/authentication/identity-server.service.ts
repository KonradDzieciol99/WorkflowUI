import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { BehaviorSubject, Subject, filter } from 'rxjs';
import { environment } from 'src/environments/environment';
export const authConfig: AuthConfig = {
  issuer: environment.identityServerUrlConf,
  redirectUri: `${environment.clientUrl}/home`,
  clientId: 'interactive',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope:
    'openid profile offline_access IdentityServerApi chat notification photos project signalR tasks aggregator',
  showDebugInformation: false,
  sessionChecksEnabled: true,
  clearHashAfterLogin: false,
  postLogoutRedirectUri: environment.clientUrl,
  requireHttps:false
};

@Injectable({
  providedIn: 'root',
})
export class IdentityServerService {
  private isDoneLoadingSubjectSource$ = new BehaviorSubject(false);
  public isDoneLoading$ = this.isDoneLoadingSubjectSource$.asObservable();
  constructor(private readonly oAuthService: OAuthService) {
    this.load();
  }
  load() {
    this.oAuthService.events
      .pipe(filter((event) => event.type == 'session_terminated'))
      .subscribe(() => {
        console.debug('session_terminated event');
        if (this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.logOut();
        }
      });
  }
  public async runInitialLoginSequence(): Promise<void> {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    await this.oAuthService.loadDiscoveryDocument();
    await this.oAuthService.tryLoginCodeFlow();

    if (this.oAuthService.hasValidAccessToken())
      this.isDoneLoadingSubjectSource$.next(true);
    else {
      this.oAuthService.initLoginFlow();
      this.isDoneLoadingSubjectSource$.next(false);
      throw new Error('The token is invalid or does not exist');
    }
  }
}
