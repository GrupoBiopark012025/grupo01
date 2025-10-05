import { Component, input } from '@angular/core';
import { Frown, LucideAngularModule, LucideIconData } from "lucide-angular";

@Component({
  selector: 'app-no-list-content',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './no-list-content.component.html'
})
export class NoListContentComponent {

  icon = input<LucideIconData>(Frown);
  text = input<string>('Nenhum resultado encontrado.');

}
