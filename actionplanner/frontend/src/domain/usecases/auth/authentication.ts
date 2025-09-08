export interface Authentication {
  auth: (params: AuthenticationParams) => Promise<void>
}

export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationResult = {
  token: string
}

export const AUTHENTICATION_KEY_ACCESS_TOKEN = '@t_ap'
