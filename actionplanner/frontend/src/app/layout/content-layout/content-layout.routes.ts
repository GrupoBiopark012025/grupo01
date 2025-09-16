import { Routes } from "@angular/router";
import { authenticationGuard } from "@core/guards/authentication/authentication.guard";

export const contentLayoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./content-layout.component').then(m => m.ContentLayoutComponent),
    canActivate: [authenticationGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('@modules/home/home.routes').then(m => m.HomeRoutes),
        data: {
          title: 'ActionPlanner - Página Inicial',
          description: 'Página inicial da aplicação.'
        },
        canActivate: [authenticationGuard]
      }
    ]
  }
];
