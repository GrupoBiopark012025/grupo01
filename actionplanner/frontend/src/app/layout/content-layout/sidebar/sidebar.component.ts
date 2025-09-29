import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@core/services/authentication/authentication.service';
import { ZardAvatarComponent } from '@shared/components/zardui/avatar/avatar.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, ZardAvatarComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  private readonly authService = inject(AuthenticationService);
  
  // Estado dos submenus
  expandedMenus = {
    projetos: false,
    tarefas: false,
    relatorios: false
  };

  // Estado do menu do usuário
  userMenuOpen = false;

  // Toggle submenu
  toggleSubmenu(menu: keyof typeof this.expandedMenus) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  // Toggle menu do usuário
  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  // Fechar menu do usuário
  closeUserMenu() {
    this.userMenuOpen = false;
  }

  // Método de logout
  logout() {
    this.authService.logout(true);
    this.closeUserMenu();
  }

  // Getter para informações do usuário (temporário - sem localStorage)
  get currentUser() {
    return {
      name: 'Usuario Estático',
    };
  }

  // Fechar menu do usuário ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userSection = target.closest('.user-section');
    
    if (!userSection && this.userMenuOpen) {
      this.closeUserMenu();
    }
  }
}