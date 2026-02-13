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
    .pills-section { padding: 0.8rem 0 1.2rem; }
    .pills-row { margin-bottom: 0.8rem; }
    .pills-label {
      font-size: 0.68rem; font-weight: 800; color: var(--ink-faint); text-transform: uppercase;
      letter-spacing: 0.06em; display: block; margin-bottom: 0.5rem;
    }
    .pills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .pill {
      padding: 0.38rem 0.85rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
      background: var(--surface-hover); color: var(--ink-light); border: 1.5px solid var(--border);
      transition: all 0.2s; white-space: nowrap;
    }
    .pill:hover {
      background: var(--pill-bg, var(--surface-hover)); color: var(--pill-color, var(--ink));
      border-color: var(--pill-color, var(--border)); transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .pill.active {
      background: var(--pill-bg, var(--ink)); color: var(--pill-color, #fff);
      border-color: var(--pill-color, var(--ink)); box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
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
