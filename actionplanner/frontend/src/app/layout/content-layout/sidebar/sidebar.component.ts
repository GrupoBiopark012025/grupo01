import { Component, inject, HostListener, computed, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@core/services/authentication/authentication.service';
import { ZardAvatarComponent } from '@shared/components/zardui/avatar/avatar.component';
import { Router, RouterLink } from "@angular/router";
import { UserSessionService } from "@core/services/user-session/user-session.service";
import { Building2, LucideAngularModule } from "lucide-angular";
import { ZardDialogService } from "@shared/components/zardui/dialog/dialog.service";
import {
  ChangeEnvironmentDialogComponent
} from "@shared/components/base/dialogs/change-environment-dialog/change-environment-dialog.component";
import { take } from "rxjs";
import { toast } from "ngx-sonner";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
    this.closeUserMenu();
    this.authService.logout(true);
  }

  changeEnvironment() {
    this.closeUserMenu();

    const dialogRef = this.dialogService.create({
      zTitle: 'Mudar Ambiente',
      zContent: ChangeEnvironmentDialogComponent,
      zOkText: null
    });

    const dialog = dialogRef.componentInstance as ChangeEnvironmentDialogComponent;

    dialog.onChangeEnvironment
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        toast.success('Troca de ambiente realizada com sucesso.');
        dialogRef.close();
        this.router.navigate(['home']);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userSection = target.closest('.user-section');
    
    if (!userSection && this._isUserMenuOpen()) {
      this.closeUserMenu();
    }
  }

  getTasksTitle(): string {
    const user = this.user();
    if (!user) return 'Tarefas';
    
    if (user.isAdmin) {
      return 'Todas as Tarefas';
    } else if (user.onlyAttachedTasks) {
      return 'Minhas Tarefas';
    } else {
      return 'Tarefas';
    }
  }
}

const ICONS = {
  building: Building2
}
