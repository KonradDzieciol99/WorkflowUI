import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { ProblemDetails, isProblemDetails } from 'src/app/shared/models/ProblemDetails';
import { ValidationProblemDetails } from 'src/app/shared/models/ValidationProblemDetails ';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private toastrService: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: unknown) => {
        if (httpErrorResponse instanceof HttpErrorResponse) {

          if (isProblemDetails(httpErrorResponse.error)){
            this.toastrService.error(httpErrorResponse.error.detail,httpErrorResponse.error.title, { disableTimeOut: true,});
            return throwError(() => httpErrorResponse.error);
          }

          this.toastrService.error("Unknown error occurred, please try again later.",undefined, { disableTimeOut: true,});   
          return throwError(() => httpErrorResponse);
        }
        throw httpErrorResponse;
      }),
    );
  }
}
