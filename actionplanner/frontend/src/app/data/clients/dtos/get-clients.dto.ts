export interface GetClientsDto {
  id: string
  nome: string
  cnpj?: string
  cpf?: string
  endereco: string
  email: string
  telefone: string
  setor?: {
    id: string
    nome: string
  }
  createdAt: string
}
