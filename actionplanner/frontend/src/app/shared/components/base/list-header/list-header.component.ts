import { Component, input, output } from '@angular/core';
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";

@Component({
  selector: 'app-list-header',
  standalone: true,
  imports: [
    ZardButtonComponent
  ],
  templateUrl: './list-header.component.html'
})
export class ListHeaderComponent {
  title = input.required<string>();
  actionTitle = input.required<string>();
  actionVariant = input<string>('default');

  onActionClicked = output<void>();
}