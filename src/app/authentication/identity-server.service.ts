import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { BehaviorSubject, Subject, filter } from 'rxjs';
export const authConfig: AuthConfig = {
  issuer: 'https://localhost:5001',
  redirectUri: 'https://localhost:4200/home',
  clientId: 'interactive',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope:
    'openid profile offline_access IdentityServerApi chat notification photos project signalR tasks aggregator',
  showDebugInformation: false,
  sessionChecksEnabled: true,
  clearHashAfterLogin: false,
  postLogoutRedirectUri: 'https://localhost:4200',
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
