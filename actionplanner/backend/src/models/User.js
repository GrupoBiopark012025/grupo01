import { BaseModel } from './BaseModel.js';
import bcrypt from 'bcrypt';

export class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.nome = data.nome || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.clienteId = data.clienteId || null;
    this.isAdmin = data.isAdmin || false;
    this.accessLevel = data.accessLevel || 'COLABORADOR_CLIENTE';
    this.onlyAttachedTasks = data.onlyAttachedTasks || false;
    this.status = data.status || 'ATIVO';
    this.lastLogin = data.lastLogin || null;
    this.cliente = data.cliente || null;
    this.userClientes = data.userClientes || [];
  }

  // Validação específica do User
  validate() {
    const errors = [];
    
    if (!this.nome || this.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }
    
    if (!this.password || this.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (!this.clienteId) {
      errors.push('Cliente ID é obrigatório');
    }
    
    if (!['ADMIN', 'CONSULTOR', 'GESTOR_CLIENTE', 'COLABORADOR_CLIENTE'].includes(this.accessLevel)) {
      errors.push('Nível de acesso inválido');
    }
    
    return errors;
  }

  // Método para validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para hash da senha
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    return this;
  }

  // Método para verificar senha
  async verifyPassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  // Método para verificar se usuário está ativo
  isActive() {
    return this.status === 'ATIVO';
  }

  // Método para verificar se é admin
  hasAdminAccess() {
    return this.isAdmin === true;
  }

  // Método para verificar se tem acesso total
  hasFullAccess() {
    return this.isAdmin || this.accessLevel === 'ADMIN';
  }

  // Método para verificar se pode ver todas as tasks
  canViewAllTasks() {
    return this.hasFullAccess() || !this.onlyAttachedTasks;
  }

  // Método para obter empresas acessíveis
  getAccessibleClients() {
    if (this.hasAdminAccess()) {
      return 'ALL'; // Admin tem acesso a todas
    }
    return this.userClientes.map(uc => uc.cliente).filter(Boolean);
  }

  // Método para verificar acesso a um cliente específico
  hasAccessToClient(clienteId) {
    if (this.hasAdminAccess()) return true;
    return this.userClientes.some(uc => uc.clienteId === parseInt(clienteId));
  }

  // Método para obter informações de perfil sem senha
  getProfile() {
    const { password, ...profile } = this.toJSON();
    return {
      ...profile,
      clientesAcessiveis: this.getAccessibleClients(),
      podeVerTodasTasks: this.canViewAllTasks(),
      isAdministrador: this.hasAdminAccess()
    };
  }

  // Método para atualizar último login
  updateLastLogin() {
    this.lastLogin = new Date();
    return this;
  }

  // Método para obter nome do nível de acesso formatado
  getAccessLevelName() {
    const levels = {
      'ADMIN': 'Administrador',
      'CONSULTOR': 'Consultor',
      'GESTOR_CLIENTE': 'Gestor de Cliente',
      'COLABORADOR_CLIENTE': 'Colaborador'
    };
    return levels[this.accessLevel] || this.accessLevel;
  }

  // Método para converter para JSON removendo dados sensíveis
  toSafeJSON() {
    const { password, ...safeData } = this.toJSON();
    return safeData;
  }
}