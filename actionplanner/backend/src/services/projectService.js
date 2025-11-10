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
        tasks: true
      }
    });
  }

  // Buscar projeto por ID
  static async findById(id) {
    return await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: true
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
        tasks: true
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
    if (status) where.status = status;

    Object.assign(where, otherFilters);

    const [projects, totalData] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: size,
        orderBy: { [orderBy.replace('-', '')]: orderBy.startsWith('-') ? 'desc' : 'asc' },
        include: {
          tasks: true
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
        tasks: true
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
      data: { status: 'inativo' },
      include: {
        tasks: true
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
        tasks: true
      }
    });
  }

  // Deletar projeto permanentemente (hard delete)
  static async delete(id) {
    const project = await prisma.project.findUnique({ 
      where: { id: parseInt(id) },
      include: {
        tasks: true
      }
    });
    
    if (!project) {
      const err = new Error('Projeto não encontrado');
      err.code = 'P2025';
      throw err;
    }

    // Verificar se há tarefas associadas
    if (project.tasks && project.tasks.length > 0) {
      const err = new Error('Não é possível excluir projeto com tarefas associadas');
      err.code = 'P2003';
      throw err;
    }

    return await prisma.project.delete({ 
      where: { id: parseInt(id) }
    });
  }

  // Contar tarefas de um projeto
  static async countTasks(id) {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });

    return project?._count?.tasks || 0;
  }

  // Obter estatísticas do projeto
  static async getStatistics(id) {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: {
          select: {
            status: true
          }
        }
      }
    });

    if (!project) return null;

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === 'concluida').length;
    const activeTasks = project.tasks.filter(t => 
      t.status !== 'cancelada' && t.status !== 'concluida'
    ).length;
    const canceledTasks = project.tasks.filter(t => t.status === 'cancelada').length;

    return {
      projectId: project.id,
      projectName: project.name,
      totalTasks,
      activeTasks,
      completedTasks,
      canceledTasks,
      completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : '0.00'
    };
  }
}

