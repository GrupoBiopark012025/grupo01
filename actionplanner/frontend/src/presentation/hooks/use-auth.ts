import { useCallback } from "react"
import { useJwtAdapterState, useLocalStorageAdapterState } from "@/presentation/stores"
import { useNotify } from "@/presentation/hooks"
import { AUTHENTICATION_KEY_ACCESS_TOKEN } from "@/domain/usecases";

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

  const isTokenValid = useCallback((notifyError: boolean = true): boolean => {
    const today = new Date()
    const expireDate = new Date(0)

    const jwtLocalObject = localStorageAdapter.get(AUTHENTICATION_KEY_ACCESS_TOKEN)
    if (!jwtLocalObject?.token) {
      return false
    }

    const accessToken = jwtAdapter.decode(jwtLocalObject?.token) as TokenPayload

    expireDate.setUTCSeconds(accessToken.exp)
    const isExpired = today > expireDate

    if (isExpired) {
      if (notifyError) notify.error('Sessão Expirada, faça o login novamente!')
      localStorageAdapter.set(AUTHENTICATION_KEY_ACCESS_TOKEN, undefined)
      return false
    }

    return true
  }, [jwtAdapter, localStorageAdapter, notify])

  return { isTokenValid }
}
