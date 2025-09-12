import { Cliente } from '../../models/Cliente.js';
import { DatabaseService } from './DatabaseService.js';

export class ClienteServiceOOP extends DatabaseService {
  constructor() {
    super();
  }

  // Método para criar cliente usando OOP
  async createCliente(clienteData) {
    // Criar instância da classe Cliente
    const cliente = new Cliente(clienteData);

    // Validar dados
    const validationErrors = cliente.validate();
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    try {
      const savedCliente = await this.prisma.cliente.create({
        data: {
          nome: cliente.nome,
          cnpj: cliente.cnpj,
          email: cliente.email,
          telefone: cliente.telefone,
          endereco: cliente.endereco
        },
        include: {
          usuarios: true,
          userClientes: true
        }
      });

      return new Cliente(savedCliente);
    } catch (error) {
      throw new Error(`Failed to create cliente: ${error.message}`);
    }
  }

  // Método para buscar cliente por ID
  async findClienteById(id) {
    try {
      const clienteData = await this.prisma.cliente.findUnique({
        where: { id: parseInt(id) },
        include: {
          usuarios: true,
          userClientes: { include: { user: true } }
        }
      });

      return clienteData ? new Cliente(clienteData) : null;
    } catch (error) {
      throw new Error(`Failed to find cliente: ${error.message}`);
    }
  }

  // Método para listar clientes com dados enriquecidos
  async listClientesOOP() {
    try {
      const clientes = await this.prisma.cliente.findMany({
        include: {
          usuarios: { where: { status: 'ATIVO' } },
          userClientes: true
        }
      });

      // Converter para instâncias da classe Cliente e enriquecer dados
      return clientes.map(clienteData => {
        const cliente = new Cliente(clienteData);
        return {
          ...cliente.toJSON(),
          cnpjFormatado: cliente.getFormattedCNPJ(),
          telefoneFormatado: cliente.getFormattedTelefone(),
          usuariosAtivos: cliente.getActiveUsersCount(),
          isActionPlan: cliente.isActionPlan()
        };
      });
    } catch (error) {
      throw new Error(`Failed to list clientes: ${error.message}`);
    }
  }
}

// src/services/oop/ReportServiceOOP.js
import { AuditLog } from '../../models/AuditLog.js';
import { DatabaseService } from './DatabaseService.js';

export class ReportServiceOOP extends DatabaseService {
  constructor() {
    super();
  }

  // Método para gerar relatório de atividades
  async generateActivityReport(filters = {}) {
    try {
      const auditLogs = await this.prisma.auditLog.findMany({
        where: filters,
        include: {
          user: true,
          cliente: true
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      });

      // Converter para instâncias da classe AuditLog e enriquecer
      const enrichedLogs = auditLogs.map(logData => {
        const auditLog = new AuditLog(logData);
        return {
          ...auditLog.toJSON(),
          actionDescription: auditLog.getActionDescription(),
          changeSummary: auditLog.getChangeSummary(),
          hasSignificantChanges: auditLog.hasSignificantChanges()
        };
      });

      // Agrupar por tipo de ação
      const actionSummary = this.groupByAction(enrichedLogs);

      // Agrupar por usuário
      const userActivity = this.groupByUser(enrichedLogs);

      return {
        logs: enrichedLogs,
        summary: {
          total: enrichedLogs.length,
          byAction: actionSummary,
          byUser: userActivity,
          timeRange: {
            from: enrichedLogs[enrichedLogs.length - 1]?.createdAt,
            to: enrichedLogs[0]?.createdAt
          }
        }
      };
    } catch (error) {
      throw new Error(`Failed to generate activity report: ${error.message}`);
    }
  }

  // Método auxiliar para agrupar por ação
  groupByAction(logs) {
    return logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});
  }

  // Método auxiliar para agrupar por usuário
  groupByUser(logs) {
    return logs.reduce((acc, log) => {
      if (log.user) {
        const userName = log.user.nome;
        acc[userName] = (acc[userName] || 0) + 1;
      }
      return acc;
    }, {});
  }
}