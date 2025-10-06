import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ClientService {
  static async create(clientData) {
    return await prisma.cliente.create({
      data: clientData,
      include: {
        users: true,
        tasks: true,
        auditLogs: true
      }
    })
  }

  static async findById(id) {
    return await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
      include: {
        users: true,
        tasks: true,
        auditLogs: true
      }
    })
  }

  static async findMany(filters = {}, pagination = {}) {
    const { page = 1, size = 10, orderBy = 'id' } = pagination
    const { nome, cnpj, sectorId, ...otherFilters } = filters

    const skip = (page - 1) * size
    const where = {}

    if (nome) where.nome = { contains: nome, mode: 'insensitive' }
    if (cnpj) where.cnpj = { contains: cnpj }
    if (sectorId) where.sectorId = parseInt(sectorId)

    Object.assign(where, otherFilters)

    const [clients, totalData] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: size,
        orderBy: { [orderBy.replace('-', '')]: orderBy.startsWith('-') ? 'desc' : 'asc' },
        include: {
          users: true,
          tasks: true,
          auditLogs: true
        }
      }),
      prisma.cliente.count({ where })
    ])

    const totalPages = Math.ceil(totalData / size)

    return {
      clients,
      totalData,
      totalPages,
      currentPage: page,
      size
    }
  }

  static async update(id, clientData) {
    return await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: clientData,
      include: {
        users: true,
        tasks: true,
        auditLogs: true
      }
    })
  }

  static async softDelete(id) {
    const cliente = await prisma.cliente.findUnique({ where: { id: parseInt(id) } })
    if (!cliente) {
      const err = new Error('Cliente não encontrado')
      err.code = 'P2025'
      throw err
    }

    return await prisma.cliente.delete({ where: { id: parseInt(id) } })
  }

  static async delete(id) {
    return await prisma.cliente.delete({ where: { id: parseInt(id) } })
  }
}
