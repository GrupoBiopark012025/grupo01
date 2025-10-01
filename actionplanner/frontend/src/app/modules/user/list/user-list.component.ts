import { Component, DestroyRef, inject, signal } from '@angular/core';
import { map, Observable, shareReplay, switchMap } from "rxjs";
import { GetUserDto, GetUserQuery } from "@data/user/dtos";
import { UserDataService } from "@data/user/user-data.service";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { AsyncPipe } from "@angular/common";
import { ApiPaginatedList } from "@data/common/dtos";

@Component({
  selector: 'app-user-list',
  imports: [
    AsyncPipe
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
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
}
