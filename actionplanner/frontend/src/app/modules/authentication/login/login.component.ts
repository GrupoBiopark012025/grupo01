import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ZardCardComponent } from "@shared/components/zardui/card/card.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ZardFormModule } from "@shared/components/zardui/form/form.module";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { toast } from "ngx-sonner";
import { AuthenticationService } from "@core/services/authentication/authentication.service";

@Component({
  selector: 'app-login',
  imports: [
    ZardCardComponent,
    ZardButtonComponent,
    ReactiveFormsModule,
    ZardFormModule,
    ZardInputDirective
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private _returnUrl = signal<string | undefined>(undefined);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);

  form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required])
  });

  ngOnInit() {
    this._returnUrl.set(this.route.snapshot.queryParams['returnTo']);
  }

  onSubmit() {
    if (this.form.invalid) { return }

    const { email, password } = this.form.getRawValue();

    this.authenticationService
      .login(email, password, this._returnUrl())
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          toast.success('Bem-vindo(a), usuário.')
        },
        error: (e) => {
          toast.error(e.error.message || 'Acesso temporariamente indisponível.');
        }
      })
  }

  navigateToForgotPassword(event: Event) {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }
}