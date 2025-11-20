export interface GetTaskDto {
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
  project: TaskProjectDto;
  cliente: TaskClienteDto;
  sector: TaskSectorDto;
  userResponsible: TaskUserDto;
  userCreated: TaskUserDto;
}

export interface TaskProjectDto {
  id: number;
  name: string;
  description: string;
  actionPlanId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskClienteDto {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSectorDto {
  id: number;
  name: string;
  acronym: string;
  description: string;
  status: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskUserDto {
  id: number;
  nome: string;
  email: string;
  password: string;
  clienteId: number;
  isAdmin: boolean;
  accessLevel: string;
  onlyAttachedTasks: boolean;
  status: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

