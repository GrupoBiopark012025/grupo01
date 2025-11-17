import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GetActionPlanDto, GetActionPlanQuery, GetActionPlanResponseDto } from "@data/action-plan/dtos";

@Injectable({
  providedIn: 'root'
})
export class ActionPlanDataService {

  private path = 'actionPlans';

  private http = inject(HttpClient);

  getActionPlans(query?: GetActionPlanQuery): Observable<GetActionPlanResponseDto> {
    const params = query ? { ...query } : {};
    return this.http.get<GetActionPlanResponseDto>(this.path, { params });
  }

  getActionPlanById(id: number): Observable<GetActionPlanDto> {
    return this.http.get<GetActionPlanDto>(`${this.path}/${id}`);
  }
}

