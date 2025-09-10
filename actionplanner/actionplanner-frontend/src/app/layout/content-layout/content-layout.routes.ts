import { Routes } from "@angular/router";

export const contentLayoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./content-layout.component').then(m => m.ContentLayoutComponent)
  }
];
