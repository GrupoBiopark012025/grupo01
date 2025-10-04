import { ErrorHandler, inject, Injectable, NgZone } from "@angular/core";
import { NavigationError, Router } from "@angular/router";
import { filter } from "rxjs";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { toast } from "ngx-sonner";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  private hasNavigationErrorOccurred = false;

  private zone = inject(NgZone);
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationError))
      .subscribe((e) => this.handleRoutingError(e as NavigationError));
  }

  handleError(error: any) {
    this.captureError(error);

    // Ignora erros de navegação
    if (this.hasNavigationErrorOccurred) {
      this.hasNavigationErrorOccurred = false;
      return;
    }

    // Erros de http são tratados no interceptor
    if (error instanceof HttpErrorResponse) {
      if (error.status !== HttpStatusCode.BadRequest) {
        return;
      }

      error = error.error;
    }

    // Erros de bad request em Cadastro/Edição devem ser tratados pelo componente
    const errorMessage = getApiErrorMessage(error);
    this.zone.run(() => toast.error(errorMessage));
  }

  handleRoutingError(e: NavigationError) {
    this.hasNavigationErrorOccurred = true;
    this.router.navigate(
      [ 'error', 'no-connection' ],
      {
        queryParams: {
          redirectTo: e.url
        }
      });
  }

  private captureError(error: any): void {
    const capturedError = error.originalError || error;

    // TODO: Mudar para não fazer log em produção
    console.error(capturedError);
  }
}

export const getApiErrorMessage = (response: HttpErrorResponse) => {
  const apiError = response.error;

  if (!apiError) {
    return 'Falha inesperada ao acessar servidor.';
  }

  let message = apiError.message;

  if (apiError.errors?.length) {
    message = apiError.errors[0].errorMessage;
  }

  if (!message) {
    message = 'Um erro inesperado ocorreu.'
  }

  return message;
}
