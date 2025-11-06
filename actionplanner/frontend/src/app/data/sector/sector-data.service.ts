import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaginatedList } from "@data/common/dtos";
import { GetSectorDto, GetSectorQuery } from "@data/sector/dtos";

@Injectable({
  providedIn: 'root'
})
export class SectorDataService {

  private path = 'sectors';

  private http = inject(HttpClient);

  getSectors(query: GetSectorQuery) {
    return this.http.get<ApiPaginatedList<GetSectorDto>>(this.path, { params: { ...query } });
  }
}
