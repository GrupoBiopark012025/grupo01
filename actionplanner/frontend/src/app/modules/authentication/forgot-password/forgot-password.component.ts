import { Component, inject, signal } from '@angular/core';
import { ZardCardComponent } from "@shared/components/zardui/card/card.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ZardFormModule } from "@shared/components/zardui/form/form.module";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { Router } from "@angular/router";
import { toast } from "ngx-sonner";
import { AuthenticationDataService } from "@data/authentication/authentication-data.service";
import { take } from "rxjs";

@Component({
  selector: 'app-forgot-password',
  imports: [
    ZardCardComponent,
    ZardButtonComponent,
    ReactiveFormsModule,
    ZardFormModule,
    ZardInputDirective
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authDataService = inject(AuthenticationDataService);

  enviando = signal(false);
  emailEnviado = signal(false);

  form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email])
  });

  onSubmit() {
    if (this.form.invalid) { return }

    this.enviando.set(true);

    const { email } = this.form.getRawValue();

    this.authDataService
      .requestPasswordReset({ email })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.emailEnviado.set(true);
          this.enviando.set(false);
        },
        error: () => {
          toast.error('Erro ao enviar email de recuperação.');
          this.enviando.set(false);
        }
      });
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }
}