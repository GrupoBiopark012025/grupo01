import { Component, computed, input, output } from '@angular/core';
import { ZardPaginationComponent } from "@shared/components/zardui/pagination/pagination.component";

@Component({
  selector: 'app-pagination',
  imports: [
    ZardPaginationComponent
  ],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {

  currentPage = input.required<number>();
  pageSize = input.required<number>();
  recordsInView = input.required<number>();
  totalPages = input.required<number>();
  collectionSize = input.required<number>();

  hiddenIfPossible = input<boolean>(false);
  shouldDisplayQuantities = input<boolean>(true);

  onPageChange = output<number>();

  firstRecord = computed(() => ((this.currentPage() - 1) * this.pageSize()) + 1);
  lastRecord = computed(() => {
    const totalSize = this.collectionSize();
    const lastRecord = this.firstRecord() + this.recordsInView() - 1;
    return lastRecord > totalSize ? totalSize : lastRecord;
  });
  showingMessage = computed(() => `${this.firstRecord()} a ${this.lastRecord()} de ${this.collectionSize()} registros`);

  isComponentShowing = computed(() => {
    if (!this.hiddenIfPossible()) {
      return !!this.collectionSize();
    }

    return this.currentPage() > 1 || this.collectionSize() > this.recordsInView();
  });
}
