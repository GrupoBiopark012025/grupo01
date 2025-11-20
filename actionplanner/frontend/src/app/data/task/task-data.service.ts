import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";
import { GetTaskDto } from "./dtos";

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  private path = 'tasks';

  private http = inject(HttpClient);

  getTaskById(id: number): Observable<GetTaskDto> {
    return this.http.get<GetTaskDto>(`${this.path}/${id}`)
      .pipe(
        tap((response) => {
          console.log('Resposta da tarefa por ID:', response);
        }),
        map((response) => response)
      );
  }

  updateTaskStatus(id: number, status: string): Observable<GetTaskDto> {
    return this.http.put<GetTaskDto>(`${this.path}/${id}`, { status })
      .pipe(
        tap((response) => {
          console.log('Status da tarefa atualizado:', response);
        })
      );
  }
}

