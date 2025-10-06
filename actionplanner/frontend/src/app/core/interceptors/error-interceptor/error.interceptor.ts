import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "@core/services/authentication/authentication.service";
import { catchError, Observable, throwError } from "rxjs";
import { toast } from "ngx-sonner";
import { getApiErrorMessage } from "@core/error-handlers/global-error-handler/global.error-handler";

export const BYPASS_ERROR_INTERCEPTOR = new HttpContextToken(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  if (req.context.get(BYPASS_ERROR_INTERCEPTOR)) {
    return next(req);
  }

  const defaultErrorHandler = (response: HttpErrorResponse): Observable<never> => {
    toast.error(getApiErrorMessage(response));
    return throwError(() => response);
  };

  const handleError401 = (response: HttpErrorResponse): Observable<never> => {
    if (!response.url?.endsWith('/auth')) {
      toast.error('Sessão expirada.');
      authService.logout(true);
    }

    if (!authService.isLoggedIn()) {
      return throwError(() => response);
    }

    return defaultErrorHandler(response);
  };

  const handleError403 = (response: HttpErrorResponse): Observable<never> => {
    router.navigate(['error', 'forbidden']);
    return throwError(() => response);
  };

  const handleError404 = (response: HttpErrorResponse): Observable<never> => {
    toast.error('Não foi possível encontrar o recurso. (404)');
    return throwError(() => response);
  };

  const handleInternalError = (response: HttpErrorResponse): Observable<never> => {
    const redirectTo = router.url;

    if (!redirectTo.startsWith('/error/no-connection')) {
      router.navigate(['error', 'no-connection'], { queryParams: { redirectTo } });
    }

    return throwError(() => response);
  };

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case HttpStatusCode.BadRequest:
          case HttpStatusCode.Conflict:
            return throwError(() => error);
          case HttpStatusCode.Unauthorized:
            return handleError401(error);
          case HttpStatusCode.Forbidden:
            return handleError403(error);
          case HttpStatusCode.NotFound:
            return handleError404(error);
          case 0:
          case HttpStatusCode.InternalServerError:
            return handleInternalError(error);
          default:
            return defaultErrorHandler(error);
        }
      }

      return throwError(() => error);
    })
  );
};
