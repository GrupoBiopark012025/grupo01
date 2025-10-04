import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-error-layout',
  imports: [
    RouterOutlet
  ],
  template: `
    <router-outlet />
  `
})
export class ErrorLayoutComponent {}
