import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { userAccessLevelByString, UserAccessLevelEnum, userAccessLevelOptions, UserStatusEnum } from "@data/user/dtos";
import { UserDataService } from "@data/user/user-data.service";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ValidationService } from "@shared/services/validation/validation.service";
import { Router } from "@angular/router";
import { toast } from "ngx-sonner";
import { PageHeaderComponent } from "@shared/components/base/page-header/page-header.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { BackOrNavigateToDirective } from "@shared/directives/back-or-navigate-to/back-or-navigate-to.directive";
import { TextInputComponent } from "@shared/components/base/form-components/text-input/text-input.component";
import { CheckboxComponent } from "@shared/components/base/form-components/checkbox/checkbox.component";
import { SelectComponent } from "@shared/components/base/form-components/select/select.component";

@Component({
  selector: 'app-user-registrer',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ZardButtonComponent,
    BackOrNavigateToDirective,
    TextInputComponent,
    CheckboxComponent,
    SelectComponent
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

  onAccessLevelChange(value: string) {
    const accessLevel = userAccessLevelByString[value];

    this._accessLevel.set(accessLevel);
  }

  protected readonly UserAccessLevelEnum = UserAccessLevelEnum;
  protected readonly userAccessLevelOptions = userAccessLevelOptions;
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
