import { Routes } from '@angular/router';
import { LoginComponent } from "@modules/authentication/login/login.component";
import { authenticationGuard } from "@core/guards/authentication/authentication.guard";
import { ErrorLayoutRoutes } from "@layout/error-layout/error-layout.routes";

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login - ActionPlanner',
    component: LoginComponent,
    canActivate: [authenticationGuard]
  },
  ...ErrorLayoutRoutes,
  {
    path: '',
    loadChildren: () => import('@layout/content-layout/content-layout.routes').then(m => m.contentLayoutRoutes),
    canActivate: [authenticationGuard]
  },
  {
    path: '**',
    redirectTo: 'error/not-found',
    pathMatch: 'full'
  }
];
