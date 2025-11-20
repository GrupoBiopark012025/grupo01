import { Routes } from "@angular/router";
import { ClientsComponent } from "@modules/clients/clients.component";

export const ClientsRoutes: Routes = [
  {
    path: '',
    component: ClientsComponent,
    children: [
      {
        path: '',
        title: 'Clientes - ActionPlanner',
        loadComponent: () => import('../clients/clients.component').then((c) => c.ClientsComponent),
      }
    ]
  }
];
