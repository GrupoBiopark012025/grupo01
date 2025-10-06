import { Component, input } from '@angular/core';
import { ZardSkeletonComponent } from "@shared/components/zardui/skeleton/skeleton.component";

@Component({
  selector: 'app-table-skeleton',
  imports: [
    ZardSkeletonComponent
  ],
  templateUrl: './table-skeleton.component.html'
})
export class TableSkeletonComponent {
  lines = input(10);
  cols = input(5);
}
