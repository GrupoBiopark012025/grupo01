import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from "rxjs";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { AsyncPipe, DatePipe, CommonModule } from "@angular/common";
import { ActionPlanStatusEnum, descricaoActionPlanStatusEnum, GetActionPlanDto } from "@data/action-plan/dtos";
import { ActionPlanDataService } from "@data/action-plan/action-plan-data.service";
import { TaskDataService } from "@data/task/task-data.service";
import { TaskStatusEnum, descricaoTaskStatusEnum } from "@data/task/dtos";  // <-- ADICIONE descricaoTaskStatusEnum
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { ZardSelectComponent } from "@shared/components/zardui/select/select.component";
import { ZardSelectItemComponent } from "@shared/components/zardui/select/select-item.component";
import { FormsModule } from "@angular/forms";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";

@Component({
  selector: 'app-action-plan-view',
  standalone: true,
  imports: [
    CommonModule,  // <-- ADICIONE para *ngFor
    AsyncPipe,
    DatePipe,
    FormsModule,
    RouterLink,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardInputDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    PaginationComponent
  ],
  templateUrl: './action-plan-view.component.html'
})
export class ActionPlanViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly actionPlanDataService = inject(ActionPlanDataService);
  private readonly taskDataService = inject(TaskDataService);
  private readonly destroyRef = inject(DestroyRef);

  private refreshTrigger = new BehaviorSubject<void>(undefined);

  planId = this.route.snapshot.paramMap.get('id');
  taskSearchTerm = signal<string>('');
  currentTaskPage = signal<number>(1);
  taskPageSize = signal<number>(5);
  selectedStatusFilter = signal<string>('');

  actionPlan$: Observable<GetActionPlanDto> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = Number(params.get('id'));
      return this.refreshTrigger.pipe(
        switchMap(() => this.actionPlanDataService.getActionPlanById(id))
      );
    }),
    tap((response) => {
      console.log('Plano de ação carregado:', response);
    }),
    takeUntilDestroyed(this.destroyRef)
  );

  actionPlan = toSignal(this.actionPlan$, { initialValue: null });

  statusOptions = [
    { value: TaskStatusEnum.PENDENTE, label: descricaoTaskStatusEnum[TaskStatusEnum.PENDENTE] },
    { value: TaskStatusEnum.EM_ANDAMENTO, label: descricaoTaskStatusEnum[TaskStatusEnum.EM_ANDAMENTO] },
    { value: TaskStatusEnum.CONCLUIDA, label: descricaoTaskStatusEnum[TaskStatusEnum.CONCLUIDA] },
    { value: TaskStatusEnum.CANCELADA, label: descricaoTaskStatusEnum[TaskStatusEnum.CANCELADA] }
  ];

  filteredTasks = computed(() => {
    const plan = this.actionPlan();
    if (!plan || !plan.tasks) {
      return [];
    }

    let tasks = plan.tasks;

    // Filtro por busca
    const search = this.taskSearchTerm().toLowerCase().trim();
    if (search) {
      tasks = tasks.filter(task =>
        task.title?.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      );
    }

    const statusFilter = this.selectedStatusFilter();
    if (statusFilter && statusFilter !== '') {
      tasks = tasks.filter(task => task.status === statusFilter);
    }

    return tasks;
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
  protected readonly TaskStatusEnum = TaskStatusEnum;
  protected readonly descricaoTaskStatusEnum = descricaoTaskStatusEnum;  // <-- ADICIONE


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

  getTaskStatusBadgeClass(status: string): string {
    switch (status) {
      case TaskStatusEnum.CONCLUIDA:
        return 'bg-emerald-500 text-white border-transparent';
      case TaskStatusEnum.EM_ANDAMENTO:
        return 'bg-indigo-500 text-white border-transparent';
      case TaskStatusEnum.PENDENTE:
        return 'bg-amber-500 text-white border-transparent';
      case TaskStatusEnum.CANCELADA:
        return 'bg-rose-500 text-white border-transparent';
      default:
        return 'bg-slate-500 text-white border-transparent';
    }
  }

  calculateProgress(plan: GetActionPlanDto): number {
    if (!plan.tasks || plan.tasks.length === 0) {
      return 0;
    }
    
    const completedTasks = plan.tasks.filter(task => 
      task.status === TaskStatusEnum.CONCLUIDA
    ).length;
    const totalTasks = plan.tasks.length;
    
    return Math.round((completedTasks / totalTasks) * 100);
  }

  getCompletedTasksCount(plan: GetActionPlanDto): number {
    if (!plan.tasks || plan.tasks.length === 0) {
      return 0;
    }
    return plan.tasks.filter(task => task.status === TaskStatusEnum.CONCLUIDA).length;
  }

onTaskSearchChange(value: string): void {
    this.taskSearchTerm.set(value);
    this.currentTaskPage.set(1);
  }

  onTaskPageChange(page: number): void {
    this.currentTaskPage.set(page);
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatusFilter.set(status || '');
    this.currentTaskPage.set(1);
    console.log('Filtro de status alterado para:', status);  // Debug
  }

  clearStatusFilter(): void {
    this.selectedStatusFilter.set('');
    this.currentTaskPage.set(1);
  }

  viewTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId], {
      queryParams: { 
        returnTo: `/action-plans/${this.planId}`,
        fromActionPlan: true 
      }
    });
  }


  onTaskStatusChange(taskId: number, newStatus: string): void {
    console.log('Alterando status:', taskId, newStatus);  // Debug
    
    if (!newStatus || newStatus === '') {
      return;
    }

    if (!confirm(`Alterar status para "${descricaoTaskStatusEnum[newStatus as TaskStatusEnum]}"?`)) {
      return;
    }

    this.taskDataService.updateTask(taskId, { status: newStatus as TaskStatusEnum })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {

          this.refreshTrigger.next(undefined);
          alert('Status alterado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao alterar status:', error);
          alert(error.error?.error || 'Erro ao alterar status da tarefa');
        }
      });
  }

  getTaskStatusLabel(status: string): string {
    return descricaoTaskStatusEnum[status as TaskStatusEnum] || status;
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