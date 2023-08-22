import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {

  constructor(private toastrService: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(httpErrorResponse => {
        if (httpErrorResponse instanceof HttpErrorResponse) {
          
          if (httpErrorResponse.status === 400) {
            this.toastrService.error(httpErrorResponse.error)
          }
          if (httpErrorResponse.status === 401) {
            this.toastrService.error(httpErrorResponse.error)
          }
          if (httpErrorResponse.status === 404) {
            this.toastrService.error(httpErrorResponse.error);
          }
          if (httpErrorResponse.status === 500) {
            this.toastrService.error(httpErrorResponse.error);
          }
          return throwError(() => httpErrorResponse);
        }
        throw httpErrorResponse;
      })
    )
  }
}
