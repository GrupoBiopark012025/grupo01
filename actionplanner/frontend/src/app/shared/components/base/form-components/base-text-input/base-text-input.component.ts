import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from "@angular/forms";
import { generateValidHtmlId } from "@shared/utils/base/form/form-components.utils";
import { FormControlService } from "@shared/services/form-control/form-control.service";

@Component({ template: '' })
export class BaseTextInputComponent implements OnInit, ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('Informe...');
  readOnly = input<boolean>(false);
  required = input<boolean>(false);

  onEnterPressed = output<Event>();

  private readonly _id = signal("");
  private readonly _disabled = signal(false);
  private readonly _hasRequiredValidator = signal(false);
  private readonly _minLength = signal<number | null>(null);
  private readonly _maxLength = signal<number | null>(null);
  private readonly _formControl = signal<FormControl | undefined>(undefined);
  readonly value = signal('');

  readonly formControl = this._formControl.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly minLength = this._minLength.asReadonly();
  readonly maxLength = this._maxLength.asReadonly();

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

  writeValue(value: any): void {
    this.value.set(value);
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
    this._disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.onChange(inputEl.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  triggerOnChange(value: any): void {
    this.onChange(value);
  }

  private readValidators(control: AbstractControl | null): void {
    if (!control?.validator) {
      return;
    }

    this._hasRequiredValidator.set(this.formControlService.hasRequiredValidator(control));
    this._minLength.set(this.formControlService.getMinLength(control));
    this._maxLength.set(this.formControlService.getMaxLength(control));
  }
}
