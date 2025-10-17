import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Setor, SetorApiResponse } from './setor.model';

@Injectable({
  providedIn: 'root'
})
export class SetorDataService {
  readonly path = 'api/sectors';

  private http = inject(HttpClient);

  create(setor: Omit<Setor, 'id' | 'createdAt' | 'updatedAt'>): Observable<Setor> {
    return this.http.post<Setor>(`${this.path}`, setor);
  }

  findAll(): Observable<Setor[]> {
    return this.http.get<SetorApiResponse>(`${this.path}`).pipe(
      map(response => response.sectors)
    );
  }

  findById(id: number): Observable<Setor> {
    return this.http.get<Setor>(`${this.path}/${id}`);
  }

  update(id: number, setor: Partial<Setor>): Observable<Setor> {
    return this.http.put<Setor>(`${this.path}/${id}`, setor);
  }

  search(filters: {
    search?: string;
    status?: 'ativo' | 'inativo';
    page?: number;
    limit?: number;
  }): Observable<Setor[]> {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `${this.path}?${queryString}` : this.path;
    
    return this.http.get<SetorApiResponse>(url).pipe(
      map(response => response.sectors)
    );
  }
}
