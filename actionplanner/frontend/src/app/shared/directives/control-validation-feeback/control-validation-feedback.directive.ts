import { Directive, inject, input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { ValidationService } from "@shared/services/validation/validation.service";

@Directive({
  selector: '[controlValidationFeedback]',
  exportAs: 'controlValidationFeedback'
})
export class ControlValidationFeedbackDirective {
  controlValidationFeedback = input<FormControl>();

  private readonly validationService = inject(ValidationService);

  get errorMessage() {
    const control = this.controlValidationFeedback();

    if (!control || !control.errors) { return ''; }

    for (const propertyName in control.errors) {
      if (!control.errors.hasOwnProperty(propertyName)) { continue; }
      return this.validationService.getValidatorErrorMessage(propertyName, control.errors[propertyName]);
    }

    return '';
  };
}
