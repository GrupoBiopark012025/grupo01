import { Component, input, output } from '@angular/core';
import { Check, LucideAngularModule, Star } from "lucide-angular";
import { ZardCheckboxComponent } from "@shared/components/zardui/checkbox/checkbox.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-check-star-clickable',
  imports: [
    LucideAngularModule,
    ZardCheckboxComponent,
    FormsModule
  ],
  templateUrl: './check-star-clickable.component.html'
})
export class CheckStarClickableComponent {
  icons = ICONS;

  checked = input<boolean>(false);
  stared = input<boolean>(false);
  disabled = input<boolean>(false);

  onCheck = output<void>();
  onStar = output<void>();

  onStarClick($event: Event) {
    $event.stopPropagation();

    this.onStar.emit();
  }
}

const ICONS = {
  check: Check,
  star: Star
}
