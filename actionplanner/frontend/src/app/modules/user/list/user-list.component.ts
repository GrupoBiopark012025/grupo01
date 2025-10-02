import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Observable, shareReplay, switchMap } from "rxjs";
import { descricaoUserAccessLevelEnum, descricaoUserStatusEnum, GetUserDto, GetUserQuery } from "@data/user/dtos";
import { UserDataService } from "@data/user/user-data.service";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { AsyncPipe, DatePipe } from "@angular/common";
import { ApiPaginatedList } from "@data/common/dtos";
import { ZardTableComponent } from "@shared/components/zardui/table/table.component";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { EyeIcon, LucideAngularModule } from "lucide-angular";
import { ListHeaderComponent } from "@shared/components/base/list-header/list-header.component";

@Component({
  selector: 'app-user-list',
  imports: [
    AsyncPipe,
    ZardTableComponent,
    ZardBadgeComponent,
    DatePipe,
    ZardButtonComponent,
    LucideAngularModule,
    ListHeaderComponent
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  icons = ICONS;

  private _query = signal<GetUserQuery>(new GetUserQuery());

  private readonly userDataService = inject(UserDataService);
  private readonly destroyRef = inject(DestroyRef);

  users$: Observable<ApiPaginatedList<GetUserDto>> = toObservable(this._query)
    .pipe(
      switchMap(() => this.userDataService.getUsers(this._query())),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  alterarQuery(changes: Partial<UserDataService> = {}): void {
    this._query.update((prev) => ({ ...prev!, ...changes }));
  }

  protected readonly descricaoUserAccessLevelEnum = descricaoUserAccessLevelEnum;
  protected readonly descricaoUserStatusEnum = descricaoUserStatusEnum;
}

const ICONS = {
  view: EyeIcon
}
