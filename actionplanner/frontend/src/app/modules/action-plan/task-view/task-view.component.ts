import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AsyncPipe, DatePipe } from "@angular/common";
import { GetTaskDto } from "@data/task/dtos";
import { TaskDataService } from "@data/task/task-data.service";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";

@Component({
  selector: 'app-task-view',
  imports: [
    AsyncPipe,
    DatePipe,
    ZardButtonComponent,
    ZardBadgeComponent
  ],
  templateUrl: './task-view.component.html'
})
export class TaskViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskDataService = inject(TaskDataService);
  private readonly destroyRef = inject(DestroyRef);

  private refreshTrigger = new BehaviorSubject<void>(undefined);

  task$: Observable<GetTaskDto> = this.route.paramMap
    .pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.refreshTrigger.pipe(
          switchMap(() => this.taskDataService.getTaskById(id))
        );
      }),
      tap((response) => {
        console.log('Tarefa carregada:', response);
      }),
      takeUntilDestroyed(this.destroyRef)
    );

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONCLUIDO':
        return 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600';
      case 'EM_ANDAMENTO':
        return 'bg-indigo-500 text-white border-transparent hover:bg-indigo-600';
      case 'PENDENTE':
        return 'bg-amber-500 text-white border-transparent hover:bg-amber-600';
      case 'CANCELADO':
        return 'bg-rose-500 text-white border-transparent hover:bg-rose-600';
      default:
        return 'bg-slate-500 text-white border-transparent hover:bg-slate-600';
    }
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

  goBack(): void {
    const returnTo = this.route.snapshot.queryParams['returnTo'];
    if (returnTo) {
      this.router.navigate([returnTo]);
    } else {
      this.router.navigate(['/action-plans']);
    }
  }

  completeTask(taskId: number): void {
    this.taskDataService.updateTaskStatus(taskId, 'CONCLUIDO')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.refreshTrigger.next(undefined);
        },
        error: (error) => {
          console.error('Erro ao concluir tarefa:', error);
        }
      });
  }

  isTaskCompleted(status: string): boolean {
    return status === 'CONCLUIDO';
  }
}

