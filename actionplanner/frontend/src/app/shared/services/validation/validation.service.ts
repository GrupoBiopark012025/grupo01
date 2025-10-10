import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { toast } from "ngx-sonner";
import { FormValidatorsUtils } from "@shared/utils/base/form/form-validator.utils";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
    const config = {
      required: 'Preencha este campo.',
      email: 'E-mail inválido.',
      min: `Deve ser no mínimo ${FormValidatorsUtils.number.toString(validatorValue.min)}.`,
      max: `Deve ser no máximo ${FormValidatorsUtils.number.toString(validatorValue.max)}.`,
      minlength: `Tamanho mínimo de ${validatorValue.requiredLength} caracteres.`,
      maxlength: `Tamanho máximo de ${validatorValue.requiredLength} caracteres.`,
      inclusiveBetween: `Deve ser entre ${FormValidatorsUtils.number.toString(validatorValue.min)} e ${FormValidatorsUtils.number.toString(validatorValue.max)}.`,
      date: `Deve ser uma data válida.`,
      minDate: `Deve ser a partir de ${validatorValue}.`,
      maxDate: `Deve ser até ${validatorValue}.`,
      custom: `${validatorValue}`,
      serverValidation: `${validatorValue}`,
      invalidMonth: 'O mês deve estar entre 01 e 12.',
      invalidYear: 'O ano deve ser maior ou igual a 1900.'
    };

    type ObjectKey = keyof typeof config;

    return config[validatorName as ObjectKey] || 'O valor informado é inválido';
  }

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
