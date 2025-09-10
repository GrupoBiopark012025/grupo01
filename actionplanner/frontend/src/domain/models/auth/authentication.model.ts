import type { AuthenticationUserModel } from "@/domain/models/auth";

export interface AuthenticationModel {
  token: string
  user: AuthenticationUserModel
}
