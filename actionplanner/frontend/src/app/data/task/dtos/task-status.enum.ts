export enum TaskStatusEnum {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export const descricaoTaskStatusEnum: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.PENDENTE]: 'Pendente',
  [TaskStatusEnum.EM_ANDAMENTO]: 'Em Andamento',
  [TaskStatusEnum.CONCLUIDA]: 'Concluída',
  [TaskStatusEnum.CANCELADA]: 'Cancelada'
};