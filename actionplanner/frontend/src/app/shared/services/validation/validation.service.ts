import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { toast } from "ngx-sonner";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  handleServerValidation(responseError: any): boolean {
    const isHttpErrorResponse = responseError instanceof HttpErrorResponse;
    const apiResponse = isHttpErrorResponse ? responseError.error : responseError

    if (!apiResponse) {
      throw responseError;
    }

    let message = apiResponse.message;

    const isRegistroEmUso = isHttpErrorResponse && responseError.status === HttpStatusCode.Conflict;
    const isErroIntegracao = isHttpErrorResponse && responseError.status === HttpStatusCode.BadGateway;

    if (!isErroIntegracao && !isRegistroEmUso) {
      message = apiResponse;
    }

    if (!message) {
      message = 'Ocorreu um erro de validação inesperado.';
    }

    toast.error(message);
    return true;
  }
}
