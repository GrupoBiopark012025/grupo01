import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GetProjectDto, GetProjectQuery } from "./dtos";

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  private path = 'projects';

  private http = inject(HttpClient);

  getProjects(query?: GetProjectQuery): Observable<GetProjectDto[]> {
    const params = query ? { ...query } : {};
    return this.http.get<GetProjectDto[]>(this.path, { params });
  }

  getProjectById(id: number): Observable<GetProjectDto> {
    return this.http.get<GetProjectDto>(`${this.path}/${id}`);
  }
}

