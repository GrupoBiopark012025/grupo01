import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArrowLeftIcon, LucideAngularModule, SaveIcon } from 'lucide-angular';

import { TaskDataService } from '@data/task/task-data.service';
import { SectorDataService } from '@data/sector/sector-data.service';
import { UserSessionService } from '@core/services/user-session/user-session.service';
import { TaskStatusEnum, TaskPriorityEnum, descricaoTaskStatusEnum, descricaoTaskPriorityEnum } from '@data/task/dtos';

import { ZardInputDirective } from '@shared/components/zardui/input/input.directive';
import { ZardSelectComponent } from '@shared/components/zardui/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/zardui/select/select-item.component';
import { CustomSelectComponent } from '@shared/components/base/form-components/form-select/form-select.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule,
    ZardInputDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    CustomSelectComponent
  ],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  icons = { ArrowLeftIcon, SaveIcon };

  private readonly fb = inject(FormBuilder);
  private readonly taskDataService = inject(TaskDataService);
  private readonly sectorDataService = inject(SectorDataService);
  private readonly userSessionService = inject(UserSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  taskForm!: FormGroup;
  taskId: number | null = null;
  isEditMode = false;
  loading = signal(false);
  loadingData = signal(true);

  sectors = signal<any[]>([]);
  availableResponsibles = signal<any[]>([]);

  selectedStatus = signal<string>(TaskStatusEnum.PENDENTE);
  selectedPriority = signal<string>(TaskPriorityEnum.MEDIA);

  sectorOptions = computed(() => 
    this.sectors().map(sector => ({
      label: sector.name,
      value: sector.id
    }))
  );

  responsibleOptions = computed(() => 
    this.availableResponsibles().map(user => ({
      label: user.nome,
      value: user.id
    }))
  );

  statusOptions = Object.values(TaskStatusEnum).map(value => ({
    value,
    label: descricaoTaskStatusEnum[value]
  }));

  priorityOptions = Object.values(TaskPriorityEnum).map(value => ({
    value,
    label: descricaoTaskPriorityEnum[value]
  }));

  ngOnInit(): void {
    this.initForm();
    this.loadFormData();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.taskId = +id;
      this.isEditMode = true;
      this.loadTask();
    } else {
      this.loadingData.set(false);
    }
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(5000)]],
      status: [TaskStatusEnum.PENDENTE, Validators.required],
      priority: [TaskPriorityEnum.MEDIA, Validators.required],
      dueDate: [''],
      sectorId: [null, Validators.required],
      userResponsibleId: [null]
    });

    this.selectedStatus.set(TaskStatusEnum.PENDENTE);
    this.selectedPriority.set(TaskPriorityEnum.MEDIA);
  }


  loadFormData(): void {
    const user = this.userSessionService.user();

    this.sectorDataService.getSectors({ page: 1, size: 100 }).subscribe({
      next: (response) => {
        this.sectors.set(response.data || []);
      },
      error: (error) => {
        console.error('Erro ao carregar setores:', error);
      }
    });

    this.taskDataService.getAvailableResponsibles().subscribe({
      next: (responsibles) => {
        this.availableResponsibles.set(responsibles);
      },
      error: (error) => {
        console.error('Erro ao carregar responsáveis:', error);
      }
    });
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.loadingData.set(true);
    this.taskDataService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          sectorId: task.sectorId || null,
          userResponsibleId: task.userResponsibleId || null
        });
        
        this.selectedStatus.set(task.status);
        this.selectedPriority.set(task.priority);
        
        this.loadingData.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar tarefa:', error);
        alert('Erro ao carregar tarefa');
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const formValue = this.taskForm.value;
    
    // Converter valores para o formato correto do DTO
    const taskData = {
      title: formValue.title,
      description: formValue.description || undefined,
      status: formValue.status,
      priority: formValue.priority,
      sectorId: formValue.sectorId ? Number(formValue.sectorId) : undefined,
      userResponsibleId: formValue.userResponsibleId ? Number(formValue.userResponsibleId) : undefined,
      // NÃO envia clienteId - o backend define automaticamente
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined
    };

    const request = this.isEditMode
      ? this.taskDataService.updateTask(this.taskId!, taskData)
      : this.taskDataService.createTask(taskData);

    request.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Erro ao salvar tarefa:', error);
        alert(error.error?.error || 'Erro ao salvar tarefa');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (!field?.errors || !field.touched) return '';

    if (field.errors['required']) return 'Campo obrigatório';
    if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
    
    return '';
  }

  onStatusChange(value: string): void {
    this.selectedStatus.set(value);
    this.taskForm.patchValue({ status: value });
    this.taskForm.markAsDirty();
  }

  onPriorityChange(value: string): void {
    this.selectedPriority.set(value);
    this.taskForm.patchValue({ priority: value });
    this.taskForm.markAsDirty();
  }
}