import yup from "yup";

export const createProjectValidator = yup
  .object()
  .shape({
    name: yup
      .string()
      .min(5, "Nome deve ter pelo menos 5 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres")
      .required("Nome é obrigatório"),

    description: yup
      .string()
      .max(10000, "Descrição deve ter no máximo 10000 caracteres")
      .nullable()
  });

export const updateProjectValidator = yup
  .object()
  .shape({
    name: yup
      .string()
      .min(5, "Nome deve ter pelo menos 5 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres"),

    description: yup
      .string()
      .max(10000, "Descrição deve ter no máximo 10000 caracteres")
      .nullable(),

    status: yup
      .string()
      .oneOf(["ativo", "inativo"], "Status deve ser 'ativo' ou 'inativo'")
  });

