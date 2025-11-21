import * as yup from "yup";

export const createTaskValidator = yup.object({
  title: yup
    .string()
    .required("Título é obrigatório")
    .max(255, "Título deve ter no máximo 255 caracteres"),
  
  description: yup
    .string()
    .nullable()
    .max(5000, "Descrição deve ter no máximo 5000 caracteres"),
  
  status: yup
    .string()
    .required("Status é obrigatório")
    .oneOf(
      ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"],
      "Status inválido"
    ),
  
  priority: yup
    .string()
    .required("Prioridade é obrigatória")
    .oneOf(
      ["BAIXA", "MEDIA", "ALTA", "URGENTE"],
      "Prioridade inválida"
    ),
  
  dueDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      return new Date(originalValue);
    }),
  
  actionPlanId: yup
    .number()
    .integer("ID do plano de ação deve ser um número inteiro")
    .positive("ID do plano de ação deve ser positivo")
    .required("Plano de ação é obrigatório")
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        return parseInt(originalValue, 10);
      }
      return originalValue;
    }),
  
  sectorId: yup
    .number()
    .integer("ID do setor deve ser um número inteiro")
    .positive("ID do setor deve ser positivo")
    .required("Setor é obrigatório")
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        return parseInt(originalValue, 10);
      }
      return originalValue;
    }),
  
  userResponsibleId: yup
    .number()
    .integer("ID do usuário responsável deve ser um número inteiro")
    .positive("ID do usuário responsável deve ser positivo")
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return null;
      }
      if (typeof originalValue === 'string') {
        return parseInt(originalValue, 10);
      }
      return originalValue;
    }),
});

export const updateTaskValidator = yup.object({
  title: yup
    .string()
    .max(255, "Título deve ter no máximo 255 caracteres"),
  
  description: yup
    .string()
    .nullable()
    .max(5000, "Descrição deve ter no máximo 5000 caracteres"),
  
  status: yup
    .string()
    .oneOf(
      ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"],
      "Status inválido"
    ),
  
  priority: yup
    .string()
    .oneOf(
      ["BAIXA", "MEDIA", "ALTA", "URGENTE"],
      "Prioridade inválida"
    ),
  
  dueDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      return new Date(originalValue);
    }),
  
  actionPlanId: yup
    .number()
    .integer("ID do plano de ação deve ser um número inteiro")
    .positive("ID do plano de ação deve ser positivo")
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        return parseInt(originalValue, 10);
      }
      return originalValue;
    }),
  
  sectorId: yup
    .number()
    .integer("ID do setor deve ser um número inteiro")
    .positive("ID do setor deve ser positivo")
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        return parseInt(originalValue, 10);
      }
      return originalValue;
    }),
  
  userResponsibleId: yup
    .number()
    .integer("ID do usuário responsável deve ser um número inteiro")
    .positive("ID do usuário responsável deve ser positivo")
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return null;
      }
      if (typeof originalValue === 'string') {
        return parseInt(originalValue, 10);
      }
      return originalValue;
    }),
});