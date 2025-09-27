export interface Setor {
  id: number;
  nome: string;
  sigla: string;
  descricao: string;
  status: 'ATIVO' | 'INATIVO';
  cor: string;
}