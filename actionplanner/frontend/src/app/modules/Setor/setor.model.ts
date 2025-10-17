export interface Setor {
  id: number;
  name: string;
  acronym: string;
  description: string;
  status: 'ativo' | 'inativo';
  color: string;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: string; // Campo adicional para compatibilidade
}

export interface SetorApiResponse {
  data: Setor[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  size: number;
  page: number;
}