export enum SectorStatusEnum {
  Ativo = 'ativo',
  Inativo = 'inativo'
}

export const descricaoSectorStatusEnum: Record<SectorStatusEnum, string> = {
  [SectorStatusEnum.Ativo]: 'Ativo',
  [SectorStatusEnum.Inativo]: 'Inativo'
};
