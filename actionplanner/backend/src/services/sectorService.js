import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SectorService {
  
  // Criar novo setor
  static async create(sectorData) {
    return await prisma.sector.create({
      data: {
        ...sectorData,
      },
      include: {
        tasks: true
      }
    });
  }

  // Buscar setor por ID
  static async findById(id) {
    return await prisma.sector.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: true
      }
    });
  }

  // Buscar setor por nome
  static async findByName(name) {
    return await prisma.sector.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
      include: {
        tasks: true
      }
    });
  }

  // Buscar setor por sigla
  static async findByAcronym(acronym) {
    return await prisma.sector.findFirst({
      where: { 
        acronym: {
          equals: acronym,
          mode: 'insensitive'
        }
      },
      include: {
        tasks: true
      }
    });
  }

  // Listar apenas setores ativos
  static async findActiveOnly(pagination = {}) {
    return await this.findMany({ status: 'ativo' }, pagination);
  }

  // Atualizar setor
  static async update(id, sectorData) {
    return await prisma.sector.update({
      where: { id: parseInt(id) },
      data: sectorData,
      include: {
        tasks: true
      }
    });
  }

  // Verificar se setor existe por nome
  static async existsByName(name, excludeId = null) {
    const where = {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    };

    if (excludeId) {
      where.id = { not: parseInt(excludeId) };
    }

    const sector = await prisma.sector.findFirst({ where });
    return !!sector;
  }

  // Verificar se setor existe por sigla
  static async existsByAcronym(acronym, excludeId = null) {
    const where = {
      acronym: {
        equals: acronym,
        mode: 'insensitive'
      }
    };

    if (excludeId) {
      where.id = { not: parseInt(excludeId) };
    }

    const sector = await prisma.sector.findFirst({ where });
    return !!sector;
  }

  // Listar setores com filtros e paginação
  static async findMany(filters = {}, pagination = {}) {
    const { page = 1, size = 10, orderBy = 'name' } = pagination;
    const { name, acronym, status, color, ...otherFilters } = filters;

    const skip = (page - 1) * size;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (acronym) where.acronym = { contains: acronym, mode: 'insensitive' };
    if (status) where.status = status;
    if (color) where.color = { contains: color, mode: 'insensitive' };

    Object.assign(where, otherFilters);

    const [sectors, totalData] = await Promise.all([
      prisma.sector.findMany({
        where,
        skip,
        take: size,
        orderBy: { [orderBy.replace('-', '')]: orderBy.startsWith('-') ? 'desc' : 'asc' },
        include: {
          tasks: true
        }
      }),
      prisma.sector.count({ where })
    ]);

    const totalPages = Math.ceil(totalData / size);

    return {
      sectors,
      totalData,
      totalPages,
      currentPage: page,
      size
    };
  }

  // Contar tarefas de um setor
  static async countTasks(id) {
    const sector = await prisma.sector.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });

    return sector?._count?.tasks || 0;
  }

  // Contar tarefas ativas de um setor
  static async countActiveTasks(id) {
    return await prisma.task.count({
      where: {
        sectorId: parseInt(id),
        status: {
          notIn: ['cancelada', 'concluida']
        }
      }
    });
  }

  // Obter estatísticas do setor
  static async getStatistics(id) {
    const sector = await prisma.sector.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: {
          select: {
            status: true
          }
        }
      }
    });

    if (!sector) return null;

    const totalTasks = sector.tasks.length;
    const completedTasks = sector.tasks.filter(t => t.status === 'concluida').length;
    const activeTasks = sector.tasks.filter(t => 
      t.status !== 'cancelada' && t.status !== 'concluida'
    ).length;
    const canceledTasks = sector.tasks.filter(t => t.status === 'cancelada').length;

    return {
      sectorId: sector.id,
      sectorName: sector.name,
      totalTasks,
      activeTasks,
      completedTasks,
      canceledTasks,
      completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0
    };
  }

  // Listar setores com contagem de tarefas
  static async findManyWithTaskCount(filters = {}, pagination = {}) {
    const result = await this.findMany(filters, pagination);
    
    const sectorsWithCount = await Promise.all(
      result.sectors.map(async (sector) => {
        const taskCount = await this.countTasks(sector.id);
        const activeTaskCount = await this.countActiveTasks(sector.id);
        
        return {
          ...sector,
          taskCount,
          activeTaskCount,
          canBeDeleted: activeTaskCount === 0
        };
      })
    );

    return {
      ...result,
      sectors: sectorsWithCount
    };
  }
}