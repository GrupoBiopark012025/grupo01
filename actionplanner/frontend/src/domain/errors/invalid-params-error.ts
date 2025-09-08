export class InvalidParamsError extends Error {
  constructor (message?: string) {
    super(message || 'Parâmetros inválidos')
    this.name = 'InvalidParamsError'
  }
}
