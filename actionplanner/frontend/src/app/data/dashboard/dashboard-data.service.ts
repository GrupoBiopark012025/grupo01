import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { DashboardDto } from './dtos'

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private path = 'dashboard'
  private http = inject(HttpClient)

  getDashboard() {
    return this.http.get<DashboardDto>(this.path)
  }
}
