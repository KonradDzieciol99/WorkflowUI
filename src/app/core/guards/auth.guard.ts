import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authenticationService:AuthenticationService,private router:Router, private toastrService: ToastrService) {

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
    return true;
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
