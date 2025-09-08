import {
  type Authentication,
  AUTHENTICATION_KEY_ACCESS_TOKEN,
  type AuthenticationParams,
  type AuthenticationResult
} from "@/domain/usecases";
import { type HttpClient, HttpStatusCode, type SetStorage } from "@/data/protocols";
import { ConnectionFailError, InvalidCredentialsError, UnexpectedError } from "@/domain/errors";

export class RemoteAuthentication implements Authentication {
  private readonly url: string
  private readonly httpClient: HttpClient<AuthenticationResult>
  private readonly setStorage: SetStorage

  constructor(
    url: string,
    httpClient: HttpClient<AuthenticationResult>,
    setStorage: SetStorage,
  ) {
    this.url = url
    this.httpClient = httpClient
    this.setStorage = setStorage
  }

  async auth (params: AuthenticationParams): Promise<void> {
    const { statusCode, body } = await this.httpClient.request({
      url: `${this.url}/auth/login`,
      method: 'post',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    })

    switch (statusCode) {
      case HttpStatusCode.ok:
        if (!body?.token) {
          throw new InvalidCredentialsError()
        }

        this.setStorage.set(AUTHENTICATION_KEY_ACCESS_TOKEN, { token: body.token })

        return
      case HttpStatusCode.badRequest:
        throw new InvalidCredentialsError('Dados inválidos')
      case HttpStatusCode.timeout:
      case HttpStatusCode.serverError:
        throw new ConnectionFailError('Não foi possível se conectar ao servidor')
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError('Credenciais inválidas ou usuário inativo')
      default: throw new UnexpectedError()
    }
  }
}