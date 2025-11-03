import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ApiPaginatedList } from '@data/common/dtos'
import { GetClientsDto, GetClientsQuery } from '@data/clients/dtos'

@Injectable({
  providedIn: 'root'
})
export class ClientsDataService {
  private path = 'clients'
  private http = inject(HttpClient)

  getClients(query: GetClientsQuery) {
    return this.http.get<ApiPaginatedList<GetClientsDto>>(this.path, { params: { ...query } })
  }

  getClientById(id: string) {
    return this.http.get<GetClientsDto>(`${this.path}/${id}`)
  }

  createClient(data: Partial<GetClientsDto>) {
    return this.http.post<GetClientsDto>(this.path, data)
  }

  updateClient(id: string, data: Partial<GetClientsDto>) {
    return this.http.put<GetClientsDto>(`${this.path}/${id}`, data)
  }

  deleteClient(id: string) {
    return this.http.delete<void>(`${this.path}/${id}`)
  }
}
