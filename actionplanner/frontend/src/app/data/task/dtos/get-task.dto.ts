import { TaskCommentDto } from "./task-comment.dto";
import { TaskLogDto } from "./task-log.dto";
import { TaskPriorityEnum } from "./task-priority.enum";
import { TaskStatusEnum } from "./task-status.enum";

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
  actionPlanId?: number;
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
  actionPlan?: {
    id: number;
    number: string;
    what: string;
    how: string;
    responsible: string;
    startDate: Date;
    endDate: Date;
    status: string;
    project?: {
      id: number;
      name: string;
    };
  };
  sector?: {
    id: number;
    name?: string;
    nome?: string;
    acronym?: string;
    description?: string;
    status?: string; 
    color?: string;  
    createdAt?: Date;
  };
  project?: {
    id: number;
    name?: string;
    title?: string;
    description?: string;
    actionPlanId?: number;
    status?: string; 
    createdAt?: Date;
    updatedAt?: Date;
  };

  comments?: TaskCommentDto[];
  logs?: TaskLogDto[];
}
