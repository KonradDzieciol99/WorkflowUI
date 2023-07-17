import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, mergeMap, Observable, take } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private readonly oAuthService: OAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.includes('openid-configuration')) {
      return next.handle(request);
    }

    const userToken = this.oAuthService.getAccessToken();
    const modifiedReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${userToken}`),
    });

    return next.handle(modifiedReq);

    // const token = localStorage.getItem('token');

    // if (token) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   })
    // }

    // return next.handle(request);
  }
}
