import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ZardFormModule } from '@shared/components/zardui/form/form.module';
import { ZardInputDirective } from '@shared/components/zardui/input/input.directive';
import { ZardButtonComponent } from '@shared/components/zardui/button/button.component';
import { ZardCardComponent } from '@shared/components/zardui/card/card.component';

import { Setor } from '../setor.model';
import { SetorDataService } from '../setor-data.service';

@Component({
  selector: 'app-setor-form',
  imports: [
    FormsModule,
    JsonPipe,
    ZardFormModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardCardComponent
  ],
  templateUrl: './setor-form.component.html',
  styleUrl: './setor-form.component.css'
})
export class SetorFormComponent {
  // Injeção de dependências
  private setorDataService = inject(SetorDataService);
  private router = inject(Router);

  // Estado do formulário usando signals
  setor = signal<Partial<Setor>>({
    name: '',
    acronym: '',
    description: '',
    status: 'ativo',
    color: '#3B82F6'
  });

  // Estado de carregamento
  isLoading = signal(false);
  
  // Estado de validação
  errors = signal({
    name: '',
    acronym: '',
    description: ''
  });

  // Computed para verificar se o formulário é válido
  isFormValid = computed(() => {
    const currentSetor = this.setor();
    const currentErrors = this.errors();
    
    return (
      currentSetor.name?.trim() !== '' &&
      currentSetor.acronym?.trim() !== '' &&
      currentErrors.name === '' &&
      currentErrors.acronym === '' &&
      currentErrors.description === ''
    );
  });

  // Opções de status
  statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' }
  ] as const;

  // Cores predefinidas
  coresDisponiveis = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16'  // Lime
  ];

  // Métodos para atualizar o setor
  updateName(name: string) {
    this.setor.update(current => ({ ...current, name }));
    this.validateName();
  }

  updateAcronym(acronym: string) {
    // Converter para maiúsculo e limitar a 10 caracteres
    const acronymFormatted = acronym.toUpperCase().slice(0, 10);
    this.setor.update(current => ({ ...current, acronym: acronymFormatted }));
    this.validateAcronym();
  }

  updateDescription(description: string) {
    this.setor.update(current => ({ ...current, description }));
    this.validateDescription();
  }

  updateStatus(status: 'ativo' | 'inativo') {
    this.setor.update(current => ({ ...current, status }));
  }

  updateColor(color: string) {
    this.setor.update(current => ({ ...current, color }));
  }

  // Validações
  validateName() {
    const name = this.setor().name?.trim() || '';
    let error = '';
    
    if (!name) {
      error = 'Nome é obrigatório';
    } else if (name.length < 2) {
      error = 'Nome deve ter pelo menos 2 caracteres';
    } else if (name.length > 50) {
      error = 'Nome deve ter no máximo 50 caracteres';
    }
    
    this.errors.update(current => ({ ...current, name: error }));
  }

  validateAcronym() {
    const acronym = this.setor().acronym?.trim() || '';
    let error = '';
    
    if (!acronym) {
      error = 'Sigla é obrigatória';
    } else if (acronym.length < 2) {
      error = 'Sigla deve ter pelo menos 2 caracteres';
    } else if (acronym.length > 5) {
      error = 'Sigla deve ter no máximo 5 caracteres';
    }
    
    this.errors.update(current => ({ ...current, acronym: error }));
  }

  validateDescription() {
    const description = this.setor().description?.trim() || '';
    let error = '';
    
    if (description.length > 160) {
      error = 'Descrição deve ter no máximo 160 caracteres';
    }
    
    this.errors.update(current => ({ ...current, description: error }));
  }

  // Método para salvar
  async onSave() {
    if (!this.isFormValid()) {
      this.validateAllFields();
      return;
    }

    this.isLoading.set(true);
    
    try {
      const setorData = this.setor();
      
      // Console dos dados do formulário
      console.log('📋 Dados do formulário sendo enviados:', {
        name: setorData.name,
        acronym: setorData.acronym,
        description: setorData.description,
        status: setorData.status,
        color: setorData.color,
        timestamp: new Date().toISOString()
      });
      
      // Criar o setor via API
      const setorCriado = await this.setorDataService.create({
        name: setorData.name!,
        acronym: setorData.acronym!,
        description: setorData.description || '',
        status: setorData.status!,
        color: setorData.color!
      });
      
      console.log('Setor criado com sucesso:', setorCriado);
      
      // Navegar para a lista de setores após sucesso
      this.router.navigate(['/setores']);
      
    } catch (error) {
      console.error('Erro ao salvar setor:', error);
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro ao cadastrar setor. Tente novamente.';
      
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as any;
        if (apiError.error?.message) {
          errorMessage = apiError.error.message;
        } else if (apiError.error?.errors) {
          // Se houver erros de validação específicos
          const validationErrors = apiError.error.errors;
          if (validationErrors.name) {
            this.errors.update(current => ({ ...current, name: validationErrors.name }));
          }
          if (validationErrors.acronym) {
            this.errors.update(current => ({ ...current, acronym: validationErrors.acronym }));
          }
          errorMessage = 'Verifique os campos destacados e tente novamente.';
        }
      }
      
      alert(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Validar todos os campos
  validateAllFields() {
    this.validateName();
    this.validateAcronym();
    this.validateDescription();
  }

  // Reset do formulário
  resetForm() {
    this.setor.set({
      name: '',
      acronym: '',
      description: '',
      status: 'ativo',
      color: '#3B82F6'
    });
    
    this.errors.set({
      name: '',
      acronym: '',
      description: ''
    });
  }

  // Método para cancelar
  onCancel() {
    this.router.navigate(['/setores']);
  }
}
