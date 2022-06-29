import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { TokenDbo } from '../models/TokenDbo.model';
import { take } from 'rxjs/operators';
@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(public authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: TokenDbo;

    this.authenticationService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }

    return next.handle(request);
  }


}



// intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

//   if (this.authenticationService.getJwtToken()) {
//     request = this.addToken(request, this.authenticationService.getJwtToken()!);
//   }

//   return next.handle(request);
// }

// private addToken(request: HttpRequest<any>, token: string) {
//   return request.clone({
//     setHeaders: {
//       'Authorization': `Bearer ${token}`
//     }
//   });
// }