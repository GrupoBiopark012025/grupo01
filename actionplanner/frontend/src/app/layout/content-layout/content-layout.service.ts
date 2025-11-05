import { inject, Injectable, signal } from '@angular/core';
import { GetUserDataDto } from "@data/user/dtos";
import { UserSessionService } from "@core/services/user-session/user-session.service";
import { take, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentLayoutService {
  private _sessionData = signal<GetUserDataDto | null>(null);
  sessionData = this._sessionData.asReadonly();

  private readonly userSessionService = inject(UserSessionService);

  getSessionData() {
    return this.userSessionService.getSessionData()
      .pipe(
        take(1),
        tap((data) => this._sessionData.set(data))
      );
  }
}
