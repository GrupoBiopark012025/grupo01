import { TaskStatusEnum } from "./task-status.enum";
import { TaskPriorityEnum } from "./task-priority.enum";

export interface GetTaskDto {
  id: number;
  title: string;
  description?: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  projectId?: number;
  clienteId?: number;
  sectorId?: number;
  userResponsibleId?: number;
  userCreatedId: number;
  userResponsible?: {
    id: number;
    nome: string;
    email?: string;
  };
  userCreated?: {
    id: number;
    nome: string;
    email?: string;
  };
  cliente?: {
    id: number;
    nome: string;
  };
  sector?: {
    id: number;
    name?: string;
    nome?: string;
  };
  project?: {
    id: number;
    name?: string;
    title?: string;
  };
}
