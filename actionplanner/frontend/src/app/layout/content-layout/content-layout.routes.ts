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
          title: 'Página Inicial - ActionPlanner',
          description: 'Página inicial da aplicação.'
        },
        canActivate: [authenticationGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('@modules/user/user.routes').then(m => m.UserRoutes),
        data: {
          title: 'Usuários - ActionPlanner',
          description: 'Gestão dos Usuários registrados.'
        },
        canActivate: [authenticationGuard]
      }
    ]
  }
];
