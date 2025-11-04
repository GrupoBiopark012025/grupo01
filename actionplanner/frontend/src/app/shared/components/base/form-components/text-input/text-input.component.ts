import { Component, input } from '@angular/core';
import {
  BaseTextInputComponent
} from "@shared/components/base/form-components/base-text-input/base-text-input.component";
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from "@shared/components/zardui/form/form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import {
  ControlValidationFeedbackDirective
} from "@shared/directives/control-validation-feeback/control-validation-feedback.directive";

@Component({
  selector: 'app-text-input',
  imports: [
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ZardFormControlComponent,
    FormsModule,
    ReactiveFormsModule,
    ZardInputDirective,
    ControlValidationFeedbackDirective
  ],
  templateUrl: './text-input.component.html'
})
export class TextInputComponent extends BaseTextInputComponent {
  inputType = input<'text' | 'email' | 'tel' | 'password'>('text');
  customClass = input<string>('');
}
