import { Component, computed, DestroyRef, EventEmitter, inject, signal } from '@angular/core';
import { GetUserClientQuery, UserClientDto } from "@data/user/dtos";
import { UserSessionService } from "@core/services/user-session/user-session.service";
import { Observable, shareReplay, switchMap, take } from "rxjs";
import { ApiPaginatedList } from "@data/common/dtos";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { UserDataService } from "@data/user/user-data.service";
import { AsyncPipe } from "@angular/common";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";
import { NoListContentComponent } from "@shared/components/base/no-list-content/no-list-content.component";
import { AuthenticationService } from "@core/services/authentication/authentication.service";
import { LucideAngularModule } from "lucide-angular";
import {
  DirectSelectClickableComponent
} from "@shared/components/base/clickables/direct-select-clickable/direct-select-clickable.component";
import {
  DirectSelectSkeletonComponent
} from "@shared/components/base/skeletons/direct-select-skeleton/direct-select-skeleton.component";
import { toast } from "ngx-sonner";

@Component({
  selector: 'app-change-environment-dialog',
  imports: [
    AsyncPipe,
    PaginationComponent,
    NoListContentComponent,
    LucideAngularModule,
    DirectSelectClickableComponent,
    DirectSelectSkeletonComponent
  ],
  templateUrl: './change-environment-dialog.component.html'
})
export class ChangeEnvironmentDialogComponent {
  private readonly userDataService = inject(UserDataService);
  private readonly userSessionService = inject(UserSessionService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);

  onChangeEnvironment = new EventEmitter();

  private _query = signal<GetUserClientQuery>(new GetUserClientQuery());

  query = this._query.asReadonly();
  loggedUser = computed(() => this.userSessionService.user());
  loggedClientId = computed(() => this.userSessionService.user()?.cliente.id);

  clients$: Observable<ApiPaginatedList<UserClientDto>> = toObservable(this._query)
    .pipe(
      switchMap(() => this.userDataService
        .getClients(this.loggedUser()!.id, this._query())),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  changeQuery(changes: Partial<GetUserClientQuery> = {}): void {
    this._query.update((prev) => ({ ...prev!, ...changes }));
  }

  changeEnvironmentToClient(clientId: number) {
    this.authenticationService
      .changeEnvironment(clientId)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.onChangeEnvironment.emit(),
        error: (e) => {
          toast.error(e.error.message || 'Acesso temporariamente indisponível.');
        }
      });
  }
}
