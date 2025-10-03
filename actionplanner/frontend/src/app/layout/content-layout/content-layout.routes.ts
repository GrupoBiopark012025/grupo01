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
        title: 'Página Inicial - ActionPlanner',
        data: {
          description: 'Página inicial da aplicação.'
        },
        loadChildren: () => import('@modules/home/home.routes').then(m => m.HomeRoutes),
        canActivate: [authenticationGuard]
      },
      {
        path: 'users',
        title: 'Usuários - ActionPlanner',
        data: {
          description: 'Gestão dos Usuários registrados.'
        },
        loadChildren: () => import('@modules/user/user.routes').then(m => m.UserRoutes),
        canActivate: [authenticationGuard]
      }
    ]
  }
];
