import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, switchMap, tap } from "rxjs";
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
    RouterLink,
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

  taskId = this.route.snapshot.paramMap.get('id');

  task$: Observable<GetTaskDto> = this.route.paramMap
    .pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.taskDataService.getTaskById(id);
      }),
      tap((response) => {
        console.log('Tarefa carregada:', response);
      }),
      takeUntilDestroyed(this.destroyRef)
    );

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONCLUIDO':
        return 'text-green-400 border-green-400 hover:text-green-300 hover:border-green-300';
      case 'EM_ANDAMENTO':
        return 'text-blue-400 border-blue-400 hover:text-blue-300 hover:border-blue-300';
      case 'PENDENTE':
        return 'text-yellow-400 border-yellow-400 hover:text-yellow-300 hover:border-yellow-300';
      case 'CANCELADO':
        return 'text-red-400 border-red-400 hover:text-red-300 hover:border-red-300';
      default:
        return 'text-gray-400 border-gray-400 hover:text-gray-300 hover:border-gray-300';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'ALTA':
        return 'text-red-400 border-red-400 hover:text-red-300 hover:border-red-300';
      case 'MEDIA':
        return 'text-yellow-400 border-yellow-400 hover:text-yellow-300 hover:border-yellow-300';
      case 'BAIXA':
        return 'text-green-400 border-green-400 hover:text-green-300 hover:border-green-300';
      default:
        return 'text-gray-400 border-gray-400 hover:text-gray-300 hover:border-gray-300';
    }
  }
}

