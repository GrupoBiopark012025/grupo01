import { Routes } from "@angular/router";

export const HomeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@modules/dashboard/dashboard.component').then(c => c.DashboardComponent)
  }
];
