import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
import { ArticleList } from '../../core/models/article.model';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { ReadingTimePipe } from '../../shared/pipes/reading-time.pipe';
import { DateDePipe } from '../../shared/pipes/date-de.pipe';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink, ArticleCardComponent, ReadingTimePipe, DateDePipe],
  template: `
    @if (article()) {
      <!-- Cover Image -->
      <div class="cover" [style.background-image]="'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 50%), url(' + article()!.coverImageUrl + '?auto=compress&cs=tinysrgb&w=1400&h=500&fit=crop)'">
        @if (article()!.coverImageCredit) {
          <span class="credit">Foto: {{ article()!.coverImageCredit }}</span>
        }
      </div>

      <article class="container article-container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs">
          <a routerLink="/">Start</a>
          <span class="sep">&rsaquo;</span>
          <a routerLink="/bereiche">Bereiche</a>
          <span class="sep">&rsaquo;</span>
          <a [routerLink]="['/bereiche', article()!.category.slug]">{{ article()!.category.displayName }}</a>
          <span class="sep">&rsaquo;</span>
          <span class="current">{{ article()!.title }}</span>
        </nav>

        <!-- Header -->
        <header class="article-header">
          <span class="cat-tag" [style.background]="article()!.category.bgColor" [style.color]="article()!.category.color">
            {{ article()!.category.emoji }} {{ article()!.category.displayName }}
          </span>
          <h1>{{ article()!.title }}</h1>
          <div class="meta-row">
            <a [routerLink]="['/autoren', article()!.author.slug]" class="author-link">
              {{ article()!.author.name }}
            </a>
            <span class="sep">&middot;</span>
            <span>{{ article()!.publishedDate | dateDe }}</span>
            <span class="sep">&middot;</span>
            <span>{{ article()!.readingTimeMinutes | readingTime }}</span>
          </div>
          @if (article()!.tags.length) {
            <div class="tag-row">
              @for (tag of article()!.tags; track tag.id) {
                <a [routerLink]="['/thema', tag.slug]" class="tag-pill">{{ tag.name }}</a>
              }
            </div>
          }
        </header>

        <!-- Body -->
        <div class="article-body" [innerHTML]="article()!.body"></div>

        <!-- Related Articles -->
        @if (related().length) {
          <section class="related-section">
            <h2 class="section-title">Weitere Beiträge</h2>
            <div class="article-grid">
              @for (r of related(); track r.id) {
                <app-article-card [article]="r" />
              }
            </div>
          </section>
        }
      </article>
    }
  `,
  styles: [`
    .cover {
      height: 360px; background-size: cover; background-position: center;
      position: relative;
    }
    .credit {
      position: absolute; bottom: 10px; right: 16px;
      font-size: 0.68rem; color: rgba(255,255,255,0.7); background: rgba(0,0,0,0.3);
      padding: 0.15rem 0.5rem; border-radius: 4px;
    }
    .article-container { max-width: var(--max-w-article); padding-top: 1.5rem; }
    .breadcrumbs {
      font-size: 0.75rem; color: var(--ink-faint); margin-bottom: 1.5rem;
      display: flex; flex-wrap: wrap; gap: 0.3rem;
    }
    .breadcrumbs a { color: var(--ink-light); }
    .breadcrumbs a:hover { color: var(--ink); }
    .breadcrumbs .current { color: var(--ink); }
    .breadcrumbs .sep { opacity: 0.4; }
    .article-header { margin-bottom: 2rem; }
    .cat-tag {
      display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px;
      font-size: 0.72rem; font-weight: 700; margin-bottom: 0.8rem;
    }
    .article-header h1 {
      font-family: 'Lora', serif; font-weight: 700; font-size: 2rem;
      line-height: 1.25; color: var(--ink); margin-bottom: 0.8rem;
    }
    .meta-row {
      display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;
      font-size: 0.82rem; color: var(--ink-light);
    }
    .author-link { font-weight: 600; color: var(--ink); }
    .author-link:hover { text-decoration: underline; }
    .sep { opacity: 0.4; }
    .tag-row { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.8rem; }
    .tag-pill {
      padding: 0.15rem 0.5rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600;
      background: var(--surface-hover); color: var(--ink-light); border: 1px solid var(--border);
      transition: all 0.2s;
    }
    .tag-pill:hover { background: var(--ink); color: #fff; border-color: var(--ink); }
    .related-section {
      margin-top: 3rem; padding-top: 2rem; border-top: 2px solid var(--border);
    }
    .section-title {
      font-family: 'Lora', serif; font-weight: 700; font-size: 1.2rem;
      color: var(--ink); margin-bottom: 1rem;
    }
    @media (max-width: 640px) {
      .cover { height: 240px; }
      .article-header h1 { font-size: 1.5rem; }
    }
  `]
})
export class ArticleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);

  article = signal<Article | null>(null);
  related = signal<ArticleList[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.articleService.getArticleBySlug(slug).subscribe(a => {
          this.article.set(a);
          window.scrollTo({ top: 0 });
        });
        this.articleService.getRelatedArticles(slug).subscribe(r => this.related.set(r));
      }
    });
  }
}
