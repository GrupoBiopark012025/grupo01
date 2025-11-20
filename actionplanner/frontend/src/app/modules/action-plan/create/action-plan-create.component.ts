import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormMessageComponent
} from "@shared/components/zardui/form/form.component";
import { ZardInputDirective } from "@shared/components/zardui/input/input.directive";
import { ZardCardComponent } from "@shared/components/zardui/card/card.component";
import {
  ActionPlanStatusEnum,
  CreateActionPlanDto,
  descricaoActionPlanStatusEnum
} from "@data/action-plan/dtos";
import { ActionPlanDataService } from "@data/action-plan/action-plan-data.service";
import { ProjectDataService } from "@data/project/project-data.service";
import { GetProjectDto } from "@data/project/dtos";
import { UserDataService } from "@data/user/user-data.service";
import { GetUserDto } from "@data/user/dtos";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Subject, of } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-action-plan-create',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardInputDirective,
    ZardFormFieldComponent,
    ZardFormControlComponent,
    ZardFormLabelComponent,
    ZardFormMessageComponent
  ],
  templateUrl: './action-plan-create.component.html'
})
export class ActionPlanCreateComponent {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly actionPlanDataService = inject(ActionPlanDataService);
  private readonly projectDataService = inject(ProjectDataService);
  private readonly userDataService = inject(UserDataService);
  private readonly destroyRef = inject(DestroyRef);

  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  // Projetos
  projectSearchTerm = signal<string>('');
  foundProjects = signal<GetProjectDto[]>([]);
  selectedProject = signal<GetProjectDto | null>(null);
  isSearchingProjects = signal(false);
  showProjectDropdown = signal(false);
  private projectSearchSubject = new Subject<string>();

  // Responsável
  responsibleSearchTerm = signal<string>('');
  foundResponsibles = signal<GetUserDto[]>([]);
  selectedResponsible = signal<GetUserDto | null>(null);
  isSearchingResponsible = signal(false);
  showResponsibleDropdown = signal(false);
  private responsibleSearchSubject = new Subject<string>();

  form = this.fb.group({
    number: ['', [Validators.required, Validators.maxLength(50)]],
    what: ['', [Validators.required, Validators.maxLength(255)]],
    how: ['', [Validators.required, Validators.maxLength(500)]],
    responsible: ['', [Validators.required]],
    responsibleSearch: [''],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    postponedDate: [''],
    status: [ActionPlanStatusEnum.EM_ANDAMENTO, [Validators.required]],
    observations: [''],
    projectSearch: ['']
  });

  protected readonly ActionPlanStatusEnum = ActionPlanStatusEnum;
  protected readonly descricaoActionPlanStatusEnum = descricaoActionPlanStatusEnum;

  constructor() {
    // Busca de projetos com debounce
    this.projectSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        if (!searchTerm || searchTerm.trim().length < 2) {
          this.foundProjects.set([]);
          this.isSearchingProjects.set(false);
          return of([]);
        }
        this.isSearchingProjects.set(true);
        console.log('🔍 Buscando projetos com termo:', searchTerm);
        return this.projectDataService.getProjects({ name: searchTerm });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (projects) => {
        console.log('✅ Resposta da API de projetos:', projects);
        console.log('📦 Tipo da resposta:', typeof projects);
        console.log('📦 É array?', Array.isArray(projects));
        console.log('📦 Quantidade de projetos:', projects?.length);
        
        // Verifica se a resposta é um array ou se está dentro de uma propriedade
        let projectsArray: GetProjectDto[] = [];
        if (Array.isArray(projects)) {
          projectsArray = projects;
        } else if (projects && typeof projects === 'object') {
          // Pode estar em uma propriedade como 'projects', 'data', etc.
          projectsArray = (projects as any).projects || (projects as any).data || [];
        }
        
        console.log('📋 Projetos processados:', projectsArray);
        this.foundProjects.set(projectsArray);
        this.isSearchingProjects.set(false);
        
        // Garante que o dropdown apareça se houver resultados
        if (projectsArray.length > 0) {
          this.showProjectDropdown.set(true);
        }
        
        console.log('🎯 foundProjects signal atualizado:', this.foundProjects());
        console.log('🎯 showProjectDropdown:', this.showProjectDropdown());
        console.log('🎯 foundProjects().length:', this.foundProjects().length);
      },
      error: (error) => {
        console.error('❌ Erro ao buscar projetos', error);
        this.foundProjects.set([]);
        this.isSearchingProjects.set(false);
      }
    });

    // Busca de responsável com debounce
    this.responsibleSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        if (!searchTerm || searchTerm.trim().length < 2) {
          this.foundResponsibles.set([]);
          this.isSearchingResponsible.set(false);
          return of([]);
        }
        this.isSearchingResponsible.set(true);
        console.log('🔍 Buscando responsável com termo:', searchTerm);
        return this.userDataService.getUsers({ nome: searchTerm, page: 1, size: 10, orderBy: 'nome' });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        console.log('✅ Resposta da API de usuários:', response);
        
        // Extrai o array de usuários da resposta paginada
        let usersArray: GetUserDto[] = [];
        if (response && typeof response === 'object' && 'data' in response) {
          usersArray = (response as any).data || [];
        } else if (Array.isArray(response)) {
          usersArray = response;
        }
        
        console.log('📋 Usuários processados:', usersArray);
        this.foundResponsibles.set(usersArray);
        this.isSearchingResponsible.set(false);
        
        // Garante que o dropdown apareça se houver resultados
        if (usersArray.length > 0) {
          this.showResponsibleDropdown.set(true);
        }
        
        console.log('🎯 foundResponsibles signal atualizado:', this.foundResponsibles());
        console.log('🎯 showResponsibleDropdown:', this.showResponsibleDropdown());
      },
      error: (error) => {
        console.error('❌ Erro ao buscar responsável', error);
        this.foundResponsibles.set([]);
        this.isSearchingResponsible.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const value = this.form.value;

    const payload: CreateActionPlanDto = {
      number: value.number!,
      what: value.what!,
      how: value.how!,
      responsible: this.selectedResponsible()?.nome || value.responsible!,
      startDate: this.toIsoDate(value.startDate!),
      endDate: this.toIsoDate(value.endDate!, true),
      postponedDate: value.postponedDate ? this.toIsoDate(value.postponedDate) : null,
      status: value.status!,
      observations: value.observations ? value.observations : null,
      projectIds: this.selectedProject() ? [this.selectedProject()!.id] : []
    };

    this.actionPlanDataService.createActionPlan(payload)
      .subscribe({
        next: (created) => {
          this.isSubmitting.set(false);
          this.router.navigate(['/action-plans', created.id]);
        },
        error: (error) => {
          console.error('Erro ao criar plano de ação', error);
          this.isSubmitting.set(false);
          this.submitError.set('Não foi possível criar o plano de ação. Tente novamente.');
        }
      });
  }

  private toIsoDate(dateValue: string, setEndOfDay: boolean = false): string {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (setEndOfDay) {
      date.setHours(23, 59, 59, 999);
    }

    return date.toISOString();
  }

  onProjectSearchChange(value: string): void {
    console.log('⌨️ Input alterado:', value);
    
    // Se o usuário começar a digitar e já houver um projeto selecionado, limpa a seleção
    if (this.selectedProject() && value !== this.selectedProject()?.name) {
      this.selectedProject.set(null);
    }
    
    this.projectSearchTerm.set(value);
    const shouldShow = value.length >= 2;
    this.showProjectDropdown.set(shouldShow);
    console.log('🎯 showProjectDropdown definido para:', shouldShow);
    this.projectSearchSubject.next(value);
  }

  selectProject(project: GetProjectDto): void {
    console.log('📦 Projeto selecionado:', project);
    this.selectedProject.set(project);
    this.projectSearchTerm.set(project.name);
    this.form.get('projectSearch')?.setValue(project.name);
    this.showProjectDropdown.set(false);
    this.foundProjects.set([]);
  }

  clearProject(): void {
    this.selectedProject.set(null);
    this.form.get('projectSearch')?.setValue('');
    this.projectSearchTerm.set('');
    this.foundProjects.set([]);
  }

  onProjectInputFocus(): void {
    // Se houver um projeto selecionado e o campo estiver vazio, mostra o dropdown se houver busca anterior
    if (this.selectedProject()) {
      // Permite que o usuário edite ou busque novamente
      return;
    }
    
    // Se não houver projeto selecionado, mostra dropdown se houver termo de busca
    if (this.projectSearchTerm().length >= 2) {
      this.showProjectDropdown.set(true);
    }
  }

  onProjectInputBlur(): void {
    // Delay para permitir clique no dropdown
    setTimeout(() => {
      // Só fecha se não houver projetos sendo buscados ou se não houver resultados
      if (!this.isSearchingProjects() && this.foundProjects().length === 0) {
        this.showProjectDropdown.set(false);
      }
    }, 300);
  }

  onResponsibleSearchChange(value: string): void {
    console.log('⌨️ Input responsável alterado:', value);
    
    // Se o usuário começar a digitar e já houver um responsável selecionado, limpa a seleção
    if (this.selectedResponsible() && value !== this.selectedResponsible()?.nome) {
      this.selectedResponsible.set(null);
      this.form.get('responsible')?.setValue('');
    }
    
    this.responsibleSearchTerm.set(value);
    const shouldShow = value.length >= 2;
    this.showResponsibleDropdown.set(shouldShow);
    console.log('🎯 showResponsibleDropdown definido para:', shouldShow);
    this.responsibleSearchSubject.next(value);
  }

  selectResponsible(user: GetUserDto): void {
    console.log('👤 Responsável selecionado:', user);
    this.selectedResponsible.set(user);
    this.form.get('responsible')?.setValue(user.nome);
    this.form.get('responsible')?.markAsTouched();
    this.responsibleSearchTerm.set(user.nome);
    this.form.get('responsibleSearch')?.setValue(user.nome);
    this.showResponsibleDropdown.set(false);
    this.foundResponsibles.set([]);
  }

  clearResponsible(): void {
    this.selectedResponsible.set(null);
    this.form.get('responsible')?.setValue('');
    this.form.get('responsibleSearch')?.setValue('');
    this.responsibleSearchTerm.set('');
    this.foundResponsibles.set([]);
  }

  onResponsibleInputFocus(): void {
    // Se houver um responsável selecionado e o campo estiver vazio, mostra o dropdown se houver busca anterior
    if (this.selectedResponsible()) {
      // Permite que o usuário edite ou busque novamente
      return;
    }
    
    // Se não houver responsável selecionado, mostra dropdown se houver termo de busca
    if (this.responsibleSearchTerm().length >= 2) {
      this.showResponsibleDropdown.set(true);
    }
  }

  onResponsibleInputBlur(): void {
    // Delay para permitir clique no dropdown
    setTimeout(() => {
      // Só fecha se não houver usuários sendo buscados ou se não houver resultados
      if (!this.isSearchingResponsible() && this.foundResponsibles().length === 0) {
        this.showResponsibleDropdown.set(false);
      }
    }, 300);
  }
}


