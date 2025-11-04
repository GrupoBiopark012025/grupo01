import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaginatedList } from "@data/common/dtos";
import {
  GetUserClientQuery,
  GetUserDataDto,
  GetUserDto,
  GetUserQuery,
  PostCreateUserDto,
  PutRequestUpdateUserDto,
  UserClientDto
} from "@data/user/dtos";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private path = 'users';

  private http = inject(HttpClient);

  getUsers(query: GetUserQuery) {
    return this.http.get<ApiPaginatedList<GetUserDto>>(this.path, { params: { ...query } });
  }

  getUserData() {
    return this.http.get<GetUserDataDto>(`${this.path}/profile`);
  }

  createUser(params: PostCreateUserDto) {
    return this.http.post<GetUserDataDto>(this.path, params);
  }

  getClients(userId: number, query: GetUserClientQuery) {
    return this.http.get<ApiPaginatedList<UserClientDto>>(`${this.path}/${userId}/clients`, { params: { ...query } });
  }

  updateUser(userId: number, params: PutRequestUpdateUserDto) {
    return this.http.put<GetUserDataDto>(`${this.path}/${userId}`, params);
  }

  getUserById(userId: number) {
    return this.http.get<GetUserDto>(`${this.path}/${userId}`);
  }
}
