import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, map } from 'rxjs';
import { IdentityServerService } from 'src/app/authentication/identity-server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private oauthService: OAuthService,private identityServerService:IdentityServerService) {

  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.basicAuth();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.basicAuth();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.basicAuth();
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  private basicAuth(){
    return this.identityServerService.isDoneLoading$.pipe(
      map(x=>{
        if (x && this.oauthService.hasValidAccessToken()) {return true;}
        return false;
      })
      )
  }
}
