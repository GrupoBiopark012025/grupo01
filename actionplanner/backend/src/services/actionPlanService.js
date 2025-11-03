import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ActionPlanService {
  static getOrderBy(orderBy = "id") {
    const fieldMap = {
      id: "id",
      numero: "number",
      number: "number",
      oQue: "what",
      what: "what",
      como: "how",
      how: "how",
      responsavel: "responsible",
      responsible: "responsible",
      inicio: "startDate",
      startDate: "startDate",
      fim: "endDate",
      endDate: "endDate",
      dataProrrogada: "postponedDate",
      postponedDate: "postponedDate",
      status: "status",
      observacoes: "observations",
      observations: "observations",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };

    const orderField = orderBy.replace("-", "");
    const fieldName = fieldMap[orderField] || "id";
    const direction = orderBy.startsWith("-") ? "desc" : "asc";

    return {
      [fieldName]: direction
    };
  }

  static async findMany(filters = {}, pagination = {}) {
    const { page = 1, size = 10, orderBy = "id" } = pagination;
    const {
      projectId,
      number,
      what,
      how,
      responsible,
      status,
      startDate,
      endDate,
      ...otherFilters
    } = filters;

    const where = {};

    if (projectId) {
      where.projects = {
        some: {
          id: parseInt(projectId)
        }
      };
    }
    if (number) {
      where.number = { contains: number, mode: "insensitive" };
    }
    if (what) {
      where.what = { contains: what, mode: "insensitive" };
    }
    if (how) {
      where.how = { contains: how, mode: "insensitive" };
    }
    if (responsible) {
      where.responsible = { contains: responsible, mode: "insensitive" };
    }
    if (status) {
      where.status = status;
    }
    if (startDate) {
      where.startDate = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.endDate = { lte: new Date(endDate) };
    }

    Object.assign(where, otherFilters);

    const skip = (page - 1) * size;

    const [actionPlans, totalData] = await Promise.all([
      prisma.actionPlan.findMany({
        where,
        skip,
        take: size,
        orderBy: this.getOrderBy(orderBy),
        include: {
          projects: true,
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

    // Adicionar métricas para cada plano de ação e transformar projetos
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
    const actionPlan = await prisma.actionPlan.findUnique({
      where: { id: parseInt(id) },
      include: {
        projects: true,
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

    if (!actionPlan) return null;

    return actionPlan;
  }

  static async create(actionPlanData) {
    const { projectIds, ...data } = actionPlanData;
    
    return await prisma.$transaction(async (tx) => {
      // Criar o plano de ação
      const actionPlan = await tx.actionPlan.create({
        data,
        include: {
          projects: true,
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

      // Se projectIds foi fornecido, vincular os projetos ao plano de ação
      if (projectIds && projectIds.length > 0) {
        await tx.project.updateMany({
          where: {
            id: { in: projectIds.map(id => parseInt(id)) }
          },
          data: {
            actionPlanId: actionPlan.id
          }
        });
      }

      // Buscar o plano de ação atualizado com os projetos vinculados
      return await tx.actionPlan.findUnique({
        where: { id: actionPlan.id },
        include: {
          projects: true,
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

  static async update(id, actionPlanData) {
    const { projectIds, ...data } = actionPlanData;
    
    return await prisma.$transaction(async (tx) => {
      // Atualizar o plano de ação
      await tx.actionPlan.update({
        where: { id: parseInt(id) },
        data
      });

      // Se projectIds foi fornecido, atualizar os relacionamentos
      if (projectIds !== undefined) {
        // Remover a vinculação de todos os projetos que estavam vinculados a este plano
        await tx.project.updateMany({
          where: { actionPlanId: parseInt(id) },
          data: { actionPlanId: null }
        });
        
        // Vincular os novos projetos se houver projectIds
        if (projectIds && projectIds.length > 0) {
          await tx.project.updateMany({
            where: {
              id: { in: projectIds.map(projectId => parseInt(projectId)) }
            },
            data: {
              actionPlanId: parseInt(id)
            }
          });
        }
      }
      
      // Buscar o plano de ação atualizado
      const updatedActionPlan = await tx.actionPlan.findUnique({
        where: { id: parseInt(id) },
        include: {
          projects: true,
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

      return updatedActionPlan;
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
      const inactivatedActionPlan = await tx.actionPlan.update({
        where: { id: parseInt(id) },
        data: { status: 'CANCELADO' },
        include: {
          projects: true,
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

      return inactivatedActionPlan;
    });
  }
}
