import { Component, inject, OnInit, signal } from '@angular/core';
import { ZardCardComponent } from "@shared/components/zardui/card/card.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { ZardFormModule } from "@shared/components/zardui/form/form.module";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { ActivatedRoute, Router } from "@angular/router";
import { toast } from "ngx-sonner";
import { AuthenticationDataService } from "@data/authentication/authentication-data.service";
import { take } from "rxjs";

@Component({
  selector: 'app-reset-password',
  imports: [
    ZardCardComponent,
    ZardButtonComponent,
    ReactiveFormsModule,
    ZardFormModule,
    ZardInputDirective
  ],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly authDataService = inject(AuthenticationDataService);

  validandoToken = signal(true);
  tokenInvalido = signal(false);
  redefinindo = signal(false);
  senhaRedefinida = signal(false);

  private token: string | null = null;

  form = this.fb.nonNullable.group({
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: this.fb.nonNullable.control('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.token) {
      this.tokenInvalido.set(true);
      this.validandoToken.set(false);
      return;
    }

    this.authDataService
      .validateResetToken(this.token)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.validandoToken.set(false);
        },
        error: () => {
          this.tokenInvalido.set(true);
          this.validandoToken.set(false);
        }
      });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid || !this.token) { return }

    this.redefinindo.set(true);

    const { password } = this.form.getRawValue();

    this.authDataService
      .resetPassword({ token: this.token, newPassword: password })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.senhaRedefinida.set(true);
          this.redefinindo.set(false);
        },
        error: (err) => {
          toast.error(err.error?.error || 'Erro ao redefinir senha.');
          this.redefinindo.set(false);
        }
      });
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }
}