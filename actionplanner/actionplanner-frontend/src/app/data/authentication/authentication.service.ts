import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginRequestDto } from "@data/authentication/dtos";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly path = '/auth';

  private http = inject(HttpClient);

 login(params: LoginRequestDto) {
   return this.http.post<LoginRequestDto>(`${this.path}/login`, params);
 }
}
