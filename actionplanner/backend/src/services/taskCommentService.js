import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskCommentService {
  static async create(taskId, userId, content) {
    return await prisma.taskComment.create({
      data: {
        taskId: parseInt(taskId),
        userId: parseInt(userId),
        content
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

  static async getTaskComments(taskId) {
    return await prisma.taskComment.findMany({
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
        createdAt: 'asc'
      }
    });
  }

  static async delete(commentId, userId, isAdmin = false) {
    const comment = await prisma.taskComment.findUnique({
      where: { id: parseInt(commentId) }
    });

    if (!comment) {
      throw new Error('Comentário não encontrado');
    }

    // Só pode deletar se for admin ou o próprio autor
    if (!isAdmin && comment.userId !== userId) {
      throw new Error('Você só pode deletar seus próprios comentários');
    }

    return await prisma.taskComment.delete({
      where: { id: parseInt(commentId) }
    });
  }
}