import { Component, inject, HostListener, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@core/services/authentication/authentication.service';
import { ZardAvatarComponent } from '@shared/components/zardui/avatar/avatar.component';
import { RouterLink } from "@angular/router";
import { UserSessionService } from "@core/services/user-session/user-session.service";
import { Building2, LucideAngularModule } from "lucide-angular";
import { ZardDialogService } from "@shared/components/zardui/dialog/dialog.service";
import {
  ChangeEnvironmentDialogComponent
} from "@shared/components/base/dialogs/change-environment-dialog/change-environment-dialog.component";

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, ZardAvatarComponent, RouterLink, LucideAngularModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  icons = ICONS;

  private readonly authService = inject(AuthenticationService);
  private readonly userSessionService = inject(UserSessionService);
  private readonly dialogService = inject(ZardDialogService);

  private _isUserMenuOpen = signal<boolean>(false);

  isUserMenuOpen = this._isUserMenuOpen.asReadonly();
  user = computed(() => this.userSessionService.user());
  userInitials = computed(() => this.userSessionService.userInitials());

  expandedMenus = {
    projetos: false,
    tarefas: false,
    relatorios: false
  };

  toggleSubmenu(menu: keyof typeof this.expandedMenus) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  toggleUserMenu() {
    this._isUserMenuOpen.update((prev) => !prev);
  }

  closeUserMenu() {
    this._isUserMenuOpen.set(false);
  }

  logout() {
    this.authService.logout(true);
    this.closeUserMenu();
  }

  changeEnvironment() {
    this.closeUserMenu();

    this.dialogService.create({
      zTitle: 'Mudar Ambiente',
      zContent: ChangeEnvironmentDialogComponent
    })
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userSection = target.closest('.user-section');
    
    if (!userSection && this._isUserMenuOpen()) {
      this.closeUserMenu();
    }
  }
}

const ICONS = {
  building: Building2
}
