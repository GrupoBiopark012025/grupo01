import jwt from 'jsonwebtoken';
import { UserService } from './userService.js';

export class AuthService {
  
  static async login(email, password) {
    const user = await UserService.findByEmail(email);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    if (user.status === 'INATIVO') {
      throw new Error('Usuário inativo');
    }

    const isPasswordValid = await UserService.verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    await UserService.updateLastLogin(user.id);
    const token = this.generateToken(user);

    const accessibleClients = await UserService.getUserAccessibleClients(user.id);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
        clientes: accessibleClients
      },
      token
    };
  }

  // Gerar JWT token
  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      clienteId: user.clienteId,
      isAdmin: user.isAdmin,
      accessLevel: user.accessLevel,
      onlyAttachedTasks: user.onlyAttachedTasks
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  static async verifyAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }
      const token = authHeader.substring(7);

      const decoded = AuthService.verifyToken(token);

      const user = await UserService.findById(decoded.id);
      if (!user || user.status === 'INATIVO') {
        return res.status(401).json({ error: 'Usuário inválido ou inativo' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  }

  static requireAdmin(req, res, next) {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Admin necessário.' });
    }
    next();
  }

  static requireClientAccess(req, res, next) {
    return async (req, res, next) => {
      try {
        const clienteId = req.params.clienteId || req.body.clienteId || req.query.clienteId;
        
        if (!clienteId) {
          return res.status(400).json({ error: 'Cliente ID necessário' });
        }

        const hasAccess = await UserService.hasAccessToClient(req.user.id, clienteId);
        
        if (!hasAccess) {
          return res.status(403).json({ error: 'Acesso negado a este cliente' });
        }

        next();
      } catch (error) {
        return res.status(500).json({ error: 'Erro ao verificar acesso' });
      }
    };
  }

  // Refresh token
  static async refreshToken(currentToken) {
    try {
      const decoded = this.verifyToken(currentToken);
      const user = await UserService.findById(decoded.id);
      
      if (!user || user.status === 'INATIVO') {
        throw new Error('Usuário inválido');
      }

      return this.generateToken(user);
    } catch (error) {
      throw new Error('Não foi possível renovar o token');
    }
  }
}