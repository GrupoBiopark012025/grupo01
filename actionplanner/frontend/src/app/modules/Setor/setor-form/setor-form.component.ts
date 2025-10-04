import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { ZardFormModule } from '@shared/components/zardui/form/form.module';
import { ZardInputDirective } from '@shared/components/zardui/input/input.directive';
import { ZardButtonComponent } from '@shared/components/zardui/button/button.component';
import { ZardCardComponent } from '@shared/components/zardui/card/card.component';

import { Setor } from '../setor.model';

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

  // Método para salvar
  async onSave() {
    if (!this.isFormValid()) {
      this.validateAllFields();
      return;
    }

    this.isLoading.set(true);
    
    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Setor salvo:', this.setor());
      
      // Reset do formulário após salvar
      this.resetForm();
      
      // Aqui você pode adicionar notificação de sucesso
      alert('Setor cadastrado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar setor:', error);
      alert('Erro ao cadastrar setor. Tente novamente.');
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

  // Reset do formulário
  resetForm() {
    this.setor.set({
      nome: '',
      sigla: '',
      descricao: '',
      status: 'ATIVO',
      cor: '#3B82F6'
    });
    
    this.errors.set({
      nome: '',
      sigla: '',
      descricao: ''
    });
  }

  // Método para cancelar
  onCancel() {
    this.resetForm();
  }
}
