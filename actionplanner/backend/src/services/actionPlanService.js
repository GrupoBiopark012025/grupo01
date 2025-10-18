import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ActionPlanService {
  static async findMany(filters = {}, pagination = {}) {
    const { page = 1, size = 10, _order = "id" } = pagination;
    const {
      projectId,
      numero,
      oQue,
      como,
      responsavel,
      status,
      inicio,
      fim,
      ...otherFilters
    } = filters;

    const where = {};

    // Filtros específicos para planos de ação
    if (projectId) {
      where.projectId = parseInt(projectId);
    }
    if (numero) {
      where.numero = { contains: numero, mode: "insensitive" };
    }
    if (oQue) {
      where.oQue = { contains: oQue, mode: "insensitive" };
    }
    if (como) {
      where.como = { contains: como, mode: "insensitive" };
    }
    if (responsavel) {
      where.responsavel = { contains: responsavel, mode: "insensitive" };
    }
    if (status) {
      where.status = status;
    }
    if (inicio) {
      where.inicio = { gte: new Date(inicio) };
    }
    if (fim) {
      where.fim = { lte: new Date(fim) };
    }

    Object.assign(where, otherFilters);

    const skip = (page - 1) * size;

    const [actionPlans, totalData] = await Promise.all([
      prisma.actionPlan.findMany({
        where,
        skip,
        take: size,
        orderBy: {
          [_order.replace("-", "")]: _order.startsWith("-") ? "desc" : "asc",
        },
        include: {
          project: true,
          tasks: {
            include: {
              cliente: true,
              sector: true,
              userResponsible: true,
              userCreated: true,
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
      }),
      prisma.actionPlan.count({ where }),
    ]);

    // Adicionar métricas para cada plano de ação
    const actionPlansWithMetrics = actionPlans.map(actionPlan => {
      const tasks = actionPlan.tasks;
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'CONCLUIDA').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...actionPlan,
        totalTasks,
        completedTasks,
        progress
      };
    });

    const totalPages = Math.ceil(totalData / size);

    return {
      actionPlans: actionPlansWithMetrics,
      totalData,
      totalPages,
      currentPage: page,
      size,
    };
  }

  static async findById(id) {
    return await prisma.actionPlan.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: true,
        tasks: {
          include: {
            cliente: true,
            sector: true,
            userResponsible: true,
            userCreated: true,
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
  }

  static async create(actionPlanData) {
    return await prisma.actionPlan.create({
      data: {
        ...actionPlanData
      },
      include: {
        project: true,
        tasks: {
          include: {
            cliente: true,
            sector: true,
            userResponsible: true,
            userCreated: true,
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
  }

  static async update(id, actionPlanData) {
    return await prisma.actionPlan.update({
      where: { id: parseInt(id) },
      data: actionPlanData,
      include: {
        project: true,
        tasks: {
          include: {
            cliente: true,
            sector: true,
            userResponsible: true,
            userCreated: true,
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
  }

  static async inactive(id) {
    return await prisma.$transaction(async (tx) => {
      // Atualizar todas as tarefas relacionadas para CANCELADA
      await tx.task.updateMany({
        where: { actionPlanId: parseInt(id) },
        data: { status: 'CANCELADA' }
      });

      // Atualizar o plano de ação para CANCELADO
      return await tx.actionPlan.update({
        where: { id: parseInt(id) },
        data: { status: 'CANCELADO' },
        include: {
          project: true,
          tasks: {
            include: {
              cliente: true,
              sector: true,
              userResponsible: true,
              userCreated: true,
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });
    });
  }
}
