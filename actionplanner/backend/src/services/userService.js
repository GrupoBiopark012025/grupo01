import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class UserService {
  
  static async create(userData) {
    const { password, userClienteIds, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        userClientes: {
          create: userClienteIds.map((clienteId) => ({
            cliente: { connect: { id: clienteId } },
          })),
        },
      },
      include: {
        cliente: true,
        userClientes: {
          include: {
            cliente: true
          }
        }
      }
    });
  }

  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        cliente: true,
        userClientes: {
          include: {
            cliente: true
          }
        }
      }
    });
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        cliente: true,
        userClientes: {
          include: {
            cliente: true
          }
        }
      }
    });
  }

  // Listar usuários com filtros e paginação
  static async findMany(filters = {}, pagination = {}) {
    const { page = 1, size = 10, orderBy = 'id' } = pagination;
    const { nome, email, clienteId, status, accessLevel, ...otherFilters } = filters;

    const skip = (page - 1) * size;

    const where = {};
    if (nome) where.nome = { contains: nome, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (clienteId) where.clienteId = parseInt(clienteId);
    if (status) where.status = status;
    if (accessLevel) where.accessLevel = accessLevel;

    Object.assign(where, otherFilters);

    const [users, totalData] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: size,
        orderBy: { [orderBy.replace('-', '')]: orderBy.startsWith('-') ? 'desc' : 'asc' },
        include: {
          cliente: true,
          userClientes: {
            include: {
              cliente: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalData / size);

    return {
      users,
      totalData,
      totalPages,
      currentPage: page,
      size
    };
  }

  static async update(id, userData) {
    const { password, ...rest } = userData;
    
    const updateData = { ...rest };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        cliente: true,
        userClientes: {
          include: {
            cliente: true
          }
        }
      }
    });
  }

  // Soft delete
  static async softDelete(id) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status: 'INATIVO' }
    });
  }

  // Hard delete
  static async delete(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) }
    });
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(id) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: { lastLogin: new Date() }
    });
  }

  // Buscar empresas que o usuário pode acessar
  static async getUserAccessibleClients(userId) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        userClientes: {
          include: {
            cliente: true
          }
        }
      }
    });

    if (user?.isAdmin) {
      console.log('oi')
      return await prisma.cliente.findMany();
    }

    return user?.userClientes.map(uc => uc.cliente) || [];
  }

  // Verificar se usuário tem acesso a um cliente específico
  static async hasAccessToClient(userId, clienteId) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        userClientes: true
      }
    });

    if (user?.isAdmin) return true;

    return user?.userClientes.some(uc => uc.clienteId === parseInt(clienteId)) || false;
  }

  static async userHasAccessToClient(userId, clienteId) {
    const count = await prisma.userCliente.count({
      where: { userId, clienteId }
    });
    return count > 0;
  }
}