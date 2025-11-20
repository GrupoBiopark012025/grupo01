import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArrowLeftIcon, EditIcon, TrashIcon, LucideAngularModule, CalendarIcon, UserIcon, BuildingIcon } from 'lucide-angular';

import { TaskDataService } from '@data/task/task-data.service';
import { GetTaskDto } from '@data/task/dtos';

import { TaskStatusBadgeComponent } from '../status-badge/task-status-badge.component';
import { TaskPriorityBadgeComponent } from '../priority-badge/task-priority-badge.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    TaskStatusBadgeComponent,
    TaskPriorityBadgeComponent
  ],
  templateUrl: './task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  icons = { ArrowLeftIcon, EditIcon, TrashIcon, CalendarIcon, UserIcon, BuildingIcon };

  private readonly taskDataService = inject(TaskDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  task = signal<GetTaskDto | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTask(+id);
    } else {
      this.goBack();
    }
  }

  loadTask(id: number): void {
    this.loading.set(true);
    this.taskDataService.getTaskById(id).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar tarefa:', error);
        alert('Erro ao carregar tarefa');
        this.goBack();
      }
    });
  }

  editTask(): void {
    const task = this.task();
    if (task) {
      this.router.navigate(['/tasks', task.id, 'edit']);
    }
  }

  deleteTask(): void {
    const task = this.task();
    if (!task) return;

    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskDataService.deleteTask(task.id).subscribe({
        next: () => {
          alert('Tarefa excluída com sucesso!');
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Erro ao excluir tarefa:', error);
          alert(error.error?.error || 'Erro ao excluir tarefa');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }
}
