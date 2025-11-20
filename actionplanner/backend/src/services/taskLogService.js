import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskLogService {
  static async createLog({
    taskId,
    userId,
    action,
    field = null,
    oldValue = null,
    newValue = null,
    description
  }) {
    return await prisma.taskLog.create({
      data: {
        taskId: parseInt(taskId),
        userId: parseInt(userId),
        action,
        field,
        oldValue: oldValue ? String(oldValue) : null,
        newValue: newValue ? String(newValue) : null,
        description
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  }

  static async getTaskLogs(taskId) {
    return await prisma.taskLog.findMany({
      where: { taskId: parseInt(taskId) },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}