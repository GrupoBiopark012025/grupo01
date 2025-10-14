export enum UserAccessLevelEnum {
  Admin = 'ADMIN',
  Consultor = 'CONSULTOR',
  GestorCliente = 'GESTOR_CLIENTE',
  ColaboradorCliente = 'COLABORADOR_CLIENTE'
}

export const descricaoUserAccessLevelEnum: Record<UserAccessLevelEnum, string> = {
  [UserAccessLevelEnum.Admin]: 'Admin',
  [UserAccessLevelEnum.Consultor]: 'Consultor',
  [UserAccessLevelEnum.GestorCliente]: 'Gestor',
  [UserAccessLevelEnum.ColaboradorCliente]: 'Colaborador'
};

export const userAccessLevelByString: Record<string, UserAccessLevelEnum> = {
  'ADMIN': UserAccessLevelEnum.Admin,
  'CONSULTOR': UserAccessLevelEnum.Consultor,
  'GESTOR_CLIENTE': UserAccessLevelEnum.GestorCliente,
  'COLABORADOR_CLIENTE': UserAccessLevelEnum.ColaboradorCliente
};

export const userAccessLevelOptions = Object
  .entries(descricaoUserAccessLevelEnum)
  .map(([key, label]) => ({
    label: label,
    value: key as UserAccessLevelEnum
  }));
