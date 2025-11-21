import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiPaginatedList } from '@data/common/dtos';
import { GetTaskDto, GetTaskQuery, GetTaskDataDto } from './dtos';
import { TaskLogDto } from './dtos/task-log.dto';
import { TaskCommentDto } from './dtos/task-comment.dto';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  getTasks(query: GetTaskQuery): Observable<ApiPaginatedList<GetTaskDto>> {
    return this.http.get<any>(this.baseUrl, {
      params: { ...query as any }
    }).pipe(
      map(response => ({
        data: response.tasks || [],
        totalPages: response.totalPages,
        totalData: response.totalData,
        currentPage: response.currentPage,
        page: response.currentPage,
        size: response.size
      }) as ApiPaginatedList<GetTaskDto>)
    );
  }

  getTaskById(id: number): Observable<GetTaskDto> {
    return this.http.get<GetTaskDto>(`${this.baseUrl}/${id}`);
  }

  createTask(task: Partial<GetTaskDto>): Observable<GetTaskDto> {
    return this.http.post<GetTaskDto>(this.baseUrl, task);
  }

  updateTask(id: number, task: Partial<GetTaskDto>): Observable<GetTaskDto> {
    return this.http.put<GetTaskDto>(`${this.baseUrl}/${id}`, task);
  }

  updateTaskStatus(id: number, status: string): Observable<GetTaskDto> {
    return this.http.put<GetTaskDto>(`${this.baseUrl}/${id}/status`, { status })
      .pipe(
        tap((response) => {
          console.log('Status da tarefa atualizado:', response);
        })
      );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAvailableResponsibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/available-responsibles`);
  }

  getTaskData(): Observable<GetTaskDataDto> {
    return this.http.get<GetTaskDataDto>(`${this.baseUrl}/data`);
  }

  getMyTasks(query: GetTaskQuery): Observable<ApiPaginatedList<GetTaskDto>> {
    return this.http.get<any>(`${this.baseUrl}/my-tasks`, {
      params: { ...query as any }
    }).pipe(
      map(response => ({
        data: response.tasks || [],
        totalPages: response.totalPages,
        totalData: response.totalData,
        currentPage: response.currentPage,
        page: response.currentPage,
        size: response.size
      }) as ApiPaginatedList<GetTaskDto>)
    );
  }

  getAvailableActionPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/available-action-plans`);
  }

  addComment(taskId: number, dto: { content: string }): Observable<TaskCommentDto> {
    return this.http.post<TaskCommentDto>(`${this.baseUrl}/${taskId}/comments`, dto);
  }

}