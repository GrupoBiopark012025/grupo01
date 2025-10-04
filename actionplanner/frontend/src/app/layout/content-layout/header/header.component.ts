import { Component, computed, inject } from '@angular/core';
import { ZardAvatarComponent } from '@shared/components/zardui/avatar/avatar.component';
import { Bell, LucideAngularModule } from "lucide-angular";
import { NgOptimizedImage } from "@angular/common";
import { UserSessionService } from "@core/services/user-session/user-session.service";

@Component({
  selector: 'app-header',
  imports: [
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
