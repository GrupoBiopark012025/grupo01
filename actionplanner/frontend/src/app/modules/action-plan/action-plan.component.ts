import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-action-plan',
  imports: [
    RouterOutlet
  ],
  template: `
    <div>
      <router-outlet />
    </div>
  `
})
export class ActionPlanComponent {}

