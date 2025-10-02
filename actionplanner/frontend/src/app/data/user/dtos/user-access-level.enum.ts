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
