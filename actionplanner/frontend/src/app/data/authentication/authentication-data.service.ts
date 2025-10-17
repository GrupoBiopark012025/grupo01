import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  PostChangeEnvironmentRequestDto,
  PostChangeEnvironmentResponseDto,
  PostLoginRequestDto,
  PostLoginResponseDto
} from "@data/authentication/dtos";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationDataService {
  readonly path = '/auth';

  private http = inject(HttpClient);

 login(params: PostLoginRequestDto) {
   return this.http.post<PostLoginResponseDto>(`${this.path}/login`, params);
 }

 changeEnvironment(params: PostChangeEnvironmentRequestDto) {
   return this.http.post<PostChangeEnvironmentResponseDto>(`${this.path}/change-environment`, params);
 }
}
