import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TasksService {
  static async create(taskData, userCreatedId) {
    return await prisma.task.create({
      data: {
        ...taskData,
        userCreatedId,
      },
      include: {
        actionPlan: {
          include: {
            project: true,
          },
        },
        cliente: true,
        sector: true,
        userResponsible: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        userCreated: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        logs: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  static async findById(id, userId = null, onlyAttachedTasks = false) {
    const where = { id: parseInt(id) };

    if (onlyAttachedTasks && userId) {
      where.userResponsibleId = userId;
    }

    return await prisma.task.findUnique({
      where,
      include: {
        actionPlan: {
          include: {
            project: true,
          },
        },
        cliente: true,
        sector: true,
        userResponsible: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        userCreated: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        logs: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  // ✅ CORRIGINDO O NOME DO MÉTODO
  static async updateTask(id, updateData, userId = null, onlyAttachedTasks = false) {
    const where = { id: parseInt(id) };

    // Se for um usuário restrito, só pode editar tarefas que é responsável
    if (onlyAttachedTasks && userId) {
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
        select: { userResponsibleId: true },
      });

      if (!task || task.userResponsibleId !== userId) {
        throw new Error("Você só pode editar tarefas das quais é responsável");
      }
    }

    return await prisma.task.update({
      where,
      data: updateData,
      include: {
        actionPlan: {
          include: {
            project: true,
          },
        },
        cliente: true,
        sector: true,
        userResponsible: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        userCreated: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        logs: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  static async findMany(
    filters = {},
    pagination = {},
    userId = null,
    onlyAttachedTasks = false,
    currentClienteId = null
  ) {
    const { page = 1, size = 10, _order = "id" } = pagination;
    const {
      title,
      status,
      priority,
      dueDate,
      actionPlanId,
      clienteId,
      sectorId,
      userResponsibleId,
      userCreatedId,
      ...otherFilters
    } = filters;
    const where = {};

    if (currentClienteId) {
      where.clienteId = currentClienteId;
    }

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
    if (actionPlanId) {
      where.actionPlanId = parseInt(actionPlanId);
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
          actionPlan: {
            include: {
              project: true,
            },
          },
          userResponsible: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          userCreated: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
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

  static async delete(
    id,
    userId = null,
    onlyAttachedTasks = false,
    isAdmin = false
  ) {
    if (!isAdmin && onlyAttachedTasks && userId) {
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
        select: { userResponsibleId: true },
      });

      if (!task || task.userResponsibleId !== userId) {
        throw new Error("Você só pode deletar tarefas das quais é responsável");
      }
    }

    return await prisma.task.delete({
      where: { id: parseInt(id) },
    });
  }

  static async getAvailableResponsibles(clienteId) {
    return await prisma.user.findMany({
      where: {
        OR: [
          { clienteId: parseInt(clienteId) },
          {
            userClientes: {
              some: {
                clienteId: parseInt(clienteId),
              },
            },
          },
        ],
        status: "ATIVO",
      },
      select: {
        id: true,
        nome: true,
        email: true,
        accessLevel: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  static async getAvailableActionPlans(clienteId) {
    return await prisma.actionPlan.findMany({
      where: {
        clienteId: parseInt(clienteId),
        status: {
          not: "CANCELADO",
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        number: "asc",
      },
    });
  }
}