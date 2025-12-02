import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDataService } from '@data/project/project-data.service';
import { ProjectDto, ProjectStatisticsDto } from '@data/project/dto/project-dto';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { take } from 'rxjs';
import { LucideAngularModule, ArrowLeft, Edit } from 'lucide-angular';

@Component({
  selector: 'app-project-view',
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './project-view.component.html'
})
export class ProjectViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectDataService);

  icons = {
    ArrowLeftIcon: ArrowLeft,
    EditIcon: Edit
  };

  loading = signal(true);
  project = signal<ProjectDto | null>(null);
  statistics = signal<ProjectStatisticsDto | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.loadProject(id);
    this.loadStatistics(id);
  }

  loadProject(id: number) {
    this.projectService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (project) => {
          this.project.set(project);
          this.loading.set(false);
        },
        error: () => {
          toast.error('Erro ao carregar projeto');
          this.loading.set(false);
        }
      });
  }

  loadStatistics(id: number) {
    this.projectService.getStatistics(id)
      .pipe(take(1))
      .subscribe({
        next: (stats) => {
          this.statistics.set(stats);
        },
        error: () => {
          // Estatísticas são opcionais
        }
      });
  }

  navigateToEdit() {
    this.router.navigate(['/projects', this.project()!.id, 'edit']);
  }

  goBack() {
    this.router.navigate(['/projects']);
  }
}