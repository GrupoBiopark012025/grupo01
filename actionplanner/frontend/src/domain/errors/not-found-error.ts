export class NotFountError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'NotFountError'
  }
}
