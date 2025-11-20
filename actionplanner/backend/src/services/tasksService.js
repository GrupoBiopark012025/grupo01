import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TasksService {
  static async create(taskData, userCreatedId) {
    return await prisma.task.create({
      data: {
        ...taskData,
        userCreatedId
      },
      include: {
        project: true,
        cliente: true,
        sector: true,
        userResponsible: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
        userCreated: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
      },
    });
  }

  static async findById(id, userId = null, onlyAttachedTasks = false) {
    const where = { id: parseInt(id) };
    
    // Se o usuário só pode ver tarefas atribuídas a ele
    if (onlyAttachedTasks && userId) {
      where.userResponsibleId = userId;
    }
    
    return await prisma.task.findUnique({
      where,
      include: {
        project: true,
        cliente: true,
        sector: true,
        userResponsible: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
        userCreated: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
      },
    });
  }

  static async findMany(filters = {}, pagination = {}, userId = null, onlyAttachedTasks = false, currentClienteId = null) {
    const { page = 1, size = 10, _order = "id" } = pagination;
    const {
      title,
      status,
      priority,
      dueDate,
      projectId,
      clienteId,
      sectorId,
      userResponsibleId,
      userCreatedId,
      ...otherFilters
    } = filters;
    const where = {};

    // Filtro obrigatório: só exibir tarefas do cliente atual do usuário
    if (currentClienteId) {
      where.clienteId = currentClienteId;
    }

    // Se o usuário só pode ver tarefas atribuídas a ele
    if (onlyAttachedTasks && userId) {
      where.userResponsibleId = userId;
    }

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (dueDate) {
      where.dueDate = new Date(dueDate);
    }
    if (projectId) {
      where.projectId = parseInt(projectId);
    }
    if (clienteId && !currentClienteId) {
      where.clienteId = parseInt(clienteId);
    }
    if (sectorId) {
      where.sectorId = parseInt(sectorId);
    }
    if (userResponsibleId && !onlyAttachedTasks) {
      where.userResponsibleId = parseInt(userResponsibleId);
    }
    if (userCreatedId) {
      where.userCreatedId = parseInt(userCreatedId);
    }

    Object.assign(where, otherFilters);

    const skip = (page - 1) * size;
    const [tasks, totalData] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: size,
        orderBy: {
          [_order.replace("-", "")]: _order.startsWith("-") ? "desc" : "asc",
        },
        include: {
          cliente: true,
          sector: true,
          project: true,
          userResponsible: {
            select: {
              id: true,
              nome: true,
              email: true,
            }
          },
          userCreated: {
            select: {
              id: true,
              nome: true,
              email: true,
            }
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(totalData / size);

    return {
      tasks,
      totalData,
      totalPages,
      currentPage: page,
      size,
    };
  }

  static async update(id, taskData, userId = null, onlyAttachedTasks = false) {
    // Se o usuário só pode editar tarefas atribuídas a ele, verifica se é responsável
    if (onlyAttachedTasks && userId) {
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
        select: { userResponsibleId: true }
      });
      
      if (!task || task.userResponsibleId !== userId) {
        throw new Error('Você só pode editar tarefas das quais é responsável');
      }
    }
    
    return await prisma.task.update({
      where: { id: parseInt(id) },
      data: taskData,
      include: {
        project: true,
        cliente: true,
        sector: true,
        userResponsible: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
        userCreated: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
      },
    });
  }

  static async delete(id, userId = null, onlyAttachedTasks = false, isAdmin = false) {
    // Apenas admins podem deletar tarefas ou usuários que sejam responsáveis (se onlyAttachedTasks)
    if (!isAdmin && onlyAttachedTasks && userId) {
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
        select: { userResponsibleId: true }
      });
      
      if (!task || task.userResponsibleId !== userId) {
        throw new Error('Você só pode deletar tarefas das quais é responsável');
      }
    }
    
    return await prisma.task.delete({
      where: { id: parseInt(id) },
    });
  }

  // Buscar usuários disponíveis para serem responsáveis por uma tarefa
  static async getAvailableResponsibles(clienteId) {
    return await prisma.user.findMany({
      where: {
        OR: [
          { clienteId: parseInt(clienteId) },
          {
            userClientes: {
              some: {
                clienteId: parseInt(clienteId)
              }
            }
          }
        ],
        status: 'ATIVO'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        accessLevel: true,
      },
      orderBy: {
        nome: 'asc'
      }
    });
  }
}
