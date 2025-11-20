import { ActionPlanStatusEnum } from "./get-action-plan.dto";

export interface CreateActionPlanDto {
  number: string;
  what: string;
  how: string;
  responsible: string;
  startDate: string;      // ISO string (ex: 2025-01-15T00:00:00.000Z)
  endDate: string;        // ISO string (ex: 2025-03-15T23:59:59.000Z)
  postponedDate: string | null;
  status: ActionPlanStatusEnum | string;
  observations: string | null;
  projectIds: number[];
}


