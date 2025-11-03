import { Component, input } from '@angular/core';
import { ZardSkeletonComponent } from "@shared/components/zardui/skeleton/skeleton.component";

@Component({
  selector: 'app-direct-select-skeleton',
  imports: [
    ZardSkeletonComponent
  ],
  templateUrl: './direct-select-skeleton.component.html'
})
export class DirectSelectSkeletonComponent {
  items = input<number>(3);
}
