import { User } from '../../models/User.js';
import { AuditLog } from '../../models/AuditLog.js';
import { DatabaseService } from './DatabaseService.js';

export class UserServiceOOP extends DatabaseService {
  constructor() {
    super();
  }

  // Método para criar usuário usando OOP
  async createUser(userData, req = null) {
    // Criar instância da classe User
    const user = new User(userData);
    
    // Validar dados
    const validationErrors = user.validate();
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Hash da senha
    await user.hashPassword();

    try {
      // Salvar no banco
      const savedUser = await this.prisma.user.create({
        data: {
          nome: user.nome,
          email: user.email,
          password: user.password,
          clienteId: user.clienteId,
          isAdmin: user.isAdmin,
          accessLevel: user.accessLevel,
          onlyAttachedTasks: user.onlyAttachedTasks,
          status: user.status
        },
        include: {
          cliente: true,
          userClientes: {
            include: { cliente: true }
          }
        }
      });

      // Criar log de auditoria
      const auditLog = AuditLog.createActionLog(
        null, // usuário que criou (pode ser admin)
        'CREATE',
        'users',
        savedUser.id,
        null,
        savedUser,
        `Usuário ${savedUser.nome} criado`,
        req
      );

      // Salvar log (opcional)
      await this.saveAuditLog(auditLog);

      // Retornar instância da classe User
      return new User(savedUser);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Método para autenticar usuário
  async authenticateUser(email, password, req = null) {
    try {
      // Buscar usuário
      const userData = await this.prisma.user.findUnique({
        where: { email },
        include: {
          cliente: true,
          userClientes: { include: { cliente: true } }
        }
      });

      if (!userData) {
        throw new Error('Usuário não encontrado');
      }

      // Criar instância da classe User
      const user = new User(userData);

      // Verificar se está ativo
      if (!user.isActive()) {
        throw new Error('Usuário inativo');
      }

      // Verificar senha
      const isPasswordValid = await user.verifyPassword(password);
      if (!isPasswordValid) {
        throw new Error('Senha inválida');
      }

      // Atualizar último login
      user.updateLastLogin();
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: user.lastLogin }
      });

      // Criar log de login
      const auditLog = AuditLog.createActionLog(
        user.id,
        'LOGIN',
        'users',
        user.id,
        null,
        null,
        `Login realizado por ${user.nome}`,
        req
      );

      await this.saveAuditLog(auditLog);

      return user;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // Método para buscar usuário por ID
  async findUserById(id) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          cliente: true,
          userClientes: { include: { cliente: true } }
        }
      });

      return userData ? new User(userData) : null;
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  // Método para listar usuários com filtros usando OOP
  async listUsersOOP(filters = {}, pagination = {}) {
    try {
      const { page = 1, size = 10 } = pagination;
      const skip = (page - 1) * size;

      const users = await this.prisma.user.findMany({
        where: filters,
        skip,
        take: size,
        include: {
          cliente: true,
          userClientes: { include: { cliente: true } }
        }
      });

      // Converter para instâncias da classe User
      const userInstances = users.map(userData => new User(userData));

      // Aplicar métodos OOP para enriquecer dados
      const enrichedUsers = userInstances.map(user => ({
        ...user.toSafeJSON(),
        accessLevelName: user.getAccessLevelName(),
        canViewAllTasks: user.canViewAllTasks(),
        isActive: user.isActive(),
        hasAdminAccess: user.hasAdminAccess()
      }));

      const total = await this.prisma.user.count({ where: filters });

      return {
        users: enrichedUsers,
        pagination: {
          page,
          size,
          total,
          totalPages: Math.ceil(total / size)
        }
      };
    } catch (error) {
      throw new Error(`Failed to list users: ${error.message}`);
    }
  }

  // Método para salvar log de auditoria
  async saveAuditLog(auditLog) {
    try {
      const validationErrors = auditLog.validate();
      if (validationErrors.length > 0) {
        console.warn('Audit log validation failed:', validationErrors);
        return null;
      }

      return await this.prisma.auditLog.create({
        data: {
          userId: auditLog.userId,
          clienteId: auditLog.clienteId,
          action: auditLog.action,
          tableName: auditLog.tableName,
          recordId: auditLog.recordId,
          oldValues: auditLog.oldValues,
          newValues: auditLog.newValues,
          description: auditLog.description,
          ipAddress: auditLog.ipAddress,
          userAgent: auditLog.userAgent
        }
      });
    } catch (error) {
      console.error('Failed to save audit log:', error);
      return null;
    }
  }
}