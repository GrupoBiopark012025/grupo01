export interface DashboardDistribuicaoStatus {
  key: string
  label: string
  count: number
}

export interface DashboardDistribuicaoProjetos {
  key: number
  name: string
  count: number
}

export interface DashboardDistribuicaoSetores {
  key: number
  name: string
  count: number
}

export interface DashboardDto {
  prorrogadasMes: number
  concluidas: number
  pendentes: number
  atrasadas: number
  paralisadas: number
  proximasVencimento: number
  tempoMedio: number | null
  distribuicaoStatus: DashboardDistribuicaoStatus[]
  distribuicaoProjetos: DashboardDistribuicaoProjetos[]
  distribuicaoSetores: DashboardDistribuicaoSetores[]
}
