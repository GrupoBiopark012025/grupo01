import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Observable, shareReplay, switchMap } from "rxjs";
import { descricaoUserAccessLevelEnum, GetUserDto, GetUserQuery } from "@data/user/dtos";
import { UserDataService } from "@data/user/user-data.service";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { AsyncPipe, DatePipe } from "@angular/common";
import { ApiPaginatedList } from "@data/common/dtos";
import { ZardTableComponent } from "@shared/components/zardui/table/table.component";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { EyeIcon, LucideAngularModule } from "lucide-angular";
import { ListHeaderComponent } from "@shared/components/base/list-header/list-header.component";
import { UserSessionService } from "@core/services/user-session/user-session.service";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";
import { UserStatusBadgeComponent } from "@modules/user/status-badge/user-status-badge.component";
import { TableSkeletonComponent } from "@shared/components/base/skeletons/table-skeleton/table-skeleton.component";
import { NoListContentComponent } from "@shared/components/base/no-list-content/no-list-content.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-list',
  imports: [
    AsyncPipe,
    ZardTableComponent,
    ZardBadgeComponent,
    DatePipe,
    ZardButtonComponent,
    LucideAngularModule,
    ListHeaderComponent,
    PaginationComponent,
    UserStatusBadgeComponent,
    TableSkeletonComponent,
    NoListContentComponent
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  icons = ICONS;

  private readonly userDataService = inject(UserDataService);
  private readonly userSessionService = inject(UserSessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private _query = signal<GetUserQuery>(new GetUserQuery());

  query = this._query.asReadonly();
  loggedUser = computed(() => this.userSessionService.user());

  users$: Observable<ApiPaginatedList<GetUserDto>> = toObservable(this._query)
    .pipe(
      switchMap(() => this.userDataService.getUsers(this._query())),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  changeQuery(changes: Partial<GetUserQuery> = {}): void {
    this._query.update((prev) => ({ ...prev!, ...changes }));
  }

  redirectToRegister() {
    // TODO: validar depois um navigate melhor via html
    this.router.navigate(['users', 'register']);
  }

  protected readonly descricaoUserAccessLevelEnum = descricaoUserAccessLevelEnum;
}

const ICONS = {
  view: EyeIcon
}
