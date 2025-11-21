import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ArrowLeftIcon, EditIcon, TrashIcon,
  LucideAngularModule, CalendarIcon, UserIcon, BuildingIcon
} from 'lucide-angular';

import { TaskDataService } from '@data/task/task-data.service';
import { GetTaskDto } from '@data/task/dtos';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TaskStatusBadgeComponent } from '../status-badge/task-status-badge.component';
import { TaskPriorityBadgeComponent } from '../priority-badge/task-priority-badge.component';

interface TimelineItem {
  id: number;
  type: 'COMMENT' | 'LOG';
  message?: string;
  content?: string;
  createdAt: Date;
  user?: {
    nome: string;
  };
}

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  timeline = signal<TimelineItem[]>([]);
  commentForm!: FormGroup;
  submitting = signal(false);
  private fb = inject(FormBuilder);


  ngOnInit(): void {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });

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
        this.buildTimeline(task);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar tarefa:', error);
        alert('Erro ao carregar tarefa');
        this.goBack();
      }
    });
  }

  private buildTimeline(task: GetTaskDto) {
    const comments = (task.comments ?? []).map(c => ({
      id: c.id,
      type: 'COMMENT' as const,
      content: c.content,
      createdAt: c.createdAt,
      user: c.user
    }));

    const logs = (task.logs ?? []).map(l => ({
      id: l.id,
      type: 'LOG' as const,
      message: l.description,
      createdAt: l.createdAt
    }));

    const combined = [...comments, ...logs].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    this.timeline.set(combined);
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
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
  }

  onSubmitComment() {
    if (this.commentForm.invalid || this.submitting()) return;

    const task = this.task();
    if (!task) return;

    this.submitting.set(true);

    this.taskDataService.addComment(task.id, {
      content: this.commentForm.value.content
    }).subscribe({
      next: () => {
        this.commentForm.reset();
        this.refreshTimeline(task.id);
        this.submitting.set(false);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao enviar comentário');
        this.submitting.set(false);
      }
    });
  }

  refreshTimeline(taskId: number) {
    this.taskDataService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        this.buildTimeline(task);
      },
      error: (err) => console.error(err)
    });
  }


}
