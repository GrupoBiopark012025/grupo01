import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { GetClientDto, GetClientQuery } from "@data/client/dtos";
import { Observable, shareReplay, switchMap } from "rxjs";
import { ApiPaginatedList } from "@data/common/dtos";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { ClientDataService } from "@data/client/client-data.service";
import { GetUserClientQuery } from "@data/user/dtos";
import { AsyncPipe } from "@angular/common";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";
import { NoListContentComponent } from "@shared/components/base/no-list-content/no-list-content.component";
import { CheckClickableComponent } from "@shared/components/base/clickables/check-clickable/check-clickable.component";

@Component({
  selector: 'app-select-user-clients-dialog',
  imports: [
    AsyncPipe,
    PaginationComponent,
    NoListContentComponent,
    CheckClickableComponent
  ],
  templateUrl: './select-user-clients-dialog.component.html'
})
export class SelectUserClientsDialogComponent {
  private readonly clientDataService = inject(ClientDataService);
  private readonly destroyRef = inject(DestroyRef);

  private _query = signal<GetClientQuery>(new GetClientQuery());
  private _primaryClient = signal<GetClientDto | null>(null);
  private _selectedClients = signal<GetClientDto[]>([]);

  query = this._query.asReadonly();
  primaryClient = this._primaryClient.asReadonly();
  selectedClientsIds = computed(() => this._selectedClients().map((client) => client.id));

  clients$: Observable<ApiPaginatedList<GetClientDto>> = toObservable(this._query)
    .pipe(
      switchMap(() => this.clientDataService.getClients(this._query())),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  changeQuery(changes: Partial<GetUserClientQuery> = {}): void {
    this._query.update((prev) => ({ ...prev!, ...changes }));
  }

  onCheck(client: GetClientDto) {
    if (this.selectedClientsIds().includes(client.id)) {
      this._selectedClients.update((prev) => prev.filter((c) => c.id !== client.id));
    } else {
      this._selectedClients.update((prev) => [...prev, client]);
    }
  }

  onStar(client: GetClientDto) {
    const staredClient = this._primaryClient();

    this._primaryClient.set(staredClient?.id === client.id ? null : client);

    if (!this.selectedClientsIds().includes(client.id)) {
      this._selectedClients.update((prev) => [...prev, client]);
    }
  }
}
