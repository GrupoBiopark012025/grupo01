import { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '@shared/utils/zardui/merge-classes';

@Component({
  selector: 'z-table-row, tr[z-table-row]',
  exportAs: 'zTableRow',
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
export class ZardTableRowComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', this.class()),
  );
}
