import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiPaginatedList } from '@data/common/dtos';
import { GetTaskDto, GetTaskQuery, GetTaskDataDto } from './dtos';

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

  // Os outros métodos permanecem inalterados
  getTaskById(id: number): Observable<GetTaskDto> {
    return this.http.get<GetTaskDto>(`${this.baseUrl}/${id}`);
  }

  createTask(task: Partial<GetTaskDto>): Observable<GetTaskDto> {
    return this.http.post<GetTaskDto>(this.baseUrl, task);
  }

  updateTask(id: number, task: Partial<GetTaskDto>): Observable<GetTaskDto> {
    return this.http.put<GetTaskDto>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
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
}