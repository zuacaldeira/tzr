import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { CategoryService } from '../../core/services/category.service';
import { NewsletterService } from '../../core/services/newsletter.service';
import { ArticleList } from '../../core/models/article.model';
import { Category } from '../../core/models/category.model';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { CategoryPillsComponent } from '../../shared/components/category-pills/category-pills.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ReadingTimePipe } from '../../shared/pipes/reading-time.pipe';
import { DateDePipe } from '../../shared/pipes/date-de.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ArticleCardComponent, CategoryPillsComponent, PaginationComponent, ReadingTimePipe, DateDePipe, FormsModule],
  template: `
    <!-- Hero Section -->
    @if (featured()) {
      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <a [routerLink]="['/artikel', featured()!.slug]" class="hero-main"
               [style.background-image]="'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%), url(' + featured()!.coverImageUrl + '?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)'">
              <div class="hero-content">
                <span class="hero-cat" [style.background]="featured()!.category.bgColor" [style.color]="featured()!.category.color">
                  {{ featured()!.category.emoji }} {{ featured()!.category.displayName }}
                </span>
                <h1 class="hero-title">{{ featured()!.title }}</h1>
                <p class="hero-excerpt">{{ featured()!.excerpt }}</p>
                <div class="hero-meta">
                  <span>{{ featured()!.author.name }}</span>
                  <span class="sep">&middot;</span>
                  <span>{{ featured()!.publishedDate | dateDe }}</span>
                  <span class="sep">&middot;</span>
                  <span>{{ featured()!.readingTimeMinutes | readingTime }}</span>
                </div>
              </div>
            </a>
            <div class="hero-side">
              @for (article of sideArticles(); track article.id) {
                <a [routerLink]="['/artikel', article.slug]" class="side-card"
                   [style.background-image]="'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%), url(' + article.coverImageUrl + '?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop)'">
                  <div class="side-content">
                    <span class="side-cat" [style.background]="article.category.bgColor" [style.color]="article.category.color">
                      {{ article.category.emoji }} {{ article.category.displayName }}
                    </span>
                    <h3>{{ article.title }}</h3>
                    <div class="side-meta">
                      <span>{{ article.publishedDate | dateDe }}</span>
                      <span class="sep">&middot;</span>
                      <span>{{ article.readingTimeMinutes | readingTime }}</span>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        </div>
      </section>
    }

    <!-- Category Pills + Articles Grid -->
    <section class="container">
      <div class="section-header">
        <h2 class="section-title">Praxisimpulse</h2>
      </div>

      @if (categories().length) {
        <app-category-pills [categories]="categories()" (categorySelected)="onCategoryFilter($event)" />
      }

      <div class="article-grid">
        @for (article of articles(); track article.id) {
          <app-article-card [article]="article" />
        }
      </div>

      <app-pagination [currentPage]="currentPage()" [totalPages]="totalPages()" (pageChange)="onPageChange($event)" />
    </section>

    <!-- Newsletter -->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-box">
          <span class="newsletter-icon">&#9993;</span>
          <h2 class="newsletter-title">Bildungsimpulse per E-Mail</h2>
          <p class="newsletter-desc">Erhalten Sie monatlich neue Praxisideen und Fachartikel direkt in Ihr Postfach — kostenlos und jederzeit abbestellbar.</p>
          <form class="newsletter-form" (ngSubmit)="onSubscribe()">
            <input type="email" [(ngModel)]="newsletterEmail" name="email" placeholder="Ihre E-Mail-Adresse" required />
            <button type="submit">Abonnieren</button>
          </form>
          @if (subscribeMsg()) {
            <p class="subscribe-msg" [style.color]="subscribeMsgError() ? '#c24a8a' : '#3a9e7e'">{{ subscribeMsg() }}</p>
          }
        </div>
      </div>
    </section>

    <!-- Fachartikel -->
    <section class="container">
      <div class="section-header">
        <h2 class="section-title">Fachartikel</h2>
        <a routerLink="/suche" [queryParams]="{academic: true}" class="section-link">Alle Fachartikel &rarr;</a>
      </div>
      <div class="article-grid">
        @for (article of academicArticles(); track article.id) {
          <app-article-card [article]="article" />
        }
      </div>
    </section>
  `,
  styles: [`
    .hero { padding: 1.5rem 0 0.5rem; }
    .hero-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.2rem; min-height: 420px; }
    .hero-main {
      border-radius: 14px; background-size: cover; background-position: center;
      display: flex; align-items: flex-end; padding: 2.2rem; position: relative; overflow: hidden;
      min-height: 420px;
    }
    .hero-content { position: relative; z-index: 1; color: #fff; max-width: 560px; }
    .hero-cat {
      padding: 0.25rem 0.7rem; border-radius: 5px; font-size: 0.74rem; font-weight: 700;
      display: inline-block;
    }
    .hero-title {
      font-family: 'Lora', serif; font-weight: 700;
      font-size: clamp(1.5rem, 3vw, 2.1rem); line-height: 1.25; margin: 0.7rem 0 0.5rem;
      text-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .hero-excerpt {
      font-size: 0.9rem; line-height: 1.55; opacity: 0.92; max-width: 520px;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .hero-meta { font-size: 0.78rem; opacity: 0.85; margin-top: 0.7rem; display: flex; gap: 0.4rem; }
    .sep { opacity: 0.5; }
    .hero-side { display: flex; flex-direction: column; gap: 1.2rem; }
    .side-card {
      flex: 1; border-radius: 14px; background-size: cover; background-position: center;
      display: flex; align-items: flex-end; padding: 1.4rem; overflow: hidden;
      min-height: 200px; transition: transform 0.2s;
    }
    .side-card:hover { transform: scale(1.01); }
    .side-content { color: #fff; position: relative; z-index: 1; }
    .side-cat { padding: 0.2rem 0.55rem; border-radius: 5px; font-size: 0.7rem; font-weight: 700; display: inline-block; }
    .side-content h3 {
      font-family: 'Lora', serif; font-size: 1rem; font-weight: 600; line-height: 1.35; margin-top: 0.5rem;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .side-meta { font-size: 0.72rem; opacity: 0.85; margin-top: 0.35rem; display: flex; gap: 0.3rem; }
    .subscribe-msg { font-size: 0.85rem; margin-top: 1rem; }
    @media (max-width: 960px) {
      .hero-grid { grid-template-columns: 1fr; min-height: auto; }
      .hero-main { min-height: 320px; }
      .hero-side { flex-direction: row; }
      .side-card { min-height: 180px; }
    }
    @media (max-width: 640px) {
      .hero-side { flex-direction: column; }
      .hero-main { min-height: 280px; padding: 1.5rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private newsletterService = inject(NewsletterService);

  featured = signal<ArticleList | null>(null);
  sideArticles = signal<ArticleList[]>([]);
  articles = signal<ArticleList[]>([]);
  academicArticles = signal<ArticleList[]>([]);
  categories = signal<Category[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  selectedCategory = signal<string | null>(null);
  newsletterEmail = '';
  subscribeMsg = signal('');
  subscribeMsgError = signal(false);

  ngOnInit() {
    this.loadFeatured();
    this.loadCategories();
    this.loadArticles();
    this.loadAcademicArticles();
  }

  loadFeatured() {
    this.articleService.getPublishedArticles({ size: 3, sort: 'publishedDate,desc' }).subscribe(res => {
      const all = res.content;
      const feat = all.find(a => a.featured) || all[0];
      this.featured.set(feat || null);
      this.sideArticles.set(all.filter(a => a !== feat).slice(0, 2));
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(cats => this.categories.set(cats));
  }

  loadArticles() {
    const params: any = { page: this.currentPage(), size: 9 };
    if (this.selectedCategory()) params.category = this.selectedCategory();
    this.articleService.getPublishedArticles(params).subscribe(res => {
      this.articles.set(res.content);
      this.totalPages.set(res.totalPages);
    });
  }

  loadAcademicArticles() {
    this.articleService.getPublishedArticles({ academic: true, size: 3 }).subscribe(res => {
      this.academicArticles.set(res.content);
    });
  }

  onCategoryFilter(slug: string | null) {
    this.selectedCategory.set(slug);
    this.currentPage.set(0);
    this.loadArticles();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadArticles();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  onSubscribe() {
    if (!this.newsletterEmail) return;
    this.newsletterService.subscribe(this.newsletterEmail).subscribe({
      next: () => {
        this.subscribeMsg.set('Vielen Dank! Sie erhalten eine Bestätigung per E-Mail.');
        this.subscribeMsgError.set(false);
        this.newsletterEmail = '';
      },
      error: () => {
        this.subscribeMsg.set('Diese E-Mail-Adresse ist bereits registriert.');
        this.subscribeMsgError.set(true);
      }
    });
  }
}
