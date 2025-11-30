import { PasswordResetService } from "../services/passwordResetService.js";

export const requestPasswordReset = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "usuario@exemplo.com"
            }
          }
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Email de recuperação enviado (ou não, por segurança)"
  }
  */
  try {
    const { email } = req.body;
    
    const result = await PasswordResetService.requestPasswordReset(email);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const validateResetToken = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.parameters['token'] = {
    in: 'query',
    description: 'Token de recuperação',
    required: true,
    type: 'string'
  }
  #swagger.responses[200] = {
    description: "Token válido"
  }
  #swagger.responses[400] = {
    description: "Token inválido, expirado ou já utilizado"
  }
  */
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: "Token não fornecido" });
    }
    
    await PasswordResetService.validateResetToken(token);
    
    res.json({ valid: true, message: "Token válido" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["token", "newPassword"],
          properties: {
            token: {
              type: "string",
              example: "abc123..."
            },
            newPassword: {
              type: "string",
              example: "NovaSenha123!"
            }
          }
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Senha redefinida com sucesso"
  }
  #swagger.responses[400] = {
    description: "Token inválido ou senha inválida"
  }
  */
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token e nova senha são obrigatórios" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
    }
    
    const result = await PasswordResetService.resetPassword(token, newPassword);
    
    res.json(result);
  } catch (error) {
    if (error.message.includes("Token")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};