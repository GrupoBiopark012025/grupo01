import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectDataService } from '@data/project/project-data.service';
import { ProjectDto } from '@data/project/dto/project-dto';
import { ZardInputDirective } from '@shared/components/zardui/input/input.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { ZardDialogService } from '@shared/components/zardui/dialog/dialog.service';
import { take } from 'rxjs';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule,
    FormsModule,
    ZardInputDirective,
    LucideAngularModule
  ],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectDataService);
  private readonly dialogService = inject(ZardDialogService);

  icons = { PlusIcon: Plus };
  Math = Math;

  loading = signal(false);
  projects = signal<ProjectDto[]>([]);
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  totalData = signal(0);

  filters = {
    name: '',
    status: ''
  };

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);

    const params: any = {
      page: this.currentPage(),
      size: this.pageSize()
    };

    if (this.filters.name) params.name = this.filters.name;
    if (this.filters.status) params.status = this.filters.status;

    this.projectService.list(params)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.projects.set(response.projects);
          this.totalPages.set(response.totalPages);
          this.totalData.set(response.totalData);
          this.currentPage.set(response.currentPage);
          this.loading.set(false);
        },
        error: () => {
          toast.error('Erro ao carregar projetos');
          this.loading.set(false);
        }
      });
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.loadProjects();
  }

  clearFilters() {
    this.filters = {
      name: '',
      status: ''
    };
    this.currentPage.set(1);
    this.loadProjects();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProjects();
  }

  navigateToCreate() {
    this.router.navigate(['/projects/create']);
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/projects', id, 'edit']);
  }

  navigateToView(id: number) {
    this.router.navigate(['/projects', id]);
  }

  confirmDelete(project: ProjectDto) {
    this.dialogService.create({
      zTitle: 'Confirmar Inativação',
      zContent: `Tem certeza que deseja inativar o projeto "${project.name}"?`,
      zOkText: 'Sim, inativar',
      zCancelText: 'Cancelar',
      zOnOk: () => {
        this.deleteProject(project.id);
      },
      zOnCancel: () => {
      }
    });
  }

  deleteProject(id: number) {
    this.projectService.delete(id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          toast.success('Projeto inativado com sucesso');
          this.loadProjects();
        },
        error: () => {
          toast.error('Erro ao inativar projeto');
        }
      });
  }
}