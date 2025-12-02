import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDataService } from '@data/project/project-data.service';
import { ProjectDto } from '@data/project/dto/project-dto';
import { ZardInputDirective } from '@shared/components/zardui/input/input.directive';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { take } from 'rxjs';
import { LucideAngularModule, ArrowLeft, Save } from 'lucide-angular';

@Component({
  selector: 'app-project-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardInputDirective,
    LucideAngularModule
  ],
  templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectDataService);

  icons = {
    ArrowLeftIcon: ArrowLeft,
    SaveIcon: Save
  };

  loading = signal(true);
  saving = signal(false);
  project = signal<ProjectDto | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    status: ['ATIVO' as 'ATIVO' | 'INATIVO']
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.loadProject(id);
  }

  loadProject(id: number) {
    this.projectService.getById(id)
      .pipe(take(1))
      .subscribe({
        next: (project) => {
          this.project.set(project);
          this.form.patchValue({
            name: project.name,
            description: project.description || '',
            status: project.status
          });
          this.loading.set(false);
        },
        error: () => {
          toast.error('Erro ao carregar projeto');
          this.loading.set(false);
        }
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const data = this.form.getRawValue();

    this.projectService.update(this.project()!.id, data)
      .pipe(take(1))
      .subscribe({
        next: () => {
          toast.success('Projeto atualizado com sucesso');
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          const message = err.error?.error || 'Erro ao atualizar projeto';
          toast.error(message);
          this.saving.set(false);
        }
      });
  }

  goBack() {
    this.router.navigate(['/projects']);
  }
}