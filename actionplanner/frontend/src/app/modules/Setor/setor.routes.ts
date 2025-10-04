import { Routes } from "@angular/router";
import { SetorListComponent } from "./setor-list/setor-list.component";
import { SetorFormComponent } from "./setor-form/setor-form.component";

export const SetorRoutes: Routes = [
  {
    path: '',
    component: SetorListComponent,
    data: {
      title: 'ActionPlanner - Setores',
      description: 'Gerenciamento de setores da organização.'
    }
  },
  {
    path: 'cadastrar',
    component: SetorFormComponent,
    data: {
      title: 'ActionPlanner - Novo Setor',
      description: 'Cadastrar um novo setor.'
    }
  },
  {
    path: 'editar/:id',
    component: SetorFormComponent,
    data: {
      title: 'ActionPlanner - Editar Setor',
      description: 'Editar informações do setor.'
    }
  }
];