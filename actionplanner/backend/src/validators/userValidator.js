import yup from "yup";

export const createUserValidator = yup
  .object()
  .shape({
    nome: yup
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(255, "Nome deve ter no máximo 255 caracteres")
      .required("Nome é obrigatório"),
    email: yup
      .string()
      .email("Email inválido")
      .max(255, "Email deve ter no máximo 255 caracteres")
      .required("Email é obrigatório"),
    password: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .required("Senha é obrigatória"),
    clienteId: yup
      .number()
      .integer("Cliente ID deve ser um número inteiro")
      .positive("Cliente ID deve ser positivo")
      .required("Cliente ID é obrigatório"),
    accessLevel: yup
      .string()
      .oneOf(
        ['ADMIN', 'CONSULTOR', 'GESTOR_CLIENTE', 'COLABORADOR_CLIENTE'],
        "Nível de acesso inválido"
      )
      .required("Nível de acesso é obrigatório"),
    isAdmin: yup
      .boolean()
      .default(false),
    onlyAttachedTasks: yup
      .boolean()
      .default(false),
    status: yup
      .string()
      .oneOf(['ATIVO', 'INATIVO'], "Status inválido")
      .default('ATIVO')
  });

export const updateUserValidator = yup
  .object()
  .shape({
    nome: yup
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(255, "Nome deve ter no máximo 255 caracteres"),
    email: yup
      .string()
      .email("Email inválido")
      .max(255, "Email deve ter no máximo 255 caracteres"),
    password: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres"),
    clienteId: yup
      .number()
      .integer("Cliente ID deve ser um número inteiro")
      .positive("Cliente ID deve ser positivo"),
    accessLevel: yup
      .string()
      .oneOf(
        ['ADMIN', 'CONSULTOR', 'GESTOR_CLIENTE', 'COLABORADOR_CLIENTE'],
        "Nível de acesso inválido"
      ),
    isAdmin: yup
      .boolean(),
    onlyAttachedTasks: yup
      .boolean(),
    status: yup
      .string()
      .oneOf(['ATIVO', 'INATIVO'], "Status inválido")
  });