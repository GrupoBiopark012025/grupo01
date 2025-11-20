import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ApiPaginatedList, PaginationQuery } from '@data/common/dtos'
import { GetClientsDto } from '@data/clients/dtos'

@Injectable({
  providedIn: 'root'
})
export class ClientsDataService {
  private path = 'clients'
  private http = inject(HttpClient)
  
  getClients(query: PaginationQuery) {
    return this.http.get<ApiPaginatedList<GetClientsDto>>(this.path, { params: { ...query } })
  }

  getClientById(id: number) {
    return this.http.get<GetClientsDto>(`${this.path}/${id}`)
  }

  createClient(data: Partial<GetClientsDto>) {
    return this.http.post<GetClientsDto>(this.path, data)
  }

  updateClient(id: number, data: Partial<GetClientsDto>) {
    return this.http.put<GetClientsDto>(`${this.path}/${id}`, data)
  }

  deleteClient(id: number) {
    return this.http.delete<void>(`${this.path}/${id}`)
  }
}
