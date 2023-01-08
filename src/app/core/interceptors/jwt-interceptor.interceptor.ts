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

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if (request.method === 'POST') {
    //   return next.handle(request);
    // }
    // if (request.method === 'DELETE') {
    //   return next.handle(request);
    // }
    // if (request.method === 'PUT') {
    //   return next.handle(request);
    // }
    this.busyService.busy();
    return next.handle(request).pipe(
      delay(250),
      finalize(() => {
        this.busyService.idle();
      })
    );
  }
}
