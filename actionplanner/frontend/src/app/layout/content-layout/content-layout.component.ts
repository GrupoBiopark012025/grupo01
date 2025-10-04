import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "@layout/content-layout/header/header.component";
import { SidebarComponent } from "@layout/content-layout/sidebar/sidebar.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ContentLayoutService } from "@layout/content-layout/content-layout.service";
import { BreadcrumbComponent } from "@shared/components/base/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-content-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent
  ],
  templateUrl: './content-layout.component.html'
})
export class ContentLayoutComponent {
  readonly dataService = inject(ContentLayoutService);
  private readonly destoyRef = inject(DestroyRef);

  constructor() {
    this.dataService.getSessionData()
      .pipe(takeUntilDestroyed(this.destoyRef))
      .subscribe();
  }
}
