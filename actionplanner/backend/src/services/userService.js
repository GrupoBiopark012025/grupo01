import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ClientService } from "./clientService.js";

const prisma = new PrismaClient();

export class UserService {
  
  static async create(userData) {
    const { password, userClienteIds, userSectorIds, isAdmin, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      ...rest,
      isAdmin,
      password: hashedPassword,
      clienteId: rest.clienteId ?? (isAdmin ? 1 : undefined)
    };

    if (rest.accessLevel !== "ADMIN" && Array.isArray(userClienteIds) && userClienteIds.length > 0) {
      data.userClientes = {
        create: userClienteIds.map((clienteId) => ({
          cliente: { connect: { id: clienteId } },
        })),
      };
    }

    if (!isAdmin && Array.isArray(userSectorIds) && userSectorIds.length > 0) {
      data.userSectors = {
        create: userSectorIds.map((sectorId) => ({
          sector: { connect: { id: sectorId } },
        })),
      };
    }

    return await prisma.user.create({
      data,
      include: {
        cliente: true,
        userClientes: {
          include: {
            cliente: true
          }
        },
        userSectors: {
          include: {
            sector: true
          }
        }
      }
    });
  }

  static async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        cliente: true,
        userClientes: {
          include: {
            cliente: true
          }
        },
        userSectors: {
          include: {
            sector: true
          }
        }
      }
    });

    return {
      ...user,
      userClientes: user?.userClientes?.map(uc => uc.cliente) || [],
      sectors: user?.userSectors?.map(us => us.sector) || []
    }
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
          },
          userSectors: {
            include: {
              sector: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalData / size);

    return {
      users: users.map(user => ({
        ...user,
        sectors: user.userSectors?.map(us => us.sector) || []
      })),
      totalData,
      totalPages,
      currentPage: page,
      size
    };
  }

  static async update(id, userData) {
    const {
      password,
      userClienteIds,
      userSectorIds,
      isAdmin,
      ...rest
    } = userData;

    const updateData = {
      ...rest,
      clienteId: rest.clienteId ?? (isAdmin ? 1 : undefined),
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Array.isArray(userClienteIds)) {
      await prisma.userCliente.deleteMany({
        where: { userId: parseInt(id) },
      });

      if (rest.accessLevel !== "ADMIN" && userClienteIds.length > 0) {
        updateData.userClientes = {
          create: userClienteIds.map((clienteId) => ({
            cliente: { connect: { id: clienteId } },
          })),
        };
      }
    }

    if (Array.isArray(userSectorIds)) {
      await prisma.userSector.deleteMany({
        where: { userId: parseInt(id) },
      });

      if (!isAdmin && userSectorIds.length > 0) {
        updateData.userSectors = {
          create: userSectorIds.map((sectorId) => ({
            sector: { connect: { id: sectorId } },
          })),
        };
      }
    }

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        cliente: true,
        userClientes: {
          include: { cliente: true },
        },
        userSectors: {
          include: {
            sector: true
          }
        }
      },
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
      return await prisma.cliente.findMany();
    }

    return user?.userClientes.map(uc => uc.cliente) || [];
  }

  static async getPaginatedUserAccessibleClients(userId, pagination) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user?.isAdmin) {
      return await ClientService.findMany({}, pagination);
    }

    return await ClientService.findManyAccessibleByUser(userId, pagination);
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