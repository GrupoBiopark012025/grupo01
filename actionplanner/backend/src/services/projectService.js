import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectService {
  
  // Criar novo projeto
  static async create(projectData) {
    return await prisma.project.create({
      data: {
        ...projectData,
        status: projectData.status || 'ATIVO'
      },
      include: {
        actionPlans: true
      }
    });
  }

  // Buscar projeto por ID
  static async findById(id) {
    return await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        actionPlans: true
      }
    });
  }

  // Buscar projeto por nome
  static async findByName(name) {
    return await prisma.project.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
      include: {
        actionPlans: true
      }
    });
  }

  // Verificar se projeto existe por nome
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

    const project = await prisma.project.findFirst({ where });
    return !!project;
  }

  // Listar projetos com filtros e paginação
  static async findMany(filters = {}, pagination = {}) {
    const { page = 1, size = 10, orderBy = 'name' } = pagination;
    const { name, description, status, ...otherFilters } = filters;

    const skip = (page - 1) * size;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (description) where.description = { contains: description, mode: 'insensitive' };
    if (status) where.status = status.toUpperCase();

    Object.assign(where, otherFilters);

    const [projects, totalData] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: size,
        orderBy: { [orderBy.replace('-', '')]: orderBy.startsWith('-') ? 'desc' : 'asc' },
        include: {
          actionPlans: true
        }
      }),
      prisma.project.count({ where })
    ]);

    const totalPages = Math.ceil(totalData / size);

    return {
      projects,
      totalData,
      totalPages,
      currentPage: page,
      size
    };
  }

  // Atualizar projeto
  static async update(id, projectData) {
    return await prisma.project.update({
      where: { id: parseInt(id) },
      data: projectData,
      include: {
        actionPlans: true
      }
    });
  }

  // Inativar projeto (soft delete)
  static async softDelete(id) {
    const project = await prisma.project.findUnique({ 
      where: { id: parseInt(id) }
    });
    
    if (!project) {
      const err = new Error('Projeto não encontrado');
      err.code = 'P2025';
      throw err;
    }

    return await prisma.project.update({
      where: { id: parseInt(id) },
      data: { status: 'INATIVO' },
      include: {
        actionPlans: true
      }
    });
  }

  // Ativar projeto
  static async activate(id) {
    const project = await prisma.project.findUnique({ 
      where: { id: parseInt(id) }
    });
    
    if (!project) {
      const err = new Error('Projeto não encontrado');
      err.code = 'P2025';
      throw err;
    }

    return await prisma.project.update({
      where: { id: parseInt(id) },
      data: { status: 'ATIVO' },
      include: {
        actionPlans: true
      }
    });
  }

  // Deletar projeto permanentemente (hard delete)
  static async delete(id) {
    const project = await prisma.project.findUnique({ 
      where: { id: parseInt(id) },
      include: {
        actionPlans: true
      }
    });
    
    if (!project) {
      const err = new Error('Projeto não encontrado');
      err.code = 'P2025';
      throw err;
    }

    // Verificar se há planos de ação associados
    if (project.actionPlans && project.actionPlans.length > 0) {
      const err = new Error('Não é possível excluir projeto com planos de ação associados');
      err.code = 'P2003';
      throw err;
    }

    return await prisma.project.delete({ 
      where: { id: parseInt(id) }
    });
  }

  // Contar planos de ação de um projeto
  static async countActionPlans(id) {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { actionPlans: true }
        }
      }
    });

    return project?._count?.actionPlans || 0;
  }

  // Obter estatísticas do projeto
  static async getStatistics(id) {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        actionPlans: {
          include: {
            tasks: {
              select: {
                status: true
              }
            }
          }
        }
      }
    });

    if (!project) return null;

    // Agregar todas as tarefas dos planos de ação
    const allTasks = project.actionPlans.flatMap(plan => plan.tasks);

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'CONCLUIDA').length;
    const activeTasks = allTasks.filter(t => 
      t.status !== 'CANCELADA' && t.status !== 'CONCLUIDA'
    ).length;
    const canceledTasks = allTasks.filter(t => t.status === 'CANCELADA').length;

    return {
      projectId: project.id,
      projectName: project.name,
      totalActionPlans: project.actionPlans.length,
      totalTasks,
      activeTasks,
      completedTasks,
      canceledTasks,
      completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : '0.00'
    };
  }
}