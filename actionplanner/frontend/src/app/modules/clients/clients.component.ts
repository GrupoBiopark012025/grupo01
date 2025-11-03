import { Component, DestroyRef, inject, signal } from '@angular/core'
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common'
import { Observable, shareReplay, switchMap } from 'rxjs'
import { GetClientsDto, GetClientsQuery } from '@data/clients/dtos'
import { ClientsDataService } from '@data/clients/clients-data.service'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { ApiPaginatedList } from '@data/common/dtos'
import { ZardTableComponent } from '@shared/components/zardui/table/table.component'
import { ZardButtonComponent } from '@shared/components/zardui/button/button.component'
import { EyeIcon, PencilIcon, LucideAngularModule } from 'lucide-angular'
import { ListHeaderComponent } from '@shared/components/base/list-header/list-header.component'
import { PaginationComponent } from '@shared/components/base/pagination/pagination.component'
import { TableSkeletonComponent } from '@shared/components/base/skeletons/table-skeleton/table-skeleton.component'
import { NoListContentComponent } from '@shared/components/base/no-list-content/no-list-content.component'
import { ClientsFormComponent } from './form/clients-form.component'
import { CreateClientModalComponent } from './form/create-client-modal.component'

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    ZardTableComponent,
    ZardButtonComponent,
    LucideAngularModule,
    ListHeaderComponent,
    PaginationComponent,
    TableSkeletonComponent,
    NoListContentComponent,
    ClientsFormComponent,
    CreateClientModalComponent
  ],
  templateUrl: './clients.component.html'
})
export class ClientsComponent {
  icons = ICONS
  private readonly clientsDataService = inject(ClientsDataService)
  private readonly destroyRef = inject(DestroyRef)

  private _query = signal<GetClientsQuery>(new GetClientsQuery())
  query = this._query.asReadonly()

  clients$: Observable<ApiPaginatedList<GetClientsDto>> = toObservable(this._query).pipe(
    switchMap(() => this.clientsDataService.getClients(this._query())),
    shareReplay(1),
    takeUntilDestroyed(this.destroyRef)
  )

  showForm = signal(false)
  editingClient = signal<GetClientsDto | null>(null)
  formMode = signal<'create' | 'edit' | 'view'>('create')

  showCreateModal = signal(false)

  openCreateModal() {
    this.showCreateModal.set(true)
  }

  closeCreateModal(refresh: boolean) {
    this.showCreateModal.set(false)
    if (refresh) this.changeQuery()
  }

  openClientForm(client?: GetClientsDto) {
    this.editingClient.set(client || null)
    this.formMode.set(client ? 'edit' : 'create')
    this.showForm.set(true)
  }

  viewClient(client: GetClientsDto) {
    this.editingClient.set(client)
    this.formMode.set('view')
    this.showForm.set(true)
  }

  closeForm(refresh: boolean) {
    this.showForm.set(false)
    this.editingClient.set(null)
    if (refresh) this.changeQuery()
  }

  changeQuery(changes: Partial<GetClientsQuery> = {}): void {
    this._query.update(prev => ({ ...prev!, ...changes }))
  }
}

const ICONS = {
  view: EyeIcon,
  edit: PencilIcon
}
