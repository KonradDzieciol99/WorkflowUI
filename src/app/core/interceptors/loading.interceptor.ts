import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { BusyService } from '../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

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
      //delay(250),
      finalize(() => {
        this.busyService.idle();
      })
    );

    return next.handle(request)//new
  }
}
