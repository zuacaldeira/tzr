import { Component, computed, input, output, signal } from '@angular/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-pills',
  standalone: true,
  template: `
    <div class="pills-section">
      <div class="pills-row">
        <span class="pills-label">Bildungsbereiche</span>
        <div class="pills">
          <button class="pill" [class.active]="!selected()" (click)="select(null)">Alle</button>
          @for (cat of bildungsbereiche(); track cat.id) {
            <button class="pill" [class.active]="selected() === cat.slug"
              [style.--pill-color]="cat.color" [style.--pill-bg]="cat.bgColor"
              (click)="select(cat.slug)">
              {{ cat.emoji }} {{ cat.displayName }}
            </button>
          }
        </div>
      </div>
      <div class="pills-row">
        <span class="pills-label">Querschnittsaufgaben</span>
        <div class="pills">
          @for (cat of querschnittsaufgaben(); track cat.id) {
            <button class="pill" [class.active]="selected() === cat.slug"
              [style.--pill-color]="cat.color" [style.--pill-bg]="cat.bgColor"
              (click)="select(cat.slug)">
              {{ cat.emoji }} {{ cat.displayName }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pills-section { padding: 1rem 0; }
    .pills-row { margin-bottom: 0.6rem; }
    .pills-label { font-size: 0.7rem; font-weight: 700; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.04em; display: block; margin-bottom: 0.4rem; }
    .pills { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .pill {
      padding: 0.28rem 0.7rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
      background: var(--surface-hover); color: var(--ink-light); border: 1px solid var(--border);
      transition: all 0.2s;
    }
    .pill:hover { background: var(--pill-bg, var(--surface-hover)); color: var(--pill-color, var(--ink)); border-color: var(--pill-color, var(--border)); }
    .pill.active { background: var(--pill-bg, var(--ink)); color: var(--pill-color, #fff); border-color: var(--pill-color, var(--ink)); }
  `]
})
export class CategoryPillsComponent {
  categories = input.required<Category[]>();
  categorySelected = output<string | null>();
  selected = signal<string | null>(null);

  bildungsbereiche = computed(() => this.categories().filter(c => c.type === 'BILDUNGSBEREICH'));
  querschnittsaufgaben = computed(() => this.categories().filter(c => c.type === 'QUERSCHNITTSAUFGABE'));

  select(slug: string | null) {
    this.selected.set(slug);
    this.categorySelected.emit(slug);
  }
}
