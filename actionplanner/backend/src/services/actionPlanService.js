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
      updatedAt: "updatedAt",
    };

    const orderField = orderBy.replace("-", "");
    const fieldName = fieldMap[orderField] || "id";
    const direction = orderBy.startsWith("-") ? "desc" : "asc";

    return {
      [fieldName]: direction,
    };
  }

  static async findMany(filters = {}, pagination = {}, clienteId = null) {
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

    if (clienteId) {
      where.clienteId = clienteId;
    }

    if (projectId) {
      where.projectId = parseInt(projectId);
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
          project: true,
          cliente: {
            select: {
              id: true,
              nome: true,
              cnpj: true,
            },
          },
          tasks: {
            include: {
              cliente: true,
              sector: true,
              userResponsible: true,
              userCreated: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      }),
      prisma.actionPlan.count({ where }),
    ]);

    const actionPlansWithMetrics = actionPlans.map((actionPlan) => {
      const tasks = actionPlan.tasks;
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(
        (task) => task.status === "CONCLUIDA"
      ).length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...actionPlan,
        totalTasks,
        completedTasks,
        progress,
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
        project: true,
        cliente: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
          },
        },
        tasks: {
          include: {
            cliente: true,
            sector: true,
            userResponsible: true,
            userCreated: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!actionPlan) return null;

    return actionPlan;
  }

  static async create(actionPlanData) {
    const { projectId, clienteId, ...data } = actionPlanData;

    return await prisma.actionPlan.create({
      data: {
        ...data,
        clienteId: parseInt(clienteId),
        projectId: projectId ? parseInt(projectId) : null,
      },
      include: {
        project: true,
        cliente: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
          },
        },
        tasks: {
          include: {
            cliente: true,
            sector: true,
            userResponsible: true,
            userCreated: true,
          },
        },
      },
    });
  }

  static async update(id, actionPlanData) {
    const { projectId, ...data } = actionPlanData;

    return await prisma.actionPlan.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        projectId: projectId ? parseInt(projectId) : null,
      },
      include: {
        project: true,
        cliente: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
          },
        },
        tasks: {
          include: {
            cliente: true,
            sector: true,
            userResponsible: true,
            userCreated: true,
          },
        },
      },
    });
  }

  static async inactive(id) {
    return await prisma.$transaction(async (tx) => {
      // Atualizar todas as tarefas relacionadas para CANCELADA
      await tx.task.updateMany({
        where: { actionPlanId: parseInt(id) },
        data: { status: "CANCELADA" },
      });

      // Atualizar o plano de ação para CANCELADO
      const inactivatedActionPlan = await tx.actionPlan.update({
        where: { id: parseInt(id) },
        data: { status: "CANCELADO" },
        include: {
          project: true,
          cliente: {
            select: {
              id: true,
              nome: true,
              cnpj: true,
            },
          },
          tasks: {
            include: {
              cliente: true,
              sector: true,
              userResponsible: true,
              userCreated: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      return inactivatedActionPlan;
    });
  }
}
