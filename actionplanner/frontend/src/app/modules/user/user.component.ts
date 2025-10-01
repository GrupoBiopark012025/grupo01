import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-user',
  imports: [
    RouterOutlet
  ],
  template: `
    <div class="container py-3">
      <router-outlet />
    </div>
  `
})
export class UserComponent {}
