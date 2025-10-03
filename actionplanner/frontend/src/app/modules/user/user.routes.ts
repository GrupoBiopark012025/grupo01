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
        loadComponent: () => import('./list/user-list.component').then((c) => c.UserListComponent),
      }
    ]
  }
];
