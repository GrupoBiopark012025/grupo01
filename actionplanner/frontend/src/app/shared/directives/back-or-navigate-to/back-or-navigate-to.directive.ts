import { Directive, HostListener, inject, input, signal } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';

@Directive({
  selector: '[backOrNavigateTo]'
})
export class BackOrNavigateToDirective {

  backOrNavigateTo = input.required<(number | string)[]>();

  private _hasPreviousRoute = signal<boolean>(false);

  private router = inject(Router);
  private location = inject(Location);

  constructor() {
    const previousUrl = this.router.lastSuccessfulNavigation?.previousNavigation?.finalUrl?.toString();
    this._hasPreviousRoute.set(!!previousUrl && previousUrl.startsWith('/'));
  }

  @HostListener('click')
  onClick() {
    if (this._hasPreviousRoute()) {
      return this.location.back();
    }

    this.router.navigate(this.backOrNavigateTo());
  }
}
