import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule
} from "@angular/forms";
import { FormControlService } from "@shared/services/form-control/form-control.service";
import { ZardCheckboxComponent } from "@shared/components/zardui/checkbox/checkbox.component";
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from "@shared/components/zardui/form/form.component";
import { generateValidHtmlId } from "@shared/utils/base/form/form-components.utils";
import {
  ControlValidationFeedbackDirective
} from "@shared/directives/control-validation-feeback/control-validation-feedback.directive";

@Component({
  selector: 'app-checkbox',
  imports: [
    ReactiveFormsModule,
    ZardCheckboxComponent,
    ZardFormControlComponent,
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    FormsModule,
    ControlValidationFeedbackDirective
  ],
  templateUrl: './checkbox.component.html'
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  label = input.required<string>();
  description = input<string>('');
  required = input<boolean>(false);
  disable = input<boolean>(false);

  private readonly _id = signal<string>('');
  private readonly _value = signal<boolean>(false);
  private readonly _isDisabled = signal(false);
  private readonly _hasRequiredValidator = signal(false);
  private readonly _formControl = signal<FormControl | undefined>(undefined);

  readonly value = this._value.asReadonly();
  readonly formControl = this._formControl.asReadonly();
  readonly isDisabled = this._isDisabled.asReadonly();

  readonly id = computed(() => generateValidHtmlId(this._id() || this.label()));
  readonly isRequired = computed(() => this.required() || this._hasRequiredValidator());

  private readonly controlDir = inject(NgControl, { self: true });
  private readonly formControlService = inject(FormControlService);

  constructor() {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    this.readValidators(control);
    this._formControl.set(control as FormControl);
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this._value.set(value);
    console.log('writeValue: ', value);
    if (!this._id()) {
      this._id.set(this.controlDir.name as string);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled.set(isDisabled);
  }

  toggleCheckbox(): void {
    this._value.update(v => !v);
    this.onChange(this._value());
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }

  private readValidators(control: AbstractControl | null): void {
    if (!control?.validator) {
      return;
    }

    this._hasRequiredValidator.set(this.formControlService.hasRequiredValidator(control));
  }
}
