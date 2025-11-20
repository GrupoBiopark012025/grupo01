import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, switchMap, tap } from "rxjs";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { AsyncPipe, DatePipe } from "@angular/common";
import { ActionPlanStatusEnum, descricaoActionPlanStatusEnum, GetActionPlanDto } from "@data/action-plan/dtos";
import { ActionPlanDataService } from "@data/action-plan/action-plan-data.service";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { FormsModule } from "@angular/forms";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";

@Component({
  selector: 'app-action-plan-view',
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    RouterLink,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardInputDirective,
    PaginationComponent
  ],
  templateUrl: './action-plan-view.component.html'
})
export class ActionPlanViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly actionPlanDataService = inject(ActionPlanDataService);
  private readonly destroyRef = inject(DestroyRef);

  planId = this.route.snapshot.paramMap.get('id');
  taskSearchTerm = signal<string>('');
  currentTaskPage = signal<number>(1);
  taskPageSize = signal<number>(5);

  actionPlan$: Observable<GetActionPlanDto> = this.route.paramMap
    .pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.actionPlanDataService.getActionPlanById(id);
      }),
      tap((response) => {
        console.log('Plano de ação carregado:', response);
      }),
      takeUntilDestroyed(this.destroyRef)
    );

  actionPlan = toSignal(this.actionPlan$, { initialValue: null });

  filteredTasks = computed(() => {
    const plan = this.actionPlan();
    if (!plan || !plan.tasks) {
      return [];
    }

    const search = this.taskSearchTerm().toLowerCase().trim();
    if (!search) {
      return plan.tasks;
    }

    return plan.tasks.filter(task =>
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search)
    );
  });

  paginatedTasks = computed(() => {
    const tasks = this.filteredTasks();
    const page = this.currentTaskPage();
    const pageSize = this.taskPageSize();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return tasks.slice(startIndex, endIndex);
  });

  totalTaskPages = computed(() => {
    const totalTasks = this.filteredTasks().length;
    const pageSize = this.taskPageSize();
    return Math.ceil(totalTasks / pageSize) || 1;
  });

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

  onTaskSearchChange(value: string): void {
    this.taskSearchTerm.set(value);
    this.currentTaskPage.set(1); // Reset para primeira página ao buscar
  }

  onTaskPageChange(page: number): void {
    this.currentTaskPage.set(page);
  }

  viewTask(taskId: number): void {
    this.router.navigate(['/action-plans/tasks', taskId], {
      queryParams: { returnTo: `/action-plans/${this.planId}` }
    });
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'ALTA':
        return 'bg-rose-500 text-white border-transparent hover:bg-rose-600';
      case 'MEDIA':
        return 'bg-amber-500 text-white border-transparent hover:bg-amber-600';
      case 'BAIXA':
        return 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600';
      default:
        return 'bg-slate-500 text-white border-transparent hover:bg-slate-600';
    }
  }
}

