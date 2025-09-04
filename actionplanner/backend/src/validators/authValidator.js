import yup from "yup";

export const loginValidator = yup
  .object()
  .shape({
    email: yup
      .string()
      .email("Email inválido")
      .required("Email é obrigatório"),
    password: yup
      .string()
      .required("Senha é obrigatória"),
  });