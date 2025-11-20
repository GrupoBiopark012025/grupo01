import { Routes } from "@angular/router";
import { ActionPlanComponent } from "@modules/action-plan/action-plan.component";

export const ActionPlanRoutes: Routes = [
  {
    path: '',
    component: ActionPlanComponent,
    children: [
      {
        path: '',
        title: 'Meus Planos - ActionPlanner',
        loadComponent: () => import('./list/action-plan-list.component').then((c) => c.ActionPlanListComponent),
      },
      {
        path: 'create',
        title: 'Criar Plano - ActionPlanner',
        loadComponent: () => import('./create/action-plan-create.component').then((c) => c.ActionPlanCreateComponent),
      },
      {
        path: 'tasks/:id',
        title: 'Ver Tarefa - ActionPlanner',
        loadComponent: () => import('./task-view/task-view.component').then((c) => c.TaskViewComponent),
      },
      {
        path: ':id',
        title: 'Ver Plano de Ação - ActionPlanner',
        loadComponent: () => import('./view/action-plan-view.component').then((c) => c.ActionPlanViewComponent),
      }
    ]
  }
];

