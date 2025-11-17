import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";

@Component({
  selector: 'app-action-plan-create',
  imports: [
    RouterLink,
    ZardButtonComponent
  ],
  templateUrl: './action-plan-create.component.html'
})
export class ActionPlanCreateComponent {
}

