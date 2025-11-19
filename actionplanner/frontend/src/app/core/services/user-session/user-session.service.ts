import { computed, inject, Injectable, signal } from '@angular/core';
import { of, switchMap, tap } from "rxjs";
import { LocalStorageKey, LocalStorageService } from "@core/services/local-storage/local-storage.service";
import { UserDataService } from "@data/user/user-data.service";
import { GetUserDataDto, UserAccessLevelEnum } from "@data/user/dtos";

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly userDataService = inject(UserDataService);

  private _state = signal<GetUserDataDto | null>(null);

  user = this._state.asReadonly();
  isAdmin = computed(() => this._state()?.isAdmin && this._state()?.accessLevel === UserAccessLevelEnum.Admin);
  userInitials = computed(() => this.handleUserInitials());

  getSessionData() {
    return of(this.localStorageService.get<GetUserDataDto>(LocalStorageKey.SessionData))
      .pipe(
        switchMap((sessionData) => {
          if (sessionData) {
            return of(sessionData);
          }

          return this.userDataService.getUserData()
            .pipe(tap((sessionData) => this.localStorageService.set(LocalStorageKey.SessionData, sessionData)));
        }),
        tap((sessionData) => this._state.set(sessionData))
      );
  }

  reloadSessionData() {
    this.localStorageService.remove(LocalStorageKey.SessionData);

    return this.getSessionData();
  }

  private handleUserInitials() {
    const fullName = this._state()?.nome.trim() ?? '';

    if (!fullName) return '';

    const parts = fullName.split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';

    return (first + last).toUpperCase();
  }
}
