export interface Setor {
  id: number;
  name: string;
  acronym: string;
  description: string;
  status: 'ativo' | 'inativo';
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface SetorApiResponse {
  sectors: Setor[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  size: number;
}