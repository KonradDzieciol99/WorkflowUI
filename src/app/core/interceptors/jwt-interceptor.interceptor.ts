import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, mergeMap, Observable, take } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { BusyService } from '../services/busy.service';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private auth0Service: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    return this.auth0Service.getAccessTokenSilently().pipe(
      mergeMap(token => {
        const tokenReq = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next.handle(tokenReq);
      })
    );
    //return next.handle(request);

    // const token = this.auth0Service.

    // if (token) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   })
    // }

    //return next.handle(request);
  }
}
