import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { generateValidHtmlId } from "@shared/utils/base/form/form-components.utils";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule
} from "@angular/forms";
import { FormControlService } from "@shared/services/form-control/form-control.service";
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from "@shared/components/zardui/form/form.component";
import { ZardSelectComponent } from "@shared/components/zardui/select/select.component";
import { ZardSelectItemComponent } from "@shared/components/zardui/select/select-item.component";
import { UserAccessLevelEnum } from "@data/user/dtos";
import {
  ControlValidationFeedbackDirective
} from "@shared/directives/control-validation-feeback/control-validation-feedback.directive";

@Component({
  selector: 'app-select',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ZardFormControlComponent,
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ControlValidationFeedbackDirective
  ],
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit, ControlValueAccessor {

  bindValue = input<string>('value');
  bindLabel = input<string>('label');

  label = input<string>('');
  placeholder = input<string>('Selecione...');

  required = input<boolean>(false);
  readOnly = input<boolean>(false);

  options = input.required<SelectOption[]>();

  onSelectionChange = output<any>();

  private readonly _id = signal("");
  private readonly _value = signal<any>(null);
  private readonly _disabled = signal(false);
  private readonly _errorMessage = signal('');
  private readonly _hasRequiredValidator = signal(false);
  private readonly _formControl = signal<FormControl | undefined>(undefined);

  value = this._value.asReadonly();
  isDisabled = this._disabled.asReadonly();
  errorMessage = this._errorMessage.asReadonly();
  formControl = this._formControl.asReadonly();
  id = computed(() => generateValidHtmlId(this._id() || this.label()));
  isRequired = computed(() => this._hasRequiredValidator() || this.required());
  isReadOnly = computed(() => this._disabled() || this.readOnly());

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

  writeValue(value: any): void {
    this._value.set(value);
    if (!this._id()) {
      this._id.set(this.controlDir.name as string);
    }

    // TODO: validar se será necessário tratar nulls
    // handleNullItemSelect(this._ngSelectComponent, value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  onSelect(value: string) {
    this._value.set(value as any);
    this.onChange(value);
    this.onSelectionChange.emit(value as any);
  }

  onBlur(): void {
    this.onTouched();
  }

  onError(errorMessage: string): void {
    this._errorMessage.set(errorMessage);
  }

  private readValidators(control: AbstractControl | null): void {
    if (!control?.validator) {
      return;
    }

    this._hasRequiredValidator.set(
      this.formControlService.hasRequiredValidator(control));
  }

  protected readonly UserAccessLevelEnum = UserAccessLevelEnum;
}

interface SelectOption {
  label: string;
  value: any
}