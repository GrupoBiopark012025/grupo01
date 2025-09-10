import type { AuthenticationClientModel } from "@/domain/models/auth";

export interface AuthenticationUserModel {
  id: number
  nome: string
  email: string
  clienteId: number
  isAdmin: boolean
  accessLevel: string
  onlyAttachedTasks: boolean
  status: string
  lastLogin: string
  createdAt: string
  updatedAt: string
  cliente: AuthenticationClientModel
  userClientes: any[]
  clientes: any[]
}
