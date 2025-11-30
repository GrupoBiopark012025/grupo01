import { Routes } from '@angular/router';
import { LoginComponent } from "@modules/authentication/login/login.component";
import { ResetPasswordComponent } from "@modules/authentication/reset-password/reset-password.component";
import { ForgotPasswordComponent } from "@modules/authentication/forgot-password/forgot-password.component";
import { authenticationGuard } from "@core/guards/authentication/authentication.guard";
import { ErrorLayoutRoutes } from "@layout/error-layout/error-layout.routes";

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login - ActionPlanner',
    component: LoginComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: 'forgot-password',
    title: 'Recuperar Senha - ActionPlanner',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    title: 'Redefinir Senha - ActionPlanner',
    component: ResetPasswordComponent
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