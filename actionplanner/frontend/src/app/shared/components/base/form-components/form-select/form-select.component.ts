import { Component, Input, Output, EventEmitter, forwardRef, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col gap-2">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-gray-700">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      
      <div class="relative">
        <!-- Select Button -->
        <button
          type="button"
          [id]="id"
          (click)="toggleDropdown()"
          [disabled]="disabled"
          [class]="buttonClasses"
        >
          <span class="block truncate text-left">
            {{ selectedLabel() || placeholder || 'Selecione...' }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg 
              class="h-4 w-4 text-gray-400 transition-transform duration-200"
              [class.rotate-180]="isOpen()"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </button>

        <!-- Dropdown Menu -->
        <div
          *ngIf="isOpen()"
          class="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto"
        >
          <ul class="py-1">
            <li
              *ngFor="let option of options; trackBy: trackByValue"
              (click)="selectOption(option)"
              [class]="getOptionClasses(option)"
            >
              <span class="block truncate">{{ option.label }}</span>
              <span
                *ngIf="isSelected(option)"
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <p *ngIf="error" class="text-sm text-red-500">
        {{ error }}
      </p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor {
  @Input() id: string = `select-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() options: SelectOption[] = [];
  @Input() required: boolean = false;
  @Input() error?: string;
  @Output() selectionChange = new EventEmitter<any>();

  value: any = null;
  disabled: boolean = false;
  isOpen = signal(false);

  private onChangeFn: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  get buttonClasses(): string {
    const baseClasses = `
      relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left
      border border-gray-300
      text-sm
      transition-colors duration-200
      hover:border-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    `;
    
    const stateClasses = this.disabled 
      ? 'bg-gray-100 cursor-not-allowed opacity-60'
      : '';
    
    const errorClasses = this.error 
      ? 'border-red-500 focus:ring-red-500'
      : '';

    return `${baseClasses} ${stateClasses} ${errorClasses}`.trim().replace(/\s+/g, ' ');
  }

  getOptionClasses(option: SelectOption): string {
    const isSelected = this.isSelected(option);
    
    return `
      relative cursor-pointer select-none py-2 pl-3 pr-9
      transition-colors duration-150
      ${isSelected 
        ? 'bg-blue-50 text-blue-900' 
        : 'text-gray-900 hover:bg-gray-50'
      }
    `.trim().replace(/\s+/g, ' ');
  }

  selectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.value);
    return selected ? selected.label : '';
  }

  isSelected(option: SelectOption): boolean {
    return option.value === this.value;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen.set(!this.isOpen());
    }
  }

  selectOption(option: SelectOption): void {
    this.value = option.value;
    this.onChangeFn(option.value);
    this.selectionChange.emit(option.value);
    this.isOpen.set(false);
    this.onTouched();
  }

  trackByValue(index: number, option: SelectOption): any {
    return option.value;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}