import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Observable, shareReplay, switchMap } from "rxjs";
import { AsyncPipe, DatePipe } from "@angular/common";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

import { ApiPaginatedList } from "@data/common/dtos";
import { TaskDataService } from "@data/task/task-data.service";
import { GetTaskDto, GetTaskQuery } from "@data/task/dtos";
import { UserSessionService } from "@core/services/user-session/user-session.service";

import { ZardTableComponent } from "@shared/components/zardui/table/table.component";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { EyeIcon, EditIcon, TrashIcon, LucideAngularModule } from "lucide-angular";
import { ListHeaderComponent } from "@shared/components/base/list-header/list-header.component";
import { PaginationComponent } from "@shared/components/base/pagination/pagination.component";
import { TableSkeletonComponent } from "@shared/components/base/skeletons/table-skeleton/table-skeleton.component";
import { NoListContentComponent } from "@shared/components/base/no-list-content/no-list-content.component";
import { TaskStatusBadgeComponent } from "../status-badge/task-status-badge.component";
import { TaskPriorityBadgeComponent } from "../priority-badge/task-priority-badge.component";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ZardTableComponent,
    ZardBadgeComponent,
    ZardButtonComponent,
    LucideAngularModule,
    ListHeaderComponent,
    PaginationComponent,
    TaskStatusBadgeComponent,
    TaskPriorityBadgeComponent,
    TableSkeletonComponent,
    NoListContentComponent
  ],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  icons = ICONS;

  private readonly taskDataService = inject(TaskDataService);
  private readonly userSessionService = inject(UserSessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private _query = signal<GetTaskQuery>(new GetTaskQuery());

  query = this._query.asReadonly();
  loggedUser = computed(() => this.userSessionService.user());

  tasks$: Observable<ApiPaginatedList<GetTaskDto>> = toObservable(this._query)
    .pipe(
      switchMap(() => this.taskDataService.getTasks(this._query())),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

  ngOnInit(): void {
    const user = this.loggedUser();
    if (user) {
      const filters: Partial<GetTaskQuery> = {
        clienteId: user.clienteId
      };
      if (!user.isAdmin && user.onlyAttachedTasks) {
        filters.userResponsibleId = user.id;
      }

      this.changeQuery(filters);
    }
  }

  changeQuery(changes: Partial<GetTaskQuery> = {}): void {
    this._query.update((prev) => ({ ...prev!, ...changes }));
  }

  viewTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  deleteTask(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskDataService.deleteTask(id).subscribe(() => {
        this.changeQuery({});
      });
    }
  }

  getPageTitle(): string {
    const user = this.loggedUser();
    if (!user) return 'Tarefas';
    
    if (user.isAdmin) {
      return 'Todas as Tarefas';
    } else if (user.onlyAttachedTasks) {
      return 'Minhas Tarefas';
    } else {
      return 'Tarefas';
    }
  }

  createTask(): void {
    this.router.navigate(['/tasks/new']);
  }
}

const ICONS = {
  view: EyeIcon,
  edit: EditIcon,
  delete: TrashIcon
};