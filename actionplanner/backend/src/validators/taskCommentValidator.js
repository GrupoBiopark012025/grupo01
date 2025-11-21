import * as yup from "yup";

export const createTaskCommentValidator = yup.object({
  content: yup
    .string()
    .required("Conteúdo do comentário é obrigatório")
    .max(5000, "Comentário deve ter no máximo 5000 caracteres")
});