import { Component, computed, input } from '@angular/core';
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { descricaoSectorStatusEnum, SectorStatusEnum } from "@data/sector/dtos";

@Component({
  selector: 'app-sector-status-badge',
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
      {{ descricaoSectorStatusEnum[status()] }}
    </z-badge>
  `
})
export class SectorStatusBadgeComponent {

  status = input.required<SectorStatusEnum>();

  isAtivo = computed(() => this.status() === SectorStatusEnum.Ativo);

  protected readonly descricaoSectorStatusEnum = descricaoSectorStatusEnum;
}
