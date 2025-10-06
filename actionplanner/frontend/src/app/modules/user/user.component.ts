import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-user',
  imports: [
    RouterOutlet
  ],
  template: `
    <div>
      <router-outlet />
    </div>
  `
})
export class UserComponent {}
