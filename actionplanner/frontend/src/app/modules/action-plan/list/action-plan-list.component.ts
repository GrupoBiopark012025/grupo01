import { Component, computed, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, shareReplay, switchMap, tap } from "rxjs";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { AsyncPipe, DatePipe } from "@angular/common";
import { ActionPlanStatusEnum, descricaoActionPlanStatusEnum, GetActionPlanDto, GetActionPlanQuery, GetActionPlanResponseDto } from "@data/action-plan/dtos";
import { ActionPlanDataService } from "@data/action-plan/action-plan-data.service";
import { NoListContentComponent } from "@shared/components/base/no-list-content/no-list-content.component";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { TableSkeletonComponent } from "@shared/components/base/skeletons/table-skeleton/table-skeleton.component";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-action-plan-list',
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    NoListContentComponent,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardInputDirective,
    TableSkeletonComponent,
    PaginationComponent
  ],
  templateUrl: './action-plan-list.component.html'
})
export class ActionPlanListComponent {
  private readonly router = inject(Router);
  private readonly actionPlanDataService = inject(ActionPlanDataService);
  private readonly destroyRef = inject(DestroyRef);

  private _query = signal<GetActionPlanQuery>(new GetActionPlanQuery());
  searchTerm = signal<string>('');
  private _isFilterMenuOpen = signal<boolean>(false);
  private _selectedStatus = signal<string | null>(null);
  private _selectedPeriod = signal<string | null>(null);

  query = this._query.asReadonly();
  isFilterMenuOpen = this._isFilterMenuOpen.asReadonly();
  selectedStatus = this._selectedStatus.asReadonly();
  selectedPeriod = this._selectedPeriod.asReadonly();

  actionPlansResponse$: Observable<GetActionPlanResponseDto> = toObservable(this._query)
    .pipe(
      switchMap(() => this.actionPlanDataService.getActionPlans(this._query())),
      tap((response) => {
        console.log('Resposta do backend - Planos de Ação:', response);
      }),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  actionPlansResponse = toSignal(this.actionPlansResponse$, { 
    initialValue: {
      actionPlans: [],
      totalData: 0,
      totalPages: 0,
      currentPage: 1,
      size: 10
    } as GetActionPlanResponseDto
  });

  actionPlans = computed(() => this.actionPlansResponse()?.actionPlans || []);
  
  // Informações de paginação
  currentPage = computed(() => this.actionPlansResponse()?.currentPage || 1);
  totalPages = computed(() => this.actionPlansResponse()?.totalPages || 0);
  pageSize = computed(() => this.actionPlansResponse()?.size || 10);
  totalData = computed(() => this.actionPlansResponse()?.totalData || 0);
  recordsInView = computed(() => this.actionPlans().length);

  filteredActionPlans = computed(() => {
    const plans = this.actionPlans();
    const search = this.searchTerm().toLowerCase().trim();
    
    if (!search) {
      return plans;
    }
    
    return plans.filter(plan => 
      plan.what?.toLowerCase().includes(search) ||
      plan.number?.toLowerCase().includes(search) ||
      plan.responsible?.toLowerCase().includes(search)
    );
  });


  onCreateClick(): void {
    this.router.navigate(['/action-plans/create']);
  }

  viewActionPlan(planId: number): void {
    this.router.navigate(['/action-plans', planId]);
  }

  changeQuery(changes: Partial<GetActionPlanQuery> = {}): void {
    this._query.update((prev) => {
      const updated = { ...prev!, ...changes };
      // Quando mudar filtros, volta para a página 1
      if (changes.status !== undefined || changes.startDate !== undefined) {
        updated.page = 1;
      }
      return updated;
    });
  }

  onPageChange(page: number): void {
    this._query.update((prev) => ({ ...prev!, page }));
  }

  protected readonly ActionPlanStatusEnum = ActionPlanStatusEnum;
  protected readonly descricaoActionPlanStatusEnum = descricaoActionPlanStatusEnum;

  getStatusBadgeClass(status: ActionPlanStatusEnum | string): string {
    const statusStr = status.toString();
    switch (statusStr) {
      case ActionPlanStatusEnum.CONCLUIDO:
      case 'CONCLUIDO':
        return 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600';
      case ActionPlanStatusEnum.EM_ANDAMENTO:
      case 'EM_ANDAMENTO':
        return 'bg-indigo-500 text-white border-transparent hover:bg-indigo-600';
      case ActionPlanStatusEnum.PENDENTE:
      case 'PENDENTE':
        return 'bg-amber-500 text-white border-transparent hover:bg-amber-600';
      case ActionPlanStatusEnum.CANCELADO:
      case 'CANCELADO':
        return 'bg-rose-500 text-white border-transparent hover:bg-rose-600';
      case ActionPlanStatusEnum.ADIADO:
      case 'ADIADO':
        return 'bg-slate-500 text-white border-transparent hover:bg-slate-600';
      default:
        return 'bg-slate-500 text-white border-transparent hover:bg-slate-600';
    }
  }

  getStatusDescription(status: ActionPlanStatusEnum | string): string {
    const statusStr = status.toString();
    if (statusStr in descricaoActionPlanStatusEnum) {
      return descricaoActionPlanStatusEnum[statusStr as ActionPlanStatusEnum];
    }
    return statusStr;
  }

  calculateProgress(plan: GetActionPlanDto): number {
    if (!plan.tasks || plan.tasks.length === 0) {
      return 0;
    }
    
    const completedTasks = plan.tasks.filter(task => task.status === 'CONCLUIDO').length;
    const totalTasks = plan.tasks.length;
    
    return Math.round((completedTasks / totalTasks) * 100);
  }

  getCompletedTasksCount(plan: GetActionPlanDto): number {
    if (!plan.tasks || plan.tasks.length === 0) {
      return 0;
    }
    return plan.tasks.filter(task => task.status === 'CONCLUIDO').length;
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  toggleFilterMenu(): void {
    this._isFilterMenuOpen.update((prev) => !prev);
  }

  closeFilterMenu(): void {
    this._isFilterMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const filterSection = target.closest('.filter-section');
    
    if (!filterSection && this._isFilterMenuOpen()) {
      this.closeFilterMenu();
    }
  }

  applyStatusFilter(status: string | null): void {
    this._selectedStatus.set(status);
    
    if (status) {
      // Aplica o filtro de status na query
      this.changeQuery({ status });
    } else {
      // Remove o filtro de status da query
      const currentQuery = this._query();
      const { status: _, ...rest } = currentQuery;
      this._query.set({ ...rest } as GetActionPlanQuery);
    }
    
    this.closeFilterMenu();
  }

  applyPeriodFilter(days: number | null): void {
    if (days) {
      this._selectedPeriod.set(`${days} dias`);
      
      // Calcula a data de início (últimos X dias)
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - days);
      
      // Formata a data no formato ISO (YYYY-MM-DD) para enviar ao backend
      const formattedStartDate = startDate.toISOString().split('T')[0];
      this.changeQuery({ startDate: formattedStartDate });
    } else {
      // Remove o filtro de período
      this._selectedPeriod.set(null);
      const currentQuery = this._query();
      const { startDate: _, ...rest } = currentQuery;
      this._query.set({ ...rest } as GetActionPlanQuery);
    }
    
    this.closeFilterMenu();
  }

  clearAllFilters(): void {
    this._selectedStatus.set(null);
    this._selectedPeriod.set(null);
    // Reseta a query para o estado inicial (sem filtros)
    this._query.set(new GetActionPlanQuery());
    this.closeFilterMenu();
  }

  hasActiveFilters(): boolean {
    return this._selectedStatus() !== null || this._selectedPeriod() !== null;
  }
}

