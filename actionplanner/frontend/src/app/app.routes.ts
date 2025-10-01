import { Routes } from '@angular/router';
import { LoginComponent } from "@modules/authentication/login/login.component";
import { HomeComponent } from "@modules/home/home/home.component";
import { authenticationGuard } from "@core/guards/authentication/authentication.guard";

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login - ActionPlanner',
    component: LoginComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: '',
    loadChildren: () => import('@layout/content-layout/content-layout.routes').then(m => m.contentLayoutRoutes),
    canActivate: [authenticationGuard]
  }
];
