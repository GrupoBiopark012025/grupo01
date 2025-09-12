import { BaseModel } from './BaseModel.js';

export class AuditLog extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.userId || null;
    this.clienteId = data.clienteId || null;
    this.action = data.action || 'VIEW';
    this.tableName = data.tableName || '';
    this.recordId = data.recordId || null;
    this.oldValues = data.oldValues || null;
    this.newValues = data.newValues || null;
    this.description = data.description || null;
    this.ipAddress = data.ipAddress || null;
    this.userAgent = data.userAgent || null;
    this.user = data.user || null;
    this.cliente = data.cliente || null;
  }

  // Validação específica do AuditLog
  validate() {
    const errors = [];
    
    if (!this.action || !['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT'].includes(this.action)) {
      errors.push('Ação inválida');
    }
    
    if (!this.tableName || this.tableName.trim().length < 1) {
      errors.push('Nome da tabela é obrigatório');
    }
    
    return errors;
  }

  // Método para obter descrição da ação
  getActionDescription() {
    const actions = {
      'CREATE': 'Criação',
      'UPDATE': 'Atualização',
      'DELETE': 'Exclusão',
      'LOGIN': 'Login',
      'LOGOUT': 'Logout',
      'VIEW': 'Visualização',
      'EXPORT': 'Exportação'
    };
    return actions[this.action] || this.action;
  }

  // Método para verificar se houve mudanças significativas
  hasSignificantChanges() {
    if (!this.oldValues || !this.newValues) return true;
    
    // Ignorar mudanças em campos como updatedAt
    const ignoredFields = ['updatedAt', 'lastLogin'];
    const oldFiltered = this.filterIgnoredFields(this.oldValues, ignoredFields);
    const newFiltered = this.filterIgnoredFields(this.newValues, ignoredFields);
    
    return JSON.stringify(oldFiltered) !== JSON.stringify(newFiltered);
  }

  // Método auxiliar para filtrar campos ignorados
  filterIgnoredFields(obj, ignoredFields) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const filtered = { ...obj };
    ignoredFields.forEach(field => {
      delete filtered[field];
    });
    return filtered;
  }

  // Método para criar log de ação
  static createActionLog(userId, action, tableName, recordId = null, oldValues = null, newValues = null, description = null, req = null) {
    return new AuditLog({
      userId,
      action,
      tableName,
      recordId,
      oldValues,
      newValues,
      description,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.headers?.['user-agent'],
      createdAt: new Date()
    });
  }

  // Método para obter resumo da mudança
  getChangeSummary() {
    if (this.action === 'CREATE') {
      return `Novo registro criado na tabela ${this.tableName}`;
    }
    
    if (this.action === 'DELETE') {
      return `Registro excluído da tabela ${this.tableName}`;
    }
    
    if (this.action === 'UPDATE' && this.oldValues && this.newValues) {
      const changes = [];
      for (const key in this.newValues) {
        if (this.oldValues[key] !== this.newValues[key]) {
          changes.push(key);
        }
      }
      return `Campos alterados: ${changes.join(', ')}`;
    }
    
    return this.description || `${this.getActionDescription()} na tabela ${this.tableName}`;
  }
}