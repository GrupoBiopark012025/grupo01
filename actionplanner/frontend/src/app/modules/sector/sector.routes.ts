import { Routes } from "@angular/router";
import { SectorComponent } from "@modules/sector/sector.component";

export const SectorRoutes: Routes = [
  {
    path: '',
    component: SectorComponent,
    children: [
      {
        path: '',
        title: 'Setores - ActionPlanner',
        loadComponent: () => import('./list/sector-list.component').then((c) => c.SectorListComponent)
      },
      {
        path: 'register',
        title: 'Novo Setor - ActionPlanner',
        loadComponent: () => import('./form/sector-form.component').then((c) => c.SectorFormComponent)
      },
      {
        path: ':id/edit',
        title: 'Editar Setor - ActionPlanner',
        loadComponent: () => import('./form/sector-form.component').then((c) => c.SectorFormComponent)
      }
    ]
  }
];
