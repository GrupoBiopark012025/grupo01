import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaginatedList } from "@data/common/dtos";
import { GetSectorDto, GetSectorQuery, PostCreateSectorDto } from "@data/sector/dtos";
import { PutUpdateSectorDto } from "@data/sector/dtos/put-update-sector.dto";

@Injectable({
  providedIn: 'root'
})
export class SectorDataService {

  private path = 'sectors';

  private http = inject(HttpClient);

  getSectors(query: GetSectorQuery) {
    return this.http.get<ApiPaginatedList<GetSectorDto>>(this.path, { params: { ...query } });
  }

  getSectorById(sectorId: number) {
    return this.http.get<GetSectorDto>(`${this.path}/${sectorId}`);
  }

  createSector (params: PostCreateSectorDto) {
    return this.http.post<GetSectorDto>(this.path, params);
  }

  updateSector(sectorId: number, params: PutUpdateSectorDto) {
    return this.http.put<GetSectorDto>(`${this.path}/${sectorId}`, params);
  }
}
