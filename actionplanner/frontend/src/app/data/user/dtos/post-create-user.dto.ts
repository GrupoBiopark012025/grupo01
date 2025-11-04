import { UserAccessLevelEnum, UserStatusEnum } from "@data/user/dtos";

export interface PostCreateUserDto {
  nome: string,
  email: string,
  password: string,
  clienteId: number, // TODO: mexer para aplicar undefined
  accessLevel: UserAccessLevelEnum,
  isAdmin: boolean,
  onlyAttachedTasks: boolean,
  status: UserStatusEnum,
  userClienteIds: number[],
  userSectorIds: number[]
}
