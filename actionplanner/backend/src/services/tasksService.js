import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class TasksService {
static async create(taskData) {
  return await prisma.task.create({
    data: {
      ...taskData
    }
  });
}

  static async findById(id) {
    return await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: true,
        cliente: true,
        sector: true,
        userResponsible: true,
        userCreated: true,
      },
    });
  }

  static async findMany(filters = {}, pagination = {}) {
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
    if (clienteId) {
      where.clienteId = parseInt(clienteId);
    }
    if (sectorId) {
      where.sectorId = parseInt(sectorId);
    }
    if (userResponsibleId) {
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
          userResponsible: true,
          userCreated: true,
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

  static async update(id, taskData) {
    return await prisma.task.update({
      where: { id: parseInt(id) },
      data: taskData,
      include: {
        project: true,
        cliente: true,
        sector: true,
        userResponsible: true,
        userCreated: true,
      },
    });
  }

  static async delete(id) {
    return await prisma.task.delete({
      where: { id: parseInt(id) },
    });
  }
}
