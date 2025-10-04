import { Routes } from "@angular/router";
import { NotFoundComponent } from "@layout/error-layout/not-found/not-found.component";
import { ForbiddenComponent } from "@layout/error-layout/forbidden/forbidden.component";
import { SemConexaoComponent } from "@layout/error-layout/sem-conexao/sem-conexao.component";

export const ErrorLayoutRoutes: Routes = [
  {
    path: 'error/not-found',
    title: 'Página não encontrada - Action Planner',
    component: NotFoundComponent
  },
  {
    path: 'error/forbidden',
    title: 'Acesso negado - Action Planner',
    component: ForbiddenComponent
  },
  {
    path: 'error/no-connection',
    title: 'Falha ao conectar - Action Planner',
    component: SemConexaoComponent
  }
];
