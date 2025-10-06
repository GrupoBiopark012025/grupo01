import { UserAccessLevelEnum, UserStatusEnum } from "@data/user/dtos";

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
  cliente: UserClient;
  userClientes: any[];
}

export interface UserClient {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
}
