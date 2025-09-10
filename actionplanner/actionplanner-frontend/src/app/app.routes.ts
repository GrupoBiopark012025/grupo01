import { Routes } from '@angular/router';
import { LoginComponent } from "@modules/authentication/login/login.component";

export const routes: Routes = [
  {
    path: '',
    title: 'ActionPlanner - Login',
    component: LoginComponent
  }
];
