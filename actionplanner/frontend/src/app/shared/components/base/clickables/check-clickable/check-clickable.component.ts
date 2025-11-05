import { Component, input, output } from '@angular/core';
import { Check, LucideAngularModule } from "lucide-angular";
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
  disabled = input<boolean>(false);

  onCheck = output<void>();
}

const ICONS = {
  check: Check
}
