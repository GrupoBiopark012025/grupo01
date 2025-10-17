import { UserAccessLevelEnum, UserClientDto, UserStatusEnum } from "@data/user/dtos";

export interface GetUserDataDto {
  id: number;
  nome: string;
  email: string;
  clienteId: number;
  isAdmin: boolean;
  accessLevel: UserAccessLevelEnum;
  onlyAttachedTasks: boolean;
  status: UserStatusEnum;
  cliente: UserClientDto;
}
