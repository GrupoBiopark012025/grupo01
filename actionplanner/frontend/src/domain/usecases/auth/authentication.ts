import type { AuthenticationModel } from "@/domain/models/auth";

export interface Authentication {
  auth: (params: AuthenticationParams) => Promise<AuthenticationResult>
}

export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationResult = AuthenticationModel

export const AUTHENTICATION_KEY_ACCESS_TOKEN = '@t_ap'
