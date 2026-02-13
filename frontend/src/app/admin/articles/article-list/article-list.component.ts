import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../core/services/article.service';
import { CategoryService } from '../../../core/services/category.service';
import { ArticleList } from '../../../core/models/article.model';
import { Category } from '../../../core/models/category.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { DateDePipe } from '../../../shared/pipes/date-de.pipe';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [RouterLink, FormsModule, PaginationComponent, DateDePipe],
  template: `
    <div class="list-page">
      <div class="page-header">
        <h1>Beiträge</h1>
        <a routerLink="/admin/beitraege/neu" class="btn-primary">+ Neuer Beitrag</a>
      </div>

      <div class="toolbar">
        <input type="text" [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Suchen…" class="search-input" />
        <select [(ngModel)]="filterStatus" (ngModelChange)="loadArticles()">
          <option value="">Alle Status</option>
          <option value="DRAFT">Entwurf</option>
          <option value="PUBLISHED">Veröffentlicht</option>
          <option value="ARCHIVED">Archiviert</option>
        </select>
        <select [(ngModel)]="filterCategory" (ngModelChange)="loadArticles()">
          <option value="">Alle Kategorien</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.slug">{{ cat.displayName }}</option>
          }
        </select>
        <label class="checkbox-label">
          <input type="checkbox" [(ngModel)]="filterAcademic" (ngModelChange)="loadArticles()" />
          Fachartikel
        </label>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Titel</th>
              <th>Kategorie</th>
              <th>Autor</th>
              <th>Datum</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            @for (a of articles(); track a.id) {
              <tr>
                <td><span class="dot" [class]="a.status.toLowerCase()"></span></td>
                <td>
                  <a [routerLink]="['/admin/beitraege', a.id, 'bearbeiten']" class="title-link">{{ a.title }}</a>
                  @if (a.academic) { <span class="badge academic">📎</span> }
                  @if (a.featured) { <span class="badge featured">⭐</span> }
                </td>
                <td><span class="cat-pill" [style.color]="a.category.color">{{ a.category.emoji }} {{ a.category.displayName }}</span></td>
                <td>{{ a.author.name }}</td>
                <td>{{ a.publishedDate | dateDe }}</td>
                <td class="actions">
                  <a [routerLink]="['/admin/beitraege', a.id, 'bearbeiten']" class="action-btn">Bearbeiten</a>
                  <button class="action-btn danger" (click)="deleteArticle(a.id)">Löschen</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <app-pagination [currentPage]="page()" [totalPages]="totalPages()" (pageChange)="onPage($event)" />
    </div>
  `,
  styles: [`
    .list-page h1 { font-family: 'Lora', serif; font-size: 1.4rem; font-weight: 700; color: #1e1e2e; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .btn-primary {
      padding: 0.5rem 1rem; background: #1e1e2e; color: #fff; border-radius: 6px;
      font-size: 0.82rem; font-weight: 700; transition: opacity 0.2s;
    }
    .btn-primary:hover { opacity: 0.9; }
    .toolbar {
      display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;
    }
    .search-input, .toolbar select {
      padding: 0.45rem 0.7rem; border: 1px solid #e8e6e1; border-radius: 6px;
      font-family: inherit; font-size: 0.8rem; outline: none;
    }
    .search-input { flex: 1; min-width: 150px; }
    .checkbox-label { font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; color: #787774; }
    .table-wrapper { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e8e6e1; }
    th { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #787774; padding: 0.7rem 0.8rem; text-align: left; border-bottom: 1px solid #e8e6e1; background: #fafaf8; }
    td { padding: 0.6rem 0.8rem; font-size: 0.82rem; border-bottom: 1px solid #f1f0ec; }
    tr:hover td { background: #fafaf8; }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .dot.draft { background: #b4b3af; }
    .dot.published { background: #3a9e7e; }
    .dot.archived { background: #d4763e; }
    .title-link { font-weight: 600; color: #1e1e2e; }
    .title-link:hover { text-decoration: underline; }
    .badge { font-size: 0.7rem; margin-left: 0.3rem; }
    .cat-pill { font-size: 0.78rem; font-weight: 600; }
    .actions { display: flex; gap: 0.4rem; }
    .action-btn {
      padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.72rem; font-weight: 600;
      background: #f7f6f3; color: #787774; border: 1px solid #e8e6e1; transition: all 0.15s;
      cursor: pointer;
    }
    .action-btn:hover { background: #e8e6e1; color: #37352f; }
    .action-btn.danger:hover { background: #fce6f1; color: #c24a8a; border-color: #c24a8a; }
  `]
})
export class ArticleListComponent implements OnInit {
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);

  articles = signal<ArticleList[]>([]);
  categories = signal<Category[]>([]);
  page = signal(0);
  totalPages = signal(0);
  search = '';
  filterStatus = '';
  filterCategory = '';
  filterAcademic = false;
  private searchTimeout: any;

  ngOnInit() {
    this.loadArticles();
    this.categoryService.getAllCategories().subscribe(c => this.categories.set(c));
  }

  loadArticles() {
    const params: any = { page: this.page(), size: 15, sort: 'createdAt,desc' };
    if (this.filterStatus) params.status = this.filterStatus;
    if (this.filterCategory) params.category = this.filterCategory;
    if (this.filterAcademic) params.academic = true;
    if (this.search) params.search = this.search;
    this.articleService.getAdminArticles(params).subscribe(res => {
      this.articles.set(res.content);
      this.totalPages.set(res.totalPages);
    });
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadArticles(), 300);
  }

  onPage(p: number) {
    this.page.set(p);
    this.loadArticles();
  }

  deleteArticle(id: number) {
    if (confirm('Diesen Beitrag wirklich löschen?')) {
      this.articleService.deleteArticle(id).subscribe(() => this.loadArticles());
    }
  }
}
