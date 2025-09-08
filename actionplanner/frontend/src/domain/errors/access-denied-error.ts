export class AccessDeniedError extends Error {
  constructor (message?: string) {
    super(message || 'Acesso negado, faça o login novamente!')
    this.name = 'AccessDeniedError'
  }
}
