import { Component, input, output } from '@angular/core';
import { Check, LucideAngularModule, Star } from "lucide-angular";
import { ZardCheckboxComponent } from "@shared/components/zardui/checkbox/checkbox.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-check-clickable',
  imports: [
    LucideAngularModule,
    ZardCheckboxComponent,
    FormsModule
  ],
  templateUrl: './check-clickable.component.html'
})
export class CheckClickableComponent {
  icons = ICONS;

  checked = input<boolean>(false);
  stared = input<boolean>(false);
  disabled = input<boolean>(false);

  onCheck = output<void>();
  onStar = output<void>();

  onCheckClick() {
    this.onCheck.emit();
  }

  onStarClick($event: Event) {
    $event.stopPropagation();

    this.onStar.emit();
  }
}

const ICONS = {
  check: Check,
  star: Star
}
