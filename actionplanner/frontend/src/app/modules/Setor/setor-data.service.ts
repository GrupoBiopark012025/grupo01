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
    return this.http.post<any>(`${this.path}`, setor).pipe(
      map(response => {
        console.log('📊 [CREATE] Estrutura da resposta da API:', response);
        
        // Verificar se a resposta tem uma estrutura específica
        let setorCriado: Setor;
        
        if (response.data) {
          setorCriado = response.data;
          console.log('✅ [CREATE] Setor criado (response.data):', setorCriado);
        } else if (response.sector) {
          setorCriado = response.sector;
          console.log('✅ [CREATE] Setor criado (response.sector):', setorCriado);
        } else {
          setorCriado = response;
          console.log('✅ [CREATE] Setor criado (resposta direta):', setorCriado);
        }
        
        return setorCriado;
      })
    );
  }

  findAll(): Observable<Setor[]> {
    return this.http.get<SetorApiResponse>(`${this.path}`).pipe(
      map(response => {
        console.log('📊 [LIST] Estrutura da resposta da API:', response);
        console.log('📋 [LIST] Setores encontrados:', response.data?.length || 0);
        return response.data;
      })
    );
  }

  findById(id: number): Observable<Setor> {
    return this.http.get<any>(`${this.path}/${id}`).pipe(
      map(response => {
        console.log('📊 [EDIT] Estrutura da resposta da API:', response);
        
        // Verificar se a resposta tem uma estrutura específica
        let setorEncontrado: Setor;
        
        if (response.data) {
          setorEncontrado = response.data;
          console.log('✅ [EDIT] Setor carregado (response.data):', setorEncontrado);
        } else if (response.sector) {
          setorEncontrado = response.sector;
          console.log('✅ [EDIT] Setor carregado (response.sector):', setorEncontrado);
        } else {
          setorEncontrado = response;
          console.log('✅ [EDIT] Setor carregado (resposta direta):', setorEncontrado);
        }
        
        return setorEncontrado;
      })
    );
  }

  update(id: number, setor: Partial<Setor>): Observable<Setor> {
    return this.http.put<any>(`${this.path}/${id}`, setor).pipe(
      map(response => {
        console.log('📊 [UPDATE] Estrutura da resposta da API:', response);
        
        // Verificar se a resposta tem uma estrutura específica
        let setorAtualizado: Setor;
        
        if (response.data) {
          setorAtualizado = response.data;
          console.log('✅ [UPDATE] Setor atualizado (response.data):', setorAtualizado);
        } else if (response.sector) {
          setorAtualizado = response.sector;
          console.log('✅ [UPDATE] Setor atualizado (response.sector):', setorAtualizado);
        } else {
          setorAtualizado = response;
          console.log('✅ [UPDATE] Setor atualizado (resposta direta):', setorAtualizado);
        }
        
        return setorAtualizado;
      })
    );
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
      map(response => {
        console.log('📊 [SEARCH] Estrutura da resposta da API:', response);
        console.log('📋 [SEARCH] Setores encontrados:', response.data?.length || 0);
        return response.data;
      })
    );
  }
}
