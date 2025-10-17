import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ZardFormModule } from '@shared/components/zardui/form/form.module';
import { ZardInputDirective } from '@shared/components/zardui/input/input.directive';
import { ZardButtonComponent } from '@shared/components/zardui/button/button.component';
import { ZardCardComponent } from '@shared/components/zardui/card/card.component';

import { Setor } from '../setor.model';
import { SetorDataService } from '../setor-data.service';

@Component({
  selector: 'app-setor-edit',
  imports: [
    FormsModule,
    JsonPipe,
    ZardFormModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardCardComponent
  ],
  templateUrl: './setor-edit.component.html',
  styleUrl: './setor-edit.component.css'
})
export class SetorEditComponent implements OnInit {
  // Injeção de dependências
  private setorDataService = inject(SetorDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ID do setor sendo editado
  setorId: number | null = null;

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
  isLoadingData = signal(true);
  
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

  ngOnInit() {
    // Capturar ID da rota
    this.route.params.subscribe(params => {
      this.setorId = +params['id'];
      if (this.setorId) {
        this.loadSetorData();
      }
    });
  }

  // Carregar dados do setor
  async loadSetorData() {
    if (!this.setorId) return;

    this.isLoadingData.set(true);
    
    try {
      const setorData = await firstValueFrom(this.setorDataService.findById(this.setorId));
      if (!setorData) {
        throw new Error('Setor não encontrado');
      }
      
      console.log('📋 Dados do setor carregados:', setorData);
      
      // Preencher formulário com dados do setor
      this.setor.set({
        name: setorData.name,
        acronym: setorData.acronym,
        description: setorData.description,
        status: setorData.status,
        color: setorData.color
      });
      
    } catch (error) {
      console.error('Erro ao carregar setor:', error);
      alert('Erro ao carregar dados do setor. Tente novamente.');
      this.router.navigate(['/setores']);
    } finally {
      this.isLoadingData.set(false);
    }
  }

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

  // Método para salvar (atualizar)
  async onSave() {
    if (!this.setorId) {
      console.error('ID do setor não encontrado');
      return;
    }

    if (!this.isFormValid()) {
      this.validateAllFields();
      return;
    }

    this.isLoading.set(true);
    
    try {
      const setorData = this.setor();
      
      // Console dos dados do formulário
      console.log('📋 Dados do formulário sendo enviados:', {
        id: this.setorId,
        name: setorData.name,
        acronym: setorData.acronym,
        description: setorData.description,
        status: setorData.status,
        color: setorData.color,
        timestamp: new Date().toISOString()
      });
      
      // Verificar token de autenticação
      const token = localStorage.getItem('egAccessToken');
      console.log('🔐 Token de autenticação:', {
        token: token ? 'Token encontrado' : 'Token não encontrado',
        tokenValue: token ? `${token.substring(0, 20)}...` : null,
        authorizationHeader: token ? `Bearer ${token.substring(0, 20)}...` : 'Sem token'
      });
      
      // Atualizar o setor via API
      const setorAtualizado = await this.setorDataService.update(this.setorId, {
        name: setorData.name!,
        acronym: setorData.acronym!,
        description: setorData.description || '',
        status: setorData.status!,
        color: setorData.color!
      });
      
      console.log('Setor atualizado com sucesso:', setorAtualizado);
      
      // Navegar para a lista de setores após sucesso
      this.router.navigate(['/setores']);
      
    } catch (error) {
      console.error('Erro ao atualizar setor:', error);
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro ao atualizar setor. Tente novamente.';
      
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

  // Método para cancelar
  onCancel() {
    this.router.navigate(['/setores']);
  }
}
