import { GetActionPlanDto } from "./get-action-plan.dto";

export interface GetActionPlanResponseDto {
  actionPlans: GetActionPlanDto[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

