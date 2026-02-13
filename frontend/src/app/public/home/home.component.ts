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
          <h2 class="newsletter-title">Bildungsimpulse per E-Mail</h2>
          <p class="newsletter-desc">Erhalten Sie monatlich neue Praxisideen und Fachartikel direkt in Ihr Postfach.</p>
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
    .hero { padding: 1.5rem 0; }
    .hero-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1rem; min-height: 380px; }
    .hero-main {
      border-radius: 12px; background-size: cover; background-position: center;
      display: flex; align-items: flex-end; padding: 2rem; position: relative; overflow: hidden;
    }
    .hero-content { position: relative; z-index: 1; color: #fff; }
    .hero-cat { padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.72rem; font-weight: 700; }
    .hero-title {
      font-family: 'Lora', serif; font-weight: 700;
      font-size: clamp(1.5rem, 3vw, 2.1rem); line-height: 1.25; margin: 0.6rem 0 0.5rem;
    }
    .hero-excerpt { font-size: 0.88rem; line-height: 1.5; opacity: 0.9; max-width: 520px; }
    .hero-meta { font-size: 0.75rem; opacity: 0.8; margin-top: 0.6rem; display: flex; gap: 0.4rem; }
    .sep { opacity: 0.5; }
    .hero-side { display: flex; flex-direction: column; gap: 1rem; }
    .side-card {
      flex: 1; border-radius: 12px; background-size: cover; background-position: center;
      display: flex; align-items: flex-end; padding: 1.2rem; overflow: hidden;
    }
    .side-content { color: #fff; position: relative; z-index: 1; }
    .side-cat { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.68rem; font-weight: 700; }
    .side-content h3 { font-family: 'Lora', serif; font-size: 0.95rem; font-weight: 600; line-height: 1.3; margin-top: 0.4rem; }
    .side-meta { font-size: 0.7rem; opacity: 0.8; margin-top: 0.3rem; display: flex; gap: 0.3rem; }
    .subscribe-msg { font-size: 0.82rem; margin-top: 0.8rem; }
    @media (max-width: 960px) {
      .hero-grid { grid-template-columns: 1fr; }
      .hero-side { flex-direction: row; }
      .side-card { min-height: 180px; }
    }
    @media (max-width: 640px) {
      .hero-side { flex-direction: column; }
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
