import yup from "yup";

export const createClientValidator = yup
  .object()
  .shape({
    nome: yup
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(255, "Nome deve ter no máximo 255 caracteres")
      .required("Nome é obrigatório"),

    cnpj: yup
      .string()
      .matches(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, "CNPJ inválido")
      .required("CNPJ é obrigatório"),

    endereco: yup
      .string()
      .min(5, "Endereço deve ter pelo menos 5 caracteres")
      .max(255, "Endereço deve ter no máximo 255 caracteres")
      .required("Endereço é obrigatório"),

    email: yup
      .string()
      .email("Email inválido")
      .max(255, "Email deve ter no máximo 255 caracteres")
      .nullable(),

    telefone: yup
      .string()
      .min(8, "Telefone inválido")
      .max(20, "Telefone deve ter no máximo 20 caracteres")
      .nullable(),

    sectorId: yup
      .number()
      .integer("Sector ID deve ser um número inteiro")
      .positive("Sector ID deve ser positivo")
      .nullable()
  });

export const updateClientValidator = yup
  .object()
  .shape({
    nome: yup
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(255, "Nome deve ter no máximo 255 caracteres"),

    cnpj: yup
      .string()
      .matches(/^\d{14}$/, "CNPJ inválido"),

    endereco: yup
      .string()
      .min(5, "Endereço deve ter pelo menos 5 caracteres")
      .max(255, "Endereço deve ter no máximo 255 caracteres"),

    email: yup
      .string()
      .email("Email inválido")
      .max(255, "Email deve ter no máximo 255 caracteres"),

    telefone: yup
      .string()
      .min(8, "Telefone inválido")
      .max(20, "Telefone deve ter no máximo 20 caracteres"),

    sectorId: yup
      .number()
      .integer("Sector ID deve ser um número inteiro")
      .positive("Sector ID deve ser positivo")
      .nullable()
  });
