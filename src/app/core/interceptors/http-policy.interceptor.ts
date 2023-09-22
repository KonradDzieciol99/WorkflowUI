import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, delay, mergeMap, of, retry, retryWhen, throwError, timer } from 'rxjs';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            retry({
              count:4,
              delay:(err,retryCount)=>{
                  if (this.isTransientError(err)) 
                      return timer(retryCount * 1000);

                return EMPTY;
              }
            })
        );
    }
    private isTransientError(error: HttpErrorResponse): boolean {
        return error.status === 408 || error.status === 429 || (error.status >= 500 && error.status < 600);
    }
}