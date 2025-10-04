import { Component, computed, inject, input } from '@angular/core';
import { ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbSeparatorComponent } from '@shared/components/zardui/breadcrumb/breadcrumb.component';
import { ZardAvatarComponent } from '@shared/components/zardui/avatar/avatar.component';
import { GetUserDataDto } from "@data/user/dtos";
import { Bell, LucideAngularModule } from "lucide-angular";
import { NgOptimizedImage } from "@angular/common";
import { UserSessionService } from "@core/services/user-session/user-session.service";

@Component({
  selector: 'app-header',
  imports: [
    ZardBreadcrumbComponent,
    ZardBreadcrumbItemComponent,
    ZardBreadcrumbSeparatorComponent,
    ZardAvatarComponent,
    LucideAngularModule,
    NgOptimizedImage
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  icons = ICONS;

  private readonly userSessionService = inject(UserSessionService);

  userInitials = computed(() => this.userSessionService.userInitials());
}

const ICONS = {
  notificationBell: Bell
}
