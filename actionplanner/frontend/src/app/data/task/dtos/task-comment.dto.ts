export interface TaskCommentDto {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface CreateTaskCommentDto {
  content: string;
}