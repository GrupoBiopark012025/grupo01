import { CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { AuthenticationService } from "@core/services/authentication/authentication.service";

export const authenticationGuard: CanActivateFn = (route, state) => {
  return inject(AuthenticationService).isLoggedIn();
};
