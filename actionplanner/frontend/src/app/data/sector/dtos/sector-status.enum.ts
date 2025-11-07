export enum SectorStatusEnum {
  Ativo = 'ATIVO',
  Inativo = 'INATIVO'
}

export const descricaoSectorStatusEnum: Record<SectorStatusEnum, string> = {
  [SectorStatusEnum.Ativo]: 'Ativo',
  [SectorStatusEnum.Inativo]: 'Inativo'
};
