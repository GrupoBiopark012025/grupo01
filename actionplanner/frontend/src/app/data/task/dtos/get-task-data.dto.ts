import { TaskStatusEnum } from "./task-status.enum";
import { TaskPriorityEnum } from "./task-priority.enum";

export interface GetTaskDataDto {
  statusOptions: TaskStatusEnum[];
  priorityOptions: TaskPriorityEnum[];
  projectOptions: {
    id: number;
    title: string;
  }[];
  clienteOptions: {
    id: number;
    nome: string;
  }[];
  sectorOptions: {
    id: number;
    nome: string;
  }[];
  userOptions: {
    id: number;
    nome: string;
  }[];
}