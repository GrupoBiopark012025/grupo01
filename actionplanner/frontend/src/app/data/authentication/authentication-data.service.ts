import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginRequestDto, LoginResponseDto } from "@data/authentication/dtos";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationDataService {
  readonly path = '/auth';

  private http = inject(HttpClient);

 login(params: LoginRequestDto) {
   return this.http.post<LoginResponseDto>(`${this.path}/login`, params);
 }
}
