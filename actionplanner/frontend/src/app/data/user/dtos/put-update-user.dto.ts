import { UserAccessLevelEnum } from "@data/user/dtos/user-access-level.enum";
import { UserStatusEnum } from "@data/user/dtos/user-status.enum";

export interface PutUpdateUserDto {
  nome: string,
  email: string,
  password?: string,
  clienteId: number, // TODO: mexer para aplicar undefined
  accessLevel: UserAccessLevelEnum,
  isAdmin: boolean,
  onlyAttachedTasks: boolean,
  status: UserStatusEnum,
  userClienteIds: number[],
  userSectorIds: number[]
}