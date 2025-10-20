import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GetClientDto, GetClientQuery } from "@data/client/dtos";
import { ApiPaginatedList } from "@data/common/dtos";

@Injectable({
  providedIn: 'root'
})
export class ClientDataService {
  
  private path = 'clients';
  
  private http = inject(HttpClient);
  
  getClients(query: GetClientQuery) {
    return this.http.get<ApiPaginatedList<GetClientDto>>(this.path, { params: { ...query } });
  }
}
