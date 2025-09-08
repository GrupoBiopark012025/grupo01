import { useCallback } from "react"
import { useJwtAdapterState, useLocalStorageAdapterState } from "@/presentation/components/states"
import { useNotify } from "@/presentation/hooks"

type TokenPayload = {
  sub: string
  nbf: number
  exp: number
  iss: string
}

type AuthProps = {
  isTokenValid: (notifyError?: boolean) => boolean
}

export const useAuth = (): AuthProps => {
  const notify = useNotify()
  const jwtAdapter = useJwtAdapterState((s) => s.jwtAdapter)
  const localStorageAdapter = useLocalStorageAdapterState((s) => s.localStorageAdapter)

  const onLogout = (user: string, unit: number): void => {
    // TODO: fazer logout
  }

  const isTokenValid = useCallback((notifyError: boolean = true): boolean => {
    const today = new Date()
    const expireDate = new Date(0)

    const jwtLocalObject = localStorageAdapter.get('@t_ap') // TODO: mudar para key em outro arquivo
    if (!jwtLocalObject?.access_token) {
      return false
    }

    const accessToken = jwtAdapter.decode(jwtLocalObject?.access_token) as TokenPayload

    expireDate.setUTCSeconds(accessToken.exp)
    const isExpired = today > expireDate

    if (isExpired) {
      if (notifyError) notify.error(new Error('Sessão Expirada, faça o login novamente!'))

      onLogout(accessToken.sub, jwtLocalObject?.login_unit)
      return false
    }

    return true
  }, [jwtAdapter, localStorageAdapter, notify])

  return { isTokenValid }
}