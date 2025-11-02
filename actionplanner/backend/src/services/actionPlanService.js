import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ActionPlanService {
  static getOrderBy(_order = "id") {
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

    const orderField = _order.replace("-", "");
    const fieldName = fieldMap[orderField] || "id";
    const direction = _order.startsWith("-") ? "desc" : "asc";

    return {
      [fieldName]: direction
    };
  }

  static async findMany(filters = {}, pagination = {}) {
    const { page = 1, size = 10, _order = "id" } = pagination;
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
          projectId: parseInt(projectId)
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
        orderBy: this.getOrderBy(_order),
        include: {
          projects: {
            include: {
              project: true
            }
          },
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
        projects: actionPlan.projects?.map(ap => ap.project) || [],
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
        projects: {
          include: {
            project: true
          }
        },
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

    return {
      ...actionPlan,
      projects: actionPlan.projects?.map(ap => ap.project) || []
    };
  }

  static async create(actionPlanData) {
    const { projectIds, ...data } = actionPlanData;
    
    const actionPlan = await prisma.actionPlan.create({
      data: {
        ...data,
        projects: projectIds && projectIds.length > 0 ? {
          create: projectIds.map(projectId => ({
            projectId: parseInt(projectId)
          }))
        } : undefined
      },
      include: {
        projects: {
          include: {
            project: true
          }
        },
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

    return {
      ...actionPlan,
      projects: actionPlan.projects?.map(ap => ap.project) || []
    };
  }

  static async update(id, actionPlanData) {
    const { projectIds, ...data } = actionPlanData;
    
    return await prisma.$transaction(async (tx) => {
      // Se projectIds foi fornecido, atualizar os relacionamentos
      if (projectIds !== undefined) {
        // Remover todos os relacionamentos existentes
        await tx.actionPlanProject.deleteMany({
          where: { actionPlanId: parseInt(id) }
        });
        
        // Criar novos relacionamentos se houver projectIds
        if (projectIds && projectIds.length > 0) {
          await tx.actionPlanProject.createMany({
            data: projectIds.map(projectId => ({
              actionPlanId: parseInt(id),
              projectId: parseInt(projectId)
            }))
          });
        }
      }
      
      // Atualizar o plano de ação
      const updatedActionPlan = await tx.actionPlan.update({
        where: { id: parseInt(id) },
        data,
        include: {
          projects: {
            include: {
              project: true
            }
          },
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

      return {
        ...updatedActionPlan,
        projects: updatedActionPlan.projects?.map(ap => ap.project) || []
      };
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
          projects: {
            include: {
              project: true
            }
          },
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

      return {
        ...inactivatedActionPlan,
        projects: inactivatedActionPlan.projects?.map(ap => ap.project) || []
      };
    });
  }
}
