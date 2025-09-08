export class UnexpectedFormatError extends Error {
  constructor (message?: string) {
    super(message || 'O formato do resultado retornado é inválido')
    this.name = 'UnexpectedFormatError'
  }
}
