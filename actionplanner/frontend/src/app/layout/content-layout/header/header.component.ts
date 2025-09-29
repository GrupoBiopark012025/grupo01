import { Component } from '@angular/core';
import { ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbSeparatorComponent } from '@shared/components/zardui/breadcrumb/breadcrumb.component';
import { ZardAvatarComponent } from '@shared/components/zardui/avatar/avatar.component';

@Component({
  selector: 'app-header',
  imports: [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbSeparatorComponent, ZardAvatarComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Dados do usuário (temporário - mesmo da sidebar)
  get currentUser() {
    return {
      name: 'Usuário estático',
    };
  }
}
