import { Routes } from "@angular/router";
import { UserComponent } from "@modules/user/user.component";

export const UserRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        title: 'Usuários - ActionPlanner',
        loadComponent: () => import('./list/user-list.component').then((c) => c.UserListComponent)
      },
      {
        path: 'register',
        title: 'Novo Usuário - ActionPlanner',
        loadComponent: () => import('./form/user-form.component').then((c) => c.UserFormComponent)
      },
      {
        path: ':id/edit',
        title: 'Editar Usuário - ActionPlanner',
        loadComponent: () => import('./form/user-form.component').then((c) => c.UserFormComponent)
      }
    ]
  }
];
