import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { 
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent
} from '@shared/components/zardui/table';
import { ZardButtonComponent } from '@shared/components/zardui/button/button.component';
import { ZardBadgeComponent } from '@shared/components/zardui/badge/badge.component';
import { ZardCardComponent } from '@shared/components/zardui/card/card.component';

import { Setor } from '../setor.model';
import { SetorDataService } from '../setor-data.service';

@Component({
  selector: 'app-setor-list',
  imports: [
    ZardTableComponent,
    ZardTableHeaderComponent,
    ZardTableBodyComponent,
    ZardTableRowComponent,
    ZardTableHeadComponent,
    ZardTableCellComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardCardComponent
  ],
  templateUrl: './setor-list.component.html',
  styleUrl: './setor-list.component.css'
})
export class SetorListComponent implements OnInit {
  private router = inject(Router);
  private setorDataService = inject(SetorDataService);

  // Lista de setores
  setores = signal<Setor[]>([]);
  isLoading = signal(false);
  
  // Filtros de busca
  searchTerm = signal('');
  statusFilter = signal<'TODOS' | 'ativo' | 'inativo'>('TODOS');

  ngOnInit() {
    this.loadSetores();
  }

  // Carregar setores
  async loadSetores() {
    this.isLoading.set(true);
    try {
      const setores = await firstValueFrom(this.setorDataService.findAll());
      this.setores.set(setores || []);
    } catch (error) {
      console.error('❌ [SetorList] Erro ao carregar setores:', error);
      alert('Erro ao carregar setores. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // Buscar setores com filtros
  async searchSetores() {
    this.isLoading.set(true);
    try {
      const filtros = {
        search: this.searchTerm(),
        status: this.statusFilter() !== 'TODOS' ? this.statusFilter() as 'ativo' | 'inativo' : undefined
      };
      
      const setores = await firstValueFrom(this.setorDataService.search(filtros));
      this.setores.set(setores || []);
    } catch (error) {
      console.error('❌ [SetorList] Erro ao buscar setores:', error);
      alert('Erro ao buscar setores. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // Atualizar termo de busca
  updateSearchTerm(term: string) {
    this.searchTerm.set(term);
    this.searchSetores();
  }

  // Atualizar filtro de status
  updateStatusFilter(status: 'TODOS' | 'ativo' | 'inativo') {
    this.statusFilter.set(status);
    this.searchSetores();
  }

  // Limpar filtros
  clearFilters() {
    this.searchTerm.set('');
    this.statusFilter.set('TODOS');
    this.loadSetores();
  }

  // Navegar para cadastro
  navigateToCreate() {
    this.router.navigate(['/setores/cadastrar']);
  }

  // Navegar para edição
  navigateToEdit(id: number) {
    this.router.navigate(['/setores/editar', id]);
  }


  // Visualizar setor - redireciona para edição (já que não temos rota de visualização)
  viewSetor(id: number) {
    this.router.navigate(['/setores/editar', id]);
  }

  // Obter variante do badge baseado no status
  getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'ativo':
        return 'default';
      case 'inativo':
        return 'secondary';
      default:
        return 'outline';
    }
  }

}
