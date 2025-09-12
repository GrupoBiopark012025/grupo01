import { PrismaClient } from '@prisma/client';

export class DatabaseService {
  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }
    
    this.prisma = new PrismaClient();
    DatabaseService.instance = this;
  }

  // Método para obter instância do Prisma
  getPrisma() {
    return this.prisma;
  }

  // Método para conectar ao banco
  async connect() {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  // Método para desconectar do banco
  async disconnect() {
    try {
      await this.prisma.$disconnect();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
      throw error;
    }
  }

  // Método para executar transações
  async executeTransaction(operations) {
    return await this.prisma.$transaction(operations);
  }

  // Método para verificar saúde da conexão
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }
}