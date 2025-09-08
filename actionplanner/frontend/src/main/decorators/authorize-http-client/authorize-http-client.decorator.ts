import type { GetStorage, HttpClient, HttpRequest, HttpResponse } from "@/data/protocols";
import { AUTHENTICATION_KEY_ACCESS_TOKEN } from "@/domain/usecases";

export class AuthorizeHttpClientDecorator implements HttpClient {
  private readonly getStorage: GetStorage
  private readonly httpClient: HttpClient

  constructor (
    getStorage: GetStorage,
    httpClient: HttpClient
  ) {
    this.getStorage = getStorage
    this.httpClient = httpClient
  }

  async request (data: HttpRequest): Promise<HttpResponse> {
    const accessToken = this.getStorage.get(AUTHENTICATION_KEY_ACCESS_TOKEN)
    if (accessToken?.access_token) {
      Object.assign(data, {
        headers: Object.assign(data.headers || {}, {
          Authorization: `Bearer ${(accessToken.access_token as string)}`
        })
      })
    }

    return await this.httpClient.request(data)
  }
}
