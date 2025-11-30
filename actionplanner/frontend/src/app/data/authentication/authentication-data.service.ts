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

  requestPasswordReset(params: { email: string }) {
    return this.http.post<{ message: string }>(`${this.path}/request-password-reset`, params);
  }

  validateResetToken(token: string) {
    return this.http.get<{ valid: boolean; message: string }>(`${this.path}/validate-reset-token?token=${token}`);
  }

  resetPassword(params: { token: string; newPassword: string }) {
    return this.http.post<{ message: string }>(`${this.path}/reset-password`, params);
  }
}