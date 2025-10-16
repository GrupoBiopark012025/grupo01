import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setor } from './setor.model';

@Injectable({
  providedIn: 'root'
})
export class SetorDataService {
  readonly path = '/setor';

  private http = inject(HttpClient);

  create(setor: Omit<Setor, 'id'>): Observable<Setor> {
    return this.http.post<Setor>(`${this.path}`, setor);
  }

  findAll(): Observable<Setor[]> {
    return this.http.get<Setor[]>(`${this.path}`);
  }

  findById(id: number): Observable<Setor> {
    return this.http.get<Setor>(`${this.path}/${id}`);
  }

  update(id: number, setor: Partial<Setor>): Observable<Setor> {
    return this.http.put<Setor>(`${this.path}/${id}`, setor);
  }

  search(filters: {
    search?: string;
    status?: 'ATIVO' | 'INATIVO';
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
    
    return this.http.get<Setor[]>(url);
  }
}
