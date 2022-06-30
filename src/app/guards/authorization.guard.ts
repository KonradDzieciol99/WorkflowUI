import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthenticationService } from '../services/authentication.service';
import { throwError, fromEvent} from 'rxjs';
import { TokenDbo } from '../models/TokenDbo.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private jwtHelper: JwtHelperService,
    
) {console.log("asdfasdfasdfa") }


    canActivate() {
    return this.authenticationService.currentUser$.pipe(
      map(user => {
          
        if (user) 
        {
          if (this.jwtHelper.isTokenExpired(user.token))
          {
            console.log("Guard info: token invalid");
            return false;
          }
          console.log("Guard info: token valid");
        return true;
        }
        else {
        console.log("Guard info: lack of token");
        return false;
        }
        //this.toastr.error('You shall not pass!')
      }),
      // catchError((err, caught) => {
      //   return true;
      // })
    )
      // var token=this.authenticationService.getJwtToken()
      // if (token) 
      // {
      //   if (this.jwtHelper.isTokenExpired(token)) 
      //   {
      //     // token expired 
      //     console.log("Guard info: token invalid");
      //   }else{
      //     // token valid
      //     console.log("Guard info: token valid");
      //     return true;
      //   }
      // }else{
      //   console.log("Guard info: lack token");
      // }

      // this.router.navigateByUrl('/Login');
      // // this.flashMessages.show('You don\'t have creadentials for this page', {
      // //   cssClass: 'alert-danger',
      // //   timeout: 3000
      // // });
      // return false
    }
  
}
