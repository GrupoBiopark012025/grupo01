import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectDataService } from '@data/project/project-data.service';
import { ZardInputDirective } from '@shared/components/zardui/input/input.directive';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { take } from 'rxjs';
import { LucideAngularModule, ArrowLeft, Save } from 'lucide-angular';

@Component({
  selector: 'app-project-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardInputDirective,
    LucideAngularModule
  ],
  templateUrl: './project-create.component.html'
})
export class ProjectCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectDataService);

  icons = {
    ArrowLeftIcon: ArrowLeft,
    SaveIcon: Save
  };

  saving = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const data = this.form.getRawValue();

    this.projectService.create(data)
      .pipe(take(1))
      .subscribe({
        next: () => {
          toast.success('Projeto criado com sucesso');
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          const message = err.error?.error || 'Erro ao criar projeto';
          toast.error(message);
          this.saving.set(false);
        }
      });
  }

  goBack() {
    this.router.navigate(['/projects']);
  }
}