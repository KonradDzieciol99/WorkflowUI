import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { IdentityServerService } from 'src/app/authentication/identity-server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private oauthService: OAuthService,private identityServerService:IdentityServerService,private authenticationService:AuthenticationService,private router:Router, private toastrService: ToastrService) {

  }
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
  private basicAuth(){
    
    // if (this.oauthService.hasValidIdToken()) {
    //   return true;
    // }
    return this.identityServerService.isDoneLoading$.pipe(
      map(x=>{
        if (x && this.oauthService.hasValidAccessToken()) {return true;}
        return false;
      })
      )
    
    // .pipe(
    //   filter(isDone => isDone),
    //   switchMap(_ => this.authService.isAuthenticated$),
    //   tap(isAuthenticated => isAuthenticated || this.authService.login(state.url)),
    // );
    // return this.oauthService.loadDiscoveryDocumentAndTryLogin()
    //   .then(_ => {
    //     return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
    //   })
    //   .then(valid => {
    //     if (!valid) {
    //       this.router.navigate(['/unauthorized']);
    //     }
    //     return valid;
    //   });
    
    // this.oAuthService.get
    // return this.oAuthService.isDoneLoading$.pipe(
    //   filter(isDone => isDone),
    //   switchMap(_ => this.oAuthService.isAuthenticated$),
    //   tap(isAuthenticated => isAuthenticated || this.authService.login(state.url)),
    // );)
    
    //return true;
    //return true;
    //this.oauthService.hasValidAccessToken();
    // return this.authenticationService.currentUser$.pipe(
    //   mergeMap(auth=> {
    //     if (auth) {return of(true);}

    //     return this.authenticationService.refreshCurrentUser().pipe(
    //       map(()=>{
    //         this.toastrService.success("session restored");
    //         return true;
    //       }),
    //       catchError(()=>{
    //         this.router.navigate(['../auth/login']);
    //         return of(false);
    //       })
    //     )
    //   }),
    // )
  }
}
