export class ConnectionFailError extends Error {
  constructor (message?: string, name?: string) {
    super(message || 'Falha na conexão. Tente novamente mais tarde')
    this.name = name || 'ConnectionFailError'
  }
}
