export interface GetClientsDto {
  id: number
  nome: string
  cnpj?: string
  cpf?: string
  endereco: string
  email: string
  telefone: string
  setor?: {
    id: number
    nome: string
  }
  createdAt: string
}
