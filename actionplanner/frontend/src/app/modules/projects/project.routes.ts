import { Routes } from '@angular/router';

export const ProjectRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/project-list.component').then(m => m.ProjectListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./create/project-create.component').then(m => m.ProjectCreateComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./edit/project-edit.component').then(m => m.ProjectEditComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./view/project-view.component').then(m => m.ProjectViewComponent)
  }
];