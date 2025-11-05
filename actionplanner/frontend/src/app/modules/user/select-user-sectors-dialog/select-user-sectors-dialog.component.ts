import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Observable, shareReplay, switchMap } from "rxjs";
import { ApiPaginatedList } from "@data/common/dtos";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { GetUserClientQuery } from "@data/user/dtos";
import { GetSectorDto, GetSectorQuery } from "@data/sector/dtos";
import { SectorDataService } from "@data/sector/sector-data.service";
import { AsyncPipe } from "@angular/common";
import { NoListContentComponent } from "@shared/components/base/no-list-content/no-list-content.component";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";
import { CheckClickableComponent } from "@shared/components/base/clickables/check-clickable/check-clickable.component";

@Component({
  selector: 'app-select-user-sectors-dialog',
  imports: [
    AsyncPipe,
    NoListContentComponent,
    PaginationComponent,
    CheckClickableComponent
  ],
  templateUrl: './select-user-sectors-dialog.component.html'
})
export class SelectUserSectorsDialogComponent {
  private readonly sectorDataService = inject(SectorDataService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _query = signal<GetSectorQuery>(new GetSectorQuery());
  private readonly _selectedSectors = signal<GetSectorDto[]>([]);

  query = this._query.asReadonly();
  selectedSectors = this._selectedSectors.asReadonly();
  selectedClientsIds = computed(() => this._selectedSectors().map((sector) => sector.id));

  sectors$: Observable<ApiPaginatedList<GetSectorDto>> = toObservable(this._query)
    .pipe(
      switchMap(() => this.sectorDataService.getSectors(this._query())),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  carregarDados(input: SelectUserSectorsInput) {
    this._selectedSectors.set(input.selectedSectors);
  }

  changeQuery(changes: Partial<GetUserClientQuery> = {}): void {
    this._query.update((prev) => ({ ...prev!, ...changes }));
  }

  onCheck(sector: GetSectorDto) {
    if (this.selectedClientsIds().includes(sector.id)) {
      this._selectedSectors.update((prev) => prev.filter((c) => c.id !== sector.id));
    } else {
      this._selectedSectors.update((prev) => [...prev, sector]);
    }
  }
}

interface SelectUserSectorsInput {
  selectedSectors: GetSectorDto[];
}