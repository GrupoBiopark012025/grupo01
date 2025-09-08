export class InvalidCredentialsError extends Error {
  constructor (message?: string) {
    super(message || 'Credenciais inválidas')
    this.name = 'InvalidCredentialsError'
  }
}
