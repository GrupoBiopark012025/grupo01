export interface GetActionPlanDto {
  id: number;
  number: string;
  what: string;
  how: string;
  responsible: string;
  startDate: string;
  endDate: string;
  postponedDate: string | null;
  status: ActionPlanStatusEnum | string;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
  projects: ActionPlanProjectDto[];
  tasks: ActionPlanTaskDto[];
  totalTasks: number;
  completedTasks: number;
  progress: number;
}

export interface ActionPlanProjectDto {
  id: number;
  name: string;
  description: string;
  actionPlanId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionPlanTaskDto {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: number;
  actionPlanId: number;
  clienteId: number;
  sectorId: number;
  createdAt: string;
  updatedAt: string;
  userResponsibleId: number;
  userCreatedId: number;
  cliente: ActionPlanClienteDto;
  sector: ActionPlanSectorDto;
  userResponsible: ActionPlanUserDto;
  userCreated: ActionPlanUserDto;
}

export interface ActionPlanClienteDto {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionPlanSectorDto {
  id: number;
  name: string;
  acronym: string;
  description: string;
  status: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionPlanUserDto {
  id: number;
  nome: string;
  email: string;
  clienteId: number;
  isAdmin: boolean;
  accessLevel: string;
  onlyAttachedTasks: boolean;
  status: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export enum ActionPlanStatusEnum {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
  ADIADO = 'ADIADO'
}

export const descricaoActionPlanStatusEnum: Record<ActionPlanStatusEnum, string> = {
  [ActionPlanStatusEnum.PENDENTE]: 'Pendente',
  [ActionPlanStatusEnum.EM_ANDAMENTO]: 'Em Andamento',
  [ActionPlanStatusEnum.CONCLUIDO]: 'Concluído',
  [ActionPlanStatusEnum.CANCELADO]: 'Cancelado',
  [ActionPlanStatusEnum.ADIADO]: 'Adiado'
};

