import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { userAccessLevelByString, UserAccessLevelEnum, UserStatusEnum } from "@data/user/dtos";
import { UserDataService } from "@data/user/user-data.service";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ValidationService } from "@shared/services/validation/validation.service";
import { Router } from "@angular/router";
import { toast } from "ngx-sonner";
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from "@shared/components/zardui/form/form.component";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { PageHeaderComponent } from "@shared/components/base/page-header/page-header.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { BackOrNavigateToDirective } from "@shared/directives/back-or-navigate-to/back-or-navigate-to.directive";
import { ZardSelectComponent } from "@shared/components/zardui/select/select.component";
import { ZardSelectItemComponent } from "@shared/components/zardui/select/select-item.component";
import { ZardCheckboxComponent } from "@shared/components/zardui/checkbox/checkbox.component";

@Component({
  selector: 'app-user-registrer',
  imports: [
    ReactiveFormsModule,
    ZardFormFieldComponent,
    ZardFormControlComponent,
    ZardFormLabelComponent,
    ZardInputDirective,
    PageHeaderComponent,
    ZardButtonComponent,
    BackOrNavigateToDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardCheckboxComponent
  ],
  templateUrl: './user-registrer.component.html'
})
export class UserRegistrerComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly userDataService = inject(UserDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly validationService = inject(ValidationService);

  private _accessLevel = signal<UserAccessLevelEnum | null>(null);
  accessLevel = this._accessLevel.asReadonly();

  form = this.fb.nonNullable.group<FormData>({
    nome: this.fb.nonNullable.control<string>('', [Validators.required]),
    email: this.fb.nonNullable.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control<string>('', [Validators.required]),
    clienteId: this.fb.control<number | null>(null, [Validators.required]),
    accessLevel: this.fb.control<UserAccessLevelEnum | null>(null, [Validators.required]),
    isAdmin: this.fb.nonNullable.control<boolean>(false, [Validators.required]),
    onlyAttachedTasks: this.fb.nonNullable.control<boolean>(false, [Validators.required]),
    status: this.fb.nonNullable.control<UserStatusEnum>(UserStatusEnum.Ativo, [Validators.required])
  });

  isAdminBehindTheScenes = computed(() => {
    const accessLevel = this._accessLevel();
    return accessLevel ? ![UserAccessLevelEnum.ColaboradorCliente].includes(accessLevel) : false;
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const form = this.form.getRawValue();

    this.userDataService.createUser({
      ...form,
      clienteId: form.clienteId!,
      accessLevel: form.accessLevel!,
    })
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/users']);
          toast.success("Usuário registrado com sucesso!");
        },
        error: (e) => this.validationService.handleServerValidation(e)
      });
  }

  isFieldInvalid(fieldName: keyof FormData): boolean {
    const field = this.form.controls[fieldName];
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getEmailError(): string {
    const email = this.form.get('email');
    if (email?.hasError('required')) {
      return 'Email é obrigatório';
    }
    if (email?.hasError('email')) {
      return 'Por favor, insira um email válido';
    }
    return '';
  }

  onAccessLevelChange(value: string) {
    const accessLevel = userAccessLevelByString[value];

    this._accessLevel.set(accessLevel);
  }

  protected readonly UserAccessLevelEnum = UserAccessLevelEnum;
}

interface FormData {
  nome: FormControl<string>,
  email: FormControl<string>,
  password: FormControl<string>,
  clienteId: FormControl<number | null>,
  accessLevel: FormControl<UserAccessLevelEnum | null>,
  isAdmin: FormControl<boolean>,
  onlyAttachedTasks: FormControl<boolean>,
  status: FormControl<UserStatusEnum>
}
