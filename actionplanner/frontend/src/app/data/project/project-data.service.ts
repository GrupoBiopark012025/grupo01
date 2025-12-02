import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ProjectDto,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectStatisticsDto,
  ProjectListResponseDto
} from './dto/project-dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  private readonly path = '/projects';
  private readonly http = inject(HttpClient);

  list(params?: {
    page?: number;
    size?: number;
    orderBy?: string;
    name?: string;
    status?: string;
  }) {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ProjectListResponseDto>(this.path, { params: httpParams });
  }

  // Alias para compatibilidade com action-plan
  getProjects(params?: { name?: string }) {
    return this.list(params).pipe(
      map(response => response.projects)
    );
  }

  getById(id: number) {
    return this.http.get<ProjectDto>(`${this.path}/${id}`);
  }

  getStatistics(id: number) {
    return this.http.get<ProjectStatisticsDto>(`${this.path}/${id}/statistics`);
  }

  create(data: CreateProjectDto) {
    return this.http.post<ProjectDto>(this.path, data);
  }

  update(id: number, data: UpdateProjectDto) {
    return this.http.put<ProjectDto>(`${this.path}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<ProjectDto>(`${this.path}/${id}`);
  }
}