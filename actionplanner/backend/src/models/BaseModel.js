export class BaseModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // Método para converter para JSON
  toJSON() {
    return { ...this };
  }

  // Método para verificar se é um registro novo
  isNew() {
    return this.id === null;
  }

  // Método para formatar data
  formatDate(date) {
    if (!date) return null;
    return new Date(date).toLocaleDateString('pt-BR');
  }

  // Método para validar se tem todos os campos obrigatórios
  validate() {
    throw new Error('Método validate deve ser implementado na classe filha');
  }
}