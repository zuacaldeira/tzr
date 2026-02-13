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
    .pagination { display: flex; justify-content: center; gap: 0.4rem; padding: 2.5rem 0; }
    .page-btn {
      min-width: 38px; height: 38px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
      background: var(--surface); border: 1.5px solid var(--border); color: var(--ink-light);
      transition: all 0.2s; display: flex; align-items: center; justify-content: center;
    }
    .page-btn:hover:not(:disabled) {
      background: var(--surface-hover); color: var(--ink); border-color: var(--ink-faint);
      transform: translateY(-1px); box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .page-btn.active {
      background: var(--ink); color: #fff; border-color: var(--ink);
      box-shadow: 0 2px 8px rgba(55,53,47,0.2);
    }
    .page-btn:disabled { opacity: 0.35; cursor: default; }
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
