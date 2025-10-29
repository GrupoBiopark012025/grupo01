import { Routes } from "@angular/router";
import { TasksComponent } from "@modules/tasks/tasks.component";

export const TasksRoutes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      {
        path: '',
        title: 'Tarefas - ActionPlanner',
        loadComponent: () => import('./list/task-list.component').then((c) => c.TaskListComponent),
      }
      /*
      {
        path: ':id',
        title: 'Detalhes da Tarefa - ActionPlanner',
        loadComponent: () => import('./detail/task-detail.component').then((c) => c.TaskDetailComponent),
      },
      {
        path: 'edit/:id',
        title: 'Editar Tarefa - ActionPlanner',
        loadComponent: () => import('./form/task-form.component').then((c) => c.TaskFormComponent),
      }
      */
    ]
  }
];