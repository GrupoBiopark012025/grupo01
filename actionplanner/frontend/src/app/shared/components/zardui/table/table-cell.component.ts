import { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '@shared/utils/zardui/merge-classes';

@Component({
  selector: 'z-table-cell, td[z-table-cell]',
  exportAs: 'zTableCell',
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
export class ZardTableCellComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses('p-4 align-middle [&:has([role=checkbox])]:pr-0', this.class()),
  );
}
