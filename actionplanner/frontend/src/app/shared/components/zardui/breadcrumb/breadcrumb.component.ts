import { ClassValue } from 'clsx';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { mergeClasses } from '@shared/utils/zardui/merge-classes';
import { 
  breadcrumbVariants, 
  breadcrumbItemVariants, 
  breadcrumbSeparatorVariants,
  ZardBreadcrumbVariants,
  ZardBreadcrumbItemVariants,
  ZardBreadcrumbSeparatorVariants
} from './breadcrumb.variants';

@Component({
  selector: 'z-breadcrumb',
  exportAs: 'zBreadcrumb',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav [class]="classes()" aria-label="breadcrumb">
      <ol class="flex items-center space-x-1">
        <ng-content></ng-content>
      </ol>
    </nav>
  `,
})
export class ZardBreadcrumbComponent {
  readonly zSize = input<ZardBreadcrumbVariants['zSize']>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(breadcrumbVariants({ zSize: this.zSize() }), this.class())
  );
}

@Component({
  selector: 'z-breadcrumb-item',
  exportAs: 'zBreadcrumbItem',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <li [class]="classes()">
      @if (routerLink()) {
        <a [routerLink]="routerLink()" class="hover:underline">
          <ng-content></ng-content>
        </a>
      } @else {
        <span>
          <ng-content></ng-content>
        </span>
      }
    </li>
  `,
})
export class ZardBreadcrumbItemComponent {
  readonly routerLink = input<string | string[]>();
  readonly zActive = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(breadcrumbItemVariants({ zActive: this.zActive() }), this.class())
  );
}

@Component({
  selector: 'z-breadcrumb-separator',
  exportAs: 'zBreadcrumbSeparator',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <li [class]="classes()" aria-hidden="true">
      <ng-content>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </ng-content>
    </li>
  `,
})
export class ZardBreadcrumbSeparatorComponent {
  readonly zSize = input<ZardBreadcrumbSeparatorVariants['zSize']>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(breadcrumbSeparatorVariants({ zSize: this.zSize() }), this.class())
  );
}
