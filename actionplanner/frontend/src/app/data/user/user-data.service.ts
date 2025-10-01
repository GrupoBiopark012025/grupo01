import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaginatedList } from "@data/common/dtos";
import { GetUserDto, GetUserQuery } from "@data/user/dtos";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private path = 'users';

  private http = inject(HttpClient);

  getUsers(query: GetUserQuery) {
    return this.http.get<ApiPaginatedList<GetUserDto>>(this.path, { params: { ...query } });
  }
}
