import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize, from, mergeMap } from 'rxjs';
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

    return from(this.busyService.busy()).pipe(
      mergeMap(()=>next.handle(request)),
      finalize(async () => void await this.busyService.idle())
    )

    //return next.handle(request)//new
  }
}
