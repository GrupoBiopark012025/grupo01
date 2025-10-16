import { UserAccessLevelEnum } from "@data/user/dtos/user-access-level.enum";
import { UserStatusEnum } from "@data/user/dtos/user-status.enum";
import { UserClient } from "@data/user/dtos/get-user.dto";

export interface GetUserDataDto {
  id: number;
  nome: string;
  email: string;
  clienteId: number;
  isAdmin: boolean;
  accessLevel: UserAccessLevelEnum;
  onlyAttachedTasks: boolean;
  status: UserStatusEnum;
  userCliente: UserClient;
}
