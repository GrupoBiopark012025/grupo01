import type { HttpClient } from "@/data/protocols";
import { AuthorizeHttpClientDecorator } from "@/main/decorators";
import { makeHttpClientAdapter, makeLocalStorageAdapter } from "@/main/factories";

export const makeAuthorizeHttpClientDecorator = (): HttpClient => {
  return new AuthorizeHttpClientDecorator(makeLocalStorageAdapter(), makeHttpClientAdapter())
}
