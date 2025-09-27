import { ClassValue } from 'clsx';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '@shared/utils/zardui/merge-classes';
import { avatarVariants, ZardAvatarVariants } from './avatar.variants';

@Component({
  selector: 'z-avatar',
  exportAs: 'zAvatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" class="aspect-square h-full w-full object-cover" />
    } @else {
      <span class="font-medium">
        {{ fallback() }}
      </span>
    }
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardAvatarComponent {
  readonly src = input<string>();
  readonly alt = input<string>('Avatar');
  readonly fallback = input<string>('');
  
  readonly zSize = input<ZardAvatarVariants['zSize']>('default');
  readonly zShape = input<ZardAvatarVariants['zShape']>('circle');
  readonly zVariant = input<ZardAvatarVariants['zVariant']>('default');
  
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      avatarVariants({ 
        zSize: this.zSize(), 
        zShape: this.zShape(), 
        zVariant: this.zVariant() 
      }), 
      this.class()
    )
  );
}
