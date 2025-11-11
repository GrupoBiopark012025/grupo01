import { Component, input } from '@angular/core';
import {
  BaseTextInputComponent
} from "@shared/components/base/form-components/base-text-input/base-text-input.component";
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from "@shared/components/zardui/form/form.component";
import {
  ControlValidationFeedbackDirective
} from "@shared/directives/control-validation-feeback/control-validation-feedback.directive";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-text-area',
  imports: [
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ControlValidationFeedbackDirective,
    ZardFormControlComponent,
    ZardInputDirective,
    FormsModule
  ],
  templateUrl: './text-area.component.html',
  host: {
    '[class.h-100]': 'fullHeight()',
    '[class.d-flex]': 'fullHeight()',
    '[class.flex-column]': 'fullHeight()',
  }
})
export class TextAreaComponent extends BaseTextInputComponent {
  rows = input<number>(3);
  cols = input<number | null>(null);
  fullHeight = input(false);
  autoExpandable = input<boolean>(false);
}
