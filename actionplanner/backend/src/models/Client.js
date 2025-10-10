import { BaseModel } from './BaseModel.js';

export class Client extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.cnpj = data.cnpj || '';
    this.endereco = data.endereco || '';
    this.email = data.email || '';
    this.telefone = data.telefone || '';
    this.sectorId = data.sectorId || null;
    this.sector = data.sector || null;
  }

  validate() {
    const errors = [];

    if (!this.nome || this.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!this.cnpj || !this.isValidDocument(this.cnpj)) {
      errors.push('CNPJ inválido');
    }

    if (!this.endereco || this.endereco.trim().length < 5) {
      errors.push('Endereço deve ter pelo menos 5 caracteres');
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }

    if (this.telefone && !this.isValidPhone(this.telefone)) {
      errors.push('Telefone inválido');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^\+?[0-9\s\-()]{8,}$/;
    return phoneRegex.test(phone);
  }

  isValidDocument(document) {
    const clean = document.replace(/\D/g, '');
    return clean.length === 14;
  }

  associateSector(sector) {
    this.sector = sector;
    this.sectorId = sector?.id || null;
    return this;
  }

  removeSector() {
    this.sector = null;
    this.sectorId = null;
    return this;
  }

  toSafeJSON() {
    return this.toJSON();
  }
}
