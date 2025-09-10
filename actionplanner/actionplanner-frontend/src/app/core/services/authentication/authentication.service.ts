import { inject, Injectable } from '@angular/core';
import { AuthenticationDataService } from "@data/authentication/authentication-data.service";
import { map } from "rxjs";
import { LocalStorageService } from "@core/services/local-storage/local-storage.service";
import { JwtService } from "@core/services/jwt/jwt.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { WINDOW } from "@core/injection-tokens/injection-tokens";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly window = inject(WINDOW);
  private readonly router = inject(Router);
  private readonly authenticationService = inject(AuthenticationDataService);
  private readonly jwtService = inject(JwtService);
  private readonly jwtHelperService = inject(JwtHelperService);
  private readonly localStorageService = inject(LocalStorageService);

  login(
    email: string,
    password: string,
    returnUrl?: string
  ) {
    return this.authenticationService
      .login({ email, password })
      .pipe(
        map((response) => {
          if (!response.token) {
            return '';
          }

          const { token } = response;
          this.registraNovoToken(token);
          this.navigateAfterLogin();
          return token;
        })
      )
  }

  logout(redirect?: boolean) {
    this.jwtService.destroyToken();
    this.localStorageService.clear();

    if (!redirect) { return; }

    this.window.location.href = '/login'; // TODO: validar
  }

  isLoggedIn(): boolean {
    return this.jwtService.getToken() != null;
  }

  isTokenExpired(): Promise<boolean> {
    return Promise.resolve(this.jwtHelperService.isTokenExpired());
  }

  private navigateAfterLogin(returnUrl?: string): void {
    this.router.navigate([returnUrl ?? '']);
  }

  private registraNovoToken(newToken: string): void {
    this.jwtService.saveToken(newToken);
  }
}
