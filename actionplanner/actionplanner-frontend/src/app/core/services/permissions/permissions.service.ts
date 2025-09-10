import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "@core/services/authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private readonly loginRoute = '/login';

  private router = inject(Router);
  private authService = inject(AuthenticationService);

  podeNavegar(state: RouterStateSnapshot): boolean {
    const isLoginPage = state.url.startsWith(this.loginRoute);
    const isUsuarioLogado = this.authService.isLoggedIn();

    if (isUsuarioLogado && isLoginPage) {
      this.router.navigate(['']);
      return false;
    }

    if (isLoginPage || isUsuarioLogado) {
      return true;
    }

    let extras: NavigationExtras;
    if (state.url) {
      extras = { queryParams: { returnTo: state.url }};
    } else {
      extras = {};
    }

    this.router.navigate([this.loginRoute], extras);
    return false;
  }
}
