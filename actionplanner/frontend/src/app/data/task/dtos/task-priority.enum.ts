export enum TaskPriorityEnum {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

export const descricaoTaskPriorityEnum: Record<TaskPriorityEnum, string> = {
  [TaskPriorityEnum.BAIXA]: 'Baixa',
  [TaskPriorityEnum.MEDIA]: 'Média',
  [TaskPriorityEnum.ALTA]: 'Alta',
  [TaskPriorityEnum.URGENTE]: 'Urgente'
};
