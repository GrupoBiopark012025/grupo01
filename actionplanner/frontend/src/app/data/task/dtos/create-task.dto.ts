import { TaskStatusEnum } from "./task-status.enum";
import { TaskPriorityEnum } from "./task-priority.enum";

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  dueDate?: Date;
  projectId?: number;
  clienteId?: number;
  sectorId?: number;
  userResponsibleId?: number;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}