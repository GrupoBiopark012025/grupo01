import { PaginationQuery } from "@data/common/dtos";
import { UserAccessLevelEnum, UserStatusEnum } from "@data/user/dtos";

export class GetUserQuery extends PaginationQuery {
  clienteId?: number;
  nome?: string;
  email?: string;
  status?: UserStatusEnum;
  accessLevel?: UserAccessLevelEnum;
}
