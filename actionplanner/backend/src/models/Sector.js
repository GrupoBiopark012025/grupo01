import { BaseModel } from './BaseModel.js';

export class Sector extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.acronym = data.acronym || '';
    this.description = data.description || null;
    this.status = data.status || 'ativo';
    this.color = data.color || '#3B82F6';
    this.tasks = data.tasks || [];
  }

  // Validação específica do Sector
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Nome do setor deve ter pelo menos 2 caracteres');
    }
    
    if (this.name && this.name.length > 255) {
      errors.push('Nome do setor não pode ter mais de 255 caracteres');
    }
    
    if (!this.acronym || this.acronym.trim().length < 1) {
      errors.push('Sigla do setor é obrigatória');
    }
    
    if (this.acronym && this.acronym.length > 5) {
      errors.push('Sigla do setor não pode ter mais de 5 caracteres');
    }
    
    if (this.description && this.description.length > 500) {
      errors.push('Descrição não pode ter mais de 500 caracteres');
    }
    
    if (!['ativo', 'inativo'].includes(this.status)) {
      errors.push('Status deve ser "ativo" ou "inativo"');
    }
    
    if (!this.color || !this.isValidColor(this.color)) {
      errors.push('Cor deve estar no formato hexadecimal (#RRGGBB)');
    }
    
    return errors;
  }

  // Método para validar cor hexadecimal
  isValidColor(color) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexColorRegex.test(color);
  }

  // Método para verificar se setor está ativo
  isActive() {
    return this.status === 'ativo';
  }

  // Método para ativar setor
  activate() {
    this.status = 'ativo';
    return this;
  }

  // Método para inativar setor
  deactivate() {
    this.status = 'inativo';
    return this;
  }

  // Método para obter sigla em maiúsculas
  getAcronymUpperCase() {
    return this.acronym.toUpperCase();
  }

  // Método para verificar se tem tarefas associadas
  hasTasks() {
    return this.tasks && this.tasks.length > 0;
  }

  // Método para obter tarefas ativas (se tasks tiver status)
  getActiveTasks() {
    if (!this.tasks) return [];
    return this.tasks.filter(task => 
      task.status && task.status !== 'cancelada' && task.status !== 'concluida'
    );
  }

  // Método para obter resumo do setor
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      acronym: this.getAcronymUpperCase(),
      description: this.description,
      status: this.status,
      isActive: this.isActive(),
      color: this.color,
      createdAt: this.formatDate(this.createdAt)
    };
  }

  // Método para obter nome do status formatado
  getStatusName() {
    const statuses = {
      'ativo': 'Ativo',
      'inativo': 'Inativo'
    };
    return statuses[this.status] || this.status;
  }

  // Método para normalizar sigla (sempre maiúscula, sem espaços)
  normalizeAcronym() {
    this.acronym = this.acronym.trim().toUpperCase();
    return this;
  }

  // Método para normalizar nome (capitalizar primeira letra)
  normalizeName() {
    this.name = this.name.trim();
    return this;
  }

  // Método estático para criar um novo setor com validações
  static create(data) {
    const sector = new Sector(data);
    sector.normalizeAcronym();
    sector.normalizeName();
    
    const errors = sector.validate();
    if (errors.length > 0) {
      throw new Error(`Validação falhou: ${errors.join(', ')}`);
    }
    
    return sector;
  }

  // Método para converter para JSON com informações adicionais
  toDetailedJSON() {
    return {
      ...this.toJSON(),
      isActive: this.isActive(),
      taskCount: this.getTaskCount(),
      statusName: this.getStatusName()
    };
  }
}

