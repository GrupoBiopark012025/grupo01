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
    nome: '',
    sigla: '',
    descricao: '',
    status: 'ATIVO',
    cor: '#3B82F6'
  });

  // Estado de carregamento
  isLoading = signal(false);
  isLoadingData = signal(true);
  
  // Estado de validação
  errors = signal({
    nome: '',
    sigla: '',
    descricao: ''
  });

  // Computed para verificar se o formulário é válido
  isFormValid = computed(() => {
    const currentSetor = this.setor();
    const currentErrors = this.errors();
    
    return (
      currentSetor.nome?.trim() !== '' &&
      currentSetor.sigla?.trim() !== '' &&
      currentErrors.nome === '' &&
      currentErrors.sigla === '' &&
      currentErrors.descricao === ''
    );
  });

  // Opções de status
  statusOptions = [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' }
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
        nome: setorData.nome,
        sigla: setorData.sigla,
        descricao: setorData.descricao,
        status: setorData.status,
        cor: setorData.cor
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
  updateNome(nome: string) {
    this.setor.update(current => ({ ...current, nome }));
    this.validateNome();
  }

  updateSigla(sigla: string) {
    // Converter para maiúsculo e limitar a 10 caracteres
    const siglaFormatted = sigla.toUpperCase().slice(0, 10);
    this.setor.update(current => ({ ...current, sigla: siglaFormatted }));
    this.validateSigla();
  }

  updateDescricao(descricao: string) {
    this.setor.update(current => ({ ...current, descricao }));
    this.validateDescricao();
  }

  updateStatus(status: 'ATIVO' | 'INATIVO') {
    this.setor.update(current => ({ ...current, status }));
  }

  updateCor(cor: string) {
    this.setor.update(current => ({ ...current, cor }));
  }

  // Validações
  validateNome() {
    const nome = this.setor().nome?.trim() || '';
    let error = '';
    
    if (!nome) {
      error = 'Nome é obrigatório';
    } else if (nome.length < 2) {
      error = 'Nome deve ter pelo menos 2 caracteres';
    } else if (nome.length > 50) {
      error = 'Nome deve ter no máximo 50 caracteres';
    }
    
    this.errors.update(current => ({ ...current, nome: error }));
  }

  validateSigla() {
    const sigla = this.setor().sigla?.trim() || '';
    let error = '';
    
    if (!sigla) {
      error = 'Sigla é obrigatória';
    } else if (sigla.length < 2) {
      error = 'Sigla deve ter pelo menos 2 caracteres';
    } else if (sigla.length > 5) {
      error = 'Sigla deve ter no máximo 5 caracteres';
    }
    
    this.errors.update(current => ({ ...current, sigla: error }));
  }

  validateDescricao() {
    const descricao = this.setor().descricao?.trim() || '';
    let error = '';
    
    if (descricao.length > 160) {
      error = 'Descrição deve ter no máximo 160 caracteres';
    }
    
    this.errors.update(current => ({ ...current, descricao: error }));
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
        nome: setorData.nome,
        sigla: setorData.sigla,
        descricao: setorData.descricao,
        status: setorData.status,
        cor: setorData.cor,
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
        nome: setorData.nome!,
        sigla: setorData.sigla!,
        descricao: setorData.descricao || '',
        status: setorData.status!,
        cor: setorData.cor!
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
          if (validationErrors.nome) {
            this.errors.update(current => ({ ...current, nome: validationErrors.nome }));
          }
          if (validationErrors.sigla) {
            this.errors.update(current => ({ ...current, sigla: validationErrors.sigla }));
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
    this.validateNome();
    this.validateSigla();
    this.validateDescricao();
  }

  // Método para cancelar
  onCancel() {
    this.router.navigate(['/setores']);
  }
}
