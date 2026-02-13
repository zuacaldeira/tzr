import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (totalPages() > 1) {
      <nav class="pagination">
        <button class="page-btn" [disabled]="currentPage() === 0" (click)="goTo(currentPage() - 1)">&lsaquo;</button>
        @for (p of pages(); track p) {
          <button class="page-btn" [class.active]="p === currentPage()" (click)="goTo(p)">{{ p + 1 }}</button>
        }
        <button class="page-btn" [disabled]="currentPage() === totalPages() - 1" (click)="goTo(currentPage() + 1)">&rsaquo;</button>
      </nav>
    }
  `,
  styles: [`
    .pagination { display: flex; justify-content: center; gap: 0.3rem; padding: 2rem 0; }
    .page-btn {
      min-width: 34px; height: 34px; border-radius: 6px; font-size: 0.82rem; font-weight: 600;
      background: var(--surface); border: 1px solid var(--border); color: var(--ink-light);
      transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) { background: var(--surface-hover); color: var(--ink); }
    .page-btn.active { background: var(--ink); color: #fff; border-color: var(--ink); }
    .page-btn:disabled { opacity: 0.4; cursor: default; }
  `]
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  goTo(page: number) {
    this.pageChange.emit(page);
  }
}
