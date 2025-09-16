import { inject, Injectable } from '@angular/core';
import { LocalStorageKey, LocalStorageService } from "@core/services/local-storage/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly localStorageService = inject(LocalStorageService);

  getToken(): string {
    return this.localStorageService.get<string>(LocalStorageKey.AccessToken)!;
  }

  saveToken(token: string) {
    this.localStorageService.set(LocalStorageKey.AccessToken, token);
  }

  destroyToken() {
    this.localStorageService.remove(LocalStorageKey.AccessToken);
  }
}
