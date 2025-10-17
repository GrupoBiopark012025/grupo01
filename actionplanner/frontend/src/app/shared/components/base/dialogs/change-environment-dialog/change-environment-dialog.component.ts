import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { GetUserClientsQuery, UserClientDto } from "@data/user/dtos";
import { UserSessionService } from "@core/services/user-session/user-session.service";
import {  Observable, shareReplay, switchMap } from "rxjs";
import { ApiPaginatedList } from "@data/common/dtos";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { UserDataService } from "@data/user/user-data.service";
import { AsyncPipe } from "@angular/common";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";
import { NoListContentComponent } from "@shared/components/base/no-list-content/no-list-content.component";
import { AuthenticationService } from "@core/services/authentication/authentication.service";
import { ChevronRight, LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-change-environment-dialog',
  imports: [
    AsyncPipe,
    PaginationComponent,
    NoListContentComponent,
    LucideAngularModule
  ],
  templateUrl: './change-environment-dialog.component.html'
})
export class ChangeEnvironmentDialogComponent {
  icons = ICONS;

  private readonly userDataService = inject(UserDataService);
  private readonly userSessionService = inject(UserSessionService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);

  private _query = signal<GetUserClientsQuery>(new GetUserClientsQuery());

  query = this._query.asReadonly();
  loggedUser = computed(() => this.userSessionService.user());
  loggedClientId = computed(() => this.userSessionService.user()?.clienteId);

  clients$: Observable<ApiPaginatedList<UserClientDto>> = toObservable(this._query)
    .pipe(
      switchMap(() => this.userDataService
        .getClients(this.loggedUser()!.id, this._query())),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  changeQuery(changes: Partial<GetUserClientsQuery> = {}): void {
    this._query.update((prev) => ({ ...prev!, ...changes }));
  }

  changeEnvironmentToClient(clientId: number) {
    this.authenticationService.changeEnvironment(clientId);
  }
}

const ICONS = {
  chevronRight: ChevronRight
}
