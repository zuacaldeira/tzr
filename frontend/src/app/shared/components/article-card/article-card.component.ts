import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleList } from '../../../core/models/article.model';
import { ReadingTimePipe } from '../../pipes/reading-time.pipe';
import { DateDePipe } from '../../pipes/date-de.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [RouterLink, ReadingTimePipe, DateDePipe, TruncatePipe],
  template: `
    <a [routerLink]="['/artikel', article().slug]" class="card">
      <div class="card-header" [style.background-image]="'url(' + article().coverImageUrl + '?auto=compress&cs=tinysrgb&w=600&h=340&fit=crop)'">
        <span class="card-emoji">{{ article().cardEmoji }}</span>
        @if (article().academic) {
          <span class="academic-badge">Fachartikel</span>
        }
      </div>
      <div class="card-body">
        <span class="category-pill" [style.background]="article().category.bgColor" [style.color]="article().category.color">
          {{ article().category.emoji }} {{ article().category.displayName }}
        </span>
        <h3 class="card-title">{{ article().title }}</h3>
        <p class="card-excerpt">{{ article().excerpt | truncate:120 }}</p>
        <div class="card-meta">
          <span class="author">{{ article().author.name }}</span>
          <span class="sep">&middot;</span>
          <span>{{ article().publishedDate | dateDe }}</span>
          <span class="sep">&middot;</span>
          <span>{{ article().readingTimeMinutes | readingTime }}</span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .card {
      display: flex; flex-direction: column;
      border: 1px solid var(--border); border-radius: 10px;
      overflow: hidden; transition: box-shadow 0.2s, transform 0.15s;
      background: #fff;
    }
    .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); transform: translateY(-2px); }
    .card-header {
      height: 180px; background-size: cover; background-position: center;
      position: relative;
    }
    .card-emoji {
      position: absolute; bottom: -16px; left: 16px;
      font-size: 1.6rem; background: #fff; border-radius: 50%;
      width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .academic-badge {
      position: absolute; top: 10px; right: 10px;
      background: rgba(255,255,255,0.92); padding: 0.2rem 0.5rem;
      border-radius: 4px; font-size: 0.7rem; font-weight: 700;
    }
    .card-body { padding: 1.3rem 1rem 1rem; flex: 1; display: flex; flex-direction: column; }
    .category-pill {
      display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px;
      font-size: 0.7rem; font-weight: 700; margin-bottom: 0.5rem; width: fit-content;
    }
    .card-title {
      font-family: 'Lora', serif; font-weight: 600; font-size: 1rem;
      line-height: 1.35; color: var(--ink); margin-bottom: 0.4rem;
    }
    .card-excerpt { font-size: 0.82rem; color: var(--ink-light); line-height: 1.5; flex: 1; }
    .card-meta {
      display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;
      font-size: 0.72rem; color: var(--ink-faint); margin-top: 0.8rem;
      padding-top: 0.6rem; border-top: 1px solid var(--border-light);
    }
    .author { font-weight: 600; }
    .sep { opacity: 0.4; }
  `]
})
export class ArticleCardComponent {
  article = input.required<ArticleList>();
}
