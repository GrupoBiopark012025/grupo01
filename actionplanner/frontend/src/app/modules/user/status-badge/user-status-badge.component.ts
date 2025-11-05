import { Component, computed, input } from '@angular/core';
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { descricaoUserStatusEnum, UserStatusEnum } from "@data/user/dtos";

@Component({
  selector: 'app-user-status-badge',
  imports: [
    ZardBadgeComponent
  ],
  template: `
    <z-badge
      zType="outline"
      class="transition-colors"
      [class]="isAtivo()
        ? 'text-green-400 border-green-400 hover:text-green-300 hover:border-green-300'
        : 'text-red-400 border-red-400 hover:text-red-300 hover:border-red-300'
      "
    >
      {{ descricaoUserStatusEnum[status()] }}
    </z-badge>
  `
})
export class UserStatusBadgeComponent {

  status = input.required<UserStatusEnum>();

  isAtivo = computed(() => this.status() === UserStatusEnum.Ativo);

  protected readonly descricaoUserStatusEnum = descricaoUserStatusEnum;
}
