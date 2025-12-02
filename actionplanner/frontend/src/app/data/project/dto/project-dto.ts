export interface ProjectDto {
  id: number;
  name: string;
  description: string | null;
  status: 'ATIVO' | 'INATIVO';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: 'ATIVO' | 'INATIVO';
}

export interface ProjectStatisticsDto {
  projectId: number;
  projectName: string;
  totalActionPlans: number;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  canceledTasks: number;
  completionRate: string;
}

export interface ProjectListResponseDto {
  projects: ProjectDto[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  size: number;
}