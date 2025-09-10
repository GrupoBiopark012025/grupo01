import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: `<router-outlet></router-outlet>`
})
export class AppComponent {
  protected readonly title = signal('actionplanner-frontend');
}
