import { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '@shared/utils/zardui/merge-classes';

@Component({
  selector: 'z-table-body, tbody[z-table-body]',
  exportAs: 'zTableBody',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableBodyComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses('[&_tr:last-child]:border-0', this.class()),
  );
}
