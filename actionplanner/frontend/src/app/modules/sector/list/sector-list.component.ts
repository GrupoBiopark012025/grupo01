import { Component, DestroyRef, inject, signal } from '@angular/core';
import { GetSectorDto, GetSectorQuery } from "@data/sector/dtos";
import { Observable, shareReplay, switchMap } from "rxjs";
import { ApiPaginatedList } from "@data/common/dtos";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { SectorDataService } from "@data/sector/sector-data.service";
import { Router } from "@angular/router";
import { ListHeaderComponent } from "@shared/components/base/list-header/list-header.component";
import { TableSkeletonComponent } from "@shared/components/base/skeletons/table-skeleton/table-skeleton.component";
import { NoListContentComponent } from "@shared/components/base/no-list-content/no-list-content.component";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { LucideAngularModule, Pencil } from "lucide-angular";
import { AsyncPipe, DatePipe } from "@angular/common";
import { ZardTableComponent } from "@shared/components/zardui/table";
import { SectorStatusBadgeComponent } from "@modules/sector/status-badge/sector-status-badge.component";

@Component({
  selector: 'app-sector-list',
  imports: [
    ListHeaderComponent,
    TableSkeletonComponent,
    NoListContentComponent,
    PaginationComponent,
    ZardButtonComponent,
    LucideAngularModule,
    DatePipe,
    ZardTableComponent,
    AsyncPipe,
    SectorStatusBadgeComponent
  ],
  templateUrl: './sector-list.component.html'
})
export class SectorListComponent {
  icons = ICONS;

  private readonly sectorDataService = inject(SectorDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private _query = signal<GetSectorQuery>(new GetSectorQuery());

  query = this._query.asReadonly();

  sectors$: Observable<ApiPaginatedList<GetSectorDto>> = toObservable(this._query)
    .pipe(
      switchMap((query) => this.sectorDataService.getSectors(query)),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  changeQuery(changes: Partial<GetSectorQuery> = {}): void {
    this._query.update((prev) => ({ ...prev!, ...changes }));
  }

  redirectToRegister() {
    this.router.navigate(['sectors', 'register']);
  }

  redirectToEdit(sectorId: number) {
    this.router.navigate(['sectors', sectorId, 'edit']);
  }
}

const ICONS = {
  edit: Pencil
}
