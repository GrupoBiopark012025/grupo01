import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ZardCardComponent } from "@shared/components/zardui/card/card.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ZardFormModule } from "@shared/components/zardui/form/form.module";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { AuthenticationDataService } from "@data/authentication/authentication-data.service";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { toast } from "ngx-sonner";

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
  private _returnUrl = signal<string | null>(null);

  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly authenticationDataService = inject(AuthenticationDataService);
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

    this.authenticationDataService
      .login(this.form.getRawValue())
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        error: (e) => {
          toast.error(e.error.message || 'Acesso temporariamente indisponível.');
        }
      })
  }
}
