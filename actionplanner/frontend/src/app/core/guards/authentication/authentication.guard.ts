import { CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { PermissionsService } from "@core/services/permissions/permissions.service";
import { of } from "rxjs";

export const authenticationGuard: CanActivateFn = (route, state) => {
  // Recusa navegação caso usuário não acesso à página.
  if (!inject(PermissionsService).podeNavegar(state)){
    return of(false);
  }

  // Deixa carregar o layout principal primeiro (para não deixar uma página branca).
  const isLayoutRoute = route.routeConfig?.path === '';
  if (isLayoutRoute){
    return of(true);
  }

  return of(true);
};
