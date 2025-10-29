import { PaginationQuery } from "@data/common/dtos";
import { TaskStatusEnum } from "./task-status.enum";
import { TaskPriorityEnum } from "./task-priority.enum";

export class GetTaskQuery extends PaginationQuery {
  title?: string;
  status?: TaskStatusEnum;
  priority?: TaskPriorityEnum;
  dueDate?: string;
  projectId?: number;
  clienteId?: number;
  sectorId?: number;
  userResponsibleId?: number;
  userCreatedId?: number;
}