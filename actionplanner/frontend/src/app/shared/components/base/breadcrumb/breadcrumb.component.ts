import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, startWith } from "rxjs";
import {
  ZardBreadcrumbComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent, ZardBreadcrumbListComponent,
  ZardBreadcrumbPageComponent, ZardBreadcrumbSeparatorComponent
} from "@shared/components/zardui/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-breadcrumb',
  imports: [
    ZardBreadcrumbComponent,
    ZardBreadcrumbItemComponent,
    ZardBreadcrumbSeparatorComponent,
    ZardBreadcrumbListComponent,
    ZardBreadcrumbLinkComponent,
    ZardBreadcrumbPageComponent
  ],
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {
  data = input<Breadcrumb[]>();

  private _breadcrumbs = signal<Breadcrumb[]>([]);
  breadcrumbs = this._breadcrumbs.asReadonly();

  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const appRoute = this.activatedRoute.root.firstChild;
    const contentLayoutRoute = appRoute!.firstChild!;

    this.router.events
      .pipe(
        startWith(new NavigationEnd(0, '', '')),
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this._breadcrumbs.set(
          this.createBreadcrumbs(
            contentLayoutRoute,
            '',
            [{ label: 'Início', url: '/home' }])
        )
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string,
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    if (!route.children.length) { return breadcrumbs; }

    const childRoute = route.children[0];

    const label = (childRoute.snapshot.title as string || '').replace('- ActionPlanner', '').trim();
    const hasUrl = childRoute.snapshot.url.length > 0

    if (label && hasUrl) {
      const routeUrl = childRoute
        .snapshot
        .url
        .map((urlSegment) => urlSegment.path).join('/');

      url += `/${routeUrl}`;

      breadcrumbs.push({ label, url });
    }

    return this.createBreadcrumbs(childRoute, url, breadcrumbs);
  }
}

export interface Breadcrumb {
  label: string;
  url: string;
}
