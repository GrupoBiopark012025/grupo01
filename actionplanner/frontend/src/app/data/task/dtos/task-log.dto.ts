export interface TaskLogDto {
  id: number;
  taskId: number;
  userId: number;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
  createdAt: Date;
  user: {
    id: number;
    nome: string;
    email: string;
  };
}