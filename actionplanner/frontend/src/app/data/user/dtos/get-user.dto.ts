import { UserAccessLevelEnum, UserClientDto, UserStatusEnum } from "@data/user/dtos";

export interface GetUserDto {
  id: number;
  nome: string;
  email: string;
  clienteId: number;
  isAdmin: boolean;
  accessLevel: UserAccessLevelEnum;
  onlyAttachedTasks: boolean;
  status: UserStatusEnum;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  cliente: UserClientDto;
  userClientes: UserClientDto[];
}
