import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  private readonly emptyControl = new FormControl('');
  private readonly shortControl = new FormControl('x');
  private readonly longControl = new FormControl('x'.repeat(1000));

  hasRequiredValidator(control: AbstractControl | null): boolean {
    if (!control?.validator) {
      return false;
    }

    const validateFn = control.validator;

    const requiredError = validateFn(this.emptyControl);

    return !!requiredError?.['required'];
  }

  getMinLength(control: AbstractControl | null): number | null {
    if (!control?.validator) {
      return null;
    }

    const validateFn = control.validator;

    const error = validateFn(this.shortControl);

    return error?.['minlength']?.requiredLength ?? null;
  }

  getMaxLength(control: AbstractControl | null): number | null {
    if (!control?.validator) {
      return null;
    }

    const validateFn = control.validator;

    const error = validateFn(this.longControl);

    return error?.['maxlength']?.requiredLength ?? null;
  }
}
