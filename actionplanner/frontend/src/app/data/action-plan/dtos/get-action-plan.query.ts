import { PaginationQuery } from "@data/common/dtos";

export class GetActionPlanQuery extends PaginationQuery {
  titulo?: string;
  projectId?: number;
  number?: string;
  what?: string;
  how?: string;
  responsible?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

