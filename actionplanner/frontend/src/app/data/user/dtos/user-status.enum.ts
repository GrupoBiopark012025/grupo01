export enum UserStatusEnum {
  Ativo = 'ATIVO',
  Inativo = 'INATIVO',
}

export const descricaoUserStatusEnum: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Ativo]: 'Ativo',
  [UserStatusEnum.Inativo]: 'Inativo'
};
