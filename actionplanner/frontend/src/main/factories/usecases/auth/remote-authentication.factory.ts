import type { Authentication } from "@/domain/usecases";
import { makeApiUrl, makeAuthorizeHttpClientDecorator, makeLocalStorageAdapter } from "@/main/factories";
import { RemoteAuthentication } from "@/data/usecases/auth/remote-authentication.ts";

export const makeRemoteAuthentication = (): Authentication => {
  const apiUrl = makeApiUrl()
  const httpClient = makeAuthorizeHttpClientDecorator()
  const localStorageAdapter = makeLocalStorageAdapter()

  return new RemoteAuthentication(apiUrl, httpClient, localStorageAdapter)
}
