import { AuthService } from '../services/authService.js';

export const login = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "hermes@actionplan.com.br"
            },
            password: {
              type: "string",
              example: "123456"
            }
          }
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Login realizado com sucesso",
    schema: {
      type: "object",
      properties: {
        user: { $ref: "#/components/schemas/UserProfile" },
        token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
      }
    }
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  #swagger.responses[401] = {
    description: "Credenciais inválidas ou usuário inativo"
  }
  */
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.json({
      message: 'Login realizado com sucesso',
      ...result
    });
  } catch (error) {
    if (error.message === 'Credenciais inválidas' || error.message === 'Usuário inativo') {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Token renovado com sucesso",
    schema: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
      }
    }
  }
  #swagger.responses[401] = {
    description: "Token inválido"
  }
  */
  try {
    const authHeader = req.headers.authorization;
    const currentToken = authHeader?.substring(7);

    if (!currentToken) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const newToken = await AuthService.refreshToken(currentToken);

    res.json({
      message: 'Token renovado com sucesso',
      token: newToken
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const logout = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Logout realizado com sucesso"
  }
  */
  // Para JWT, o logout é feito no frontend removendo o token
  // Aqui podemos logar a ação ou implementar blacklist de tokens se necessário
  res.json({ message: 'Logout realizado com sucesso' });
};

export const validateToken = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Token válido",
    schema: {
      type: "object",
      properties: {
        valid: { type: "boolean", example: true },
        user: { $ref: "#/components/schemas/UserProfile" }
      }
    }
  }
  #swagger.responses[401] = {
    description: "Token inválido"
  }
  */
  try {
    // O middleware de auth já validou o token e adicionou o user na request
    const { password, ...userWithoutPassword } = req.user;
    
    res.json({
      valid: true,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

export const changeEnvironment = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["clienteId"],
          properties: {
            clienteId: {
              type: "integer",
              example: 2
            }
          }
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Ambiente alterado com sucesso",
    schema: {
      type: "object",
      properties: {
        cliente: { $ref: "#/components/schemas/Cliente" },
        token: { type: "string" }
      }
    }
  }
  #swagger.responses[401] = {
    description: "Credenciais inválidas ou usuário inativo"
  }
  #swagger.responses[403] = {
    description: "Usuário não possui acesso a este cliente"
  }
  #swagger.responses[404] = {
    description: "Usuário não encontrado"
  }
  */

  try {
    const { clienteId } = req.body;
    const userId = req.user.id;

    const result = await AuthService.changeEnvironment(userId, clienteId, res);

    res.json({
      message: "Ambiente alterado com sucesso",
      ...result
    });
  } catch (err) {
    if (err.message === 'Usuário não possui acesso a este cliente') {
      return res.status(403).json({ error: err.message });
    }

    if (err.message === 'Usuário não encontrado') {
      return res.status(404).json({ error: err.message });
    }

    next(err);
  }
};

// Middleware exports para usar nos routers
export const verify = AuthService.verifyAuth;
export const requireAdmin = AuthService.requireAdmin;
export const requireClientAccess = AuthService.requireClientAccess;