import { Component, computed, input, output } from '@angular/core';
import { Check, ChevronRight, LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-direct-select-clickable',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './direct-select-clickable.component.html'
})
export class DirectSelectClickableComponent {
  icons = ICONS;

  disabled = input<boolean>(false);
  active = input<boolean>(false);

  isActiveOrDisabled = computed(() => this.disabled() || this.active());

  onClick = output<void>();
}

const ICONS = {
  chevronRight: ChevronRight,
  check: Check
}
