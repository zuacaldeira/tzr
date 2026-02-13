import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../core/services/article.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthorService } from '../../../core/services/author.service';
import { TagService } from '../../../core/services/tag.service';
import { Article, ArticleCreate } from '../../../core/models/article.model';
import { Category } from '../../../core/models/category.model';
import { Author } from '../../../core/models/author.model';
import { Tag } from '../../../core/models/tag.model';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="form-page">
      <div class="form-header">
        <h1>{{ isEdit() ? 'Beitrag bearbeiten' : 'Neuer Beitrag' }}</h1>
        <div class="form-actions">
          <a routerLink="/admin/beitraege" class="btn-secondary">Abbrechen</a>
          <button class="btn-primary" (click)="save('DRAFT')">Als Entwurf speichern</button>
          <button class="btn-accent" (click)="save('PUBLISHED')">Veröffentlichen</button>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-main">
          <div class="field">
            <label>Titel</label>
            <input type="text" [(ngModel)]="form.title" (ngModelChange)="generateSlug()" placeholder="Titel des Beitrags" />
          </div>
          <div class="field">
            <label>Slug</label>
            <input type="text" [(ngModel)]="form.slug" placeholder="url-slug" />
          </div>
          <div class="field">
            <label>Vorschautext (Excerpt)</label>
            <textarea [(ngModel)]="form.excerpt" rows="3" placeholder="Kurzbeschreibung für Karten und Vorschau…"></textarea>
          </div>
          <div class="field">
            <label>Inhalt (HTML)</label>
            <textarea [(ngModel)]="form.body" rows="25" class="body-editor" placeholder="<p>Artikel-Inhalt als HTML…</p>"></textarea>
          </div>
        </div>

        <div class="form-sidebar">
          <div class="sidebar-section">
            <h3>Einstellungen</h3>
            <div class="field">
              <label>Status</label>
              <select [(ngModel)]="form.status">
                <option value="DRAFT">Entwurf</option>
                <option value="PUBLISHED">Veröffentlicht</option>
                <option value="ARCHIVED">Archiviert</option>
              </select>
            </div>
            <div class="field">
              <label>Veröffentlichungsdatum</label>
              <input type="date" [(ngModel)]="form.publishedDate" />
            </div>
            <div class="field">
              <label>Kategorie</label>
              <select [(ngModel)]="form.categoryId">
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.emoji }} {{ cat.displayName }}</option>
                }
              </select>
            </div>
            <div class="field">
              <label>Autor</label>
              <select [(ngModel)]="form.authorId">
                @for (a of authors(); track a.id) {
                  <option [value]="a.id">{{ a.name }}</option>
                }
              </select>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Tags</h3>
            <div class="tags-select">
              @for (tag of allTags(); track tag.id) {
                <label class="tag-option">
                  <input type="checkbox" [checked]="isTagSelected(tag.id)" (change)="toggleTag(tag.id)" />
                  {{ tag.name }}
                </label>
              }
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Darstellung</h3>
            <div class="field">
              <label>Karten-Emoji</label>
              <input type="text" [(ngModel)]="form.cardEmoji" placeholder="🎯" />
            </div>
            <div class="field">
              <label>Cover-Bild URL</label>
              <input type="text" [(ngModel)]="form.coverImageUrl" placeholder="https://…" />
            </div>
            @if (form.coverImageUrl) {
              <img [src]="form.coverImageUrl + '?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'" class="cover-preview" alt="Cover-Vorschau" />
            }
            <div class="field">
              <label>Bildnachweis</label>
              <input type="text" [(ngModel)]="form.coverImageCredit" placeholder="Fotograf:in" />
            </div>
            <div class="toggle-row">
              <label><input type="checkbox" [(ngModel)]="form.academic" /> Fachartikel</label>
              <label><input type="checkbox" [(ngModel)]="form.featured" /> Featured</label>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>SEO</h3>
            <div class="field">
              <label>Meta-Titel</label>
              <input type="text" [(ngModel)]="form.metaTitle" placeholder="SEO-Titel" />
            </div>
            <div class="field">
              <label>Meta-Beschreibung</label>
              <textarea [(ngModel)]="form.metaDescription" rows="2" placeholder="SEO-Beschreibung"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-page h1 { font-family: 'Lora', serif; font-size: 1.3rem; font-weight: 700; color: #1e1e2e; }
    .form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
    .form-actions { display: flex; gap: 0.5rem; }
    .btn-primary { padding: 0.5rem 1rem; background: #1e1e2e; color: #fff; border-radius: 6px; font-size: 0.82rem; font-weight: 700; }
    .btn-accent { padding: 0.5rem 1rem; background: #3a9e7e; color: #fff; border-radius: 6px; font-size: 0.82rem; font-weight: 700; }
    .btn-secondary { padding: 0.5rem 1rem; background: #f7f6f3; color: #787774; border-radius: 6px; font-size: 0.82rem; font-weight: 600; border: 1px solid #e8e6e1; }
    .form-grid { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; align-items: start; }
    .form-main, .sidebar-section {
      background: #fff; border-radius: 10px; padding: 1.2rem; border: 1px solid #e8e6e1;
    }
    .sidebar-section { margin-bottom: 1rem; }
    .sidebar-section h3 { font-size: 0.82rem; font-weight: 700; color: #1e1e2e; margin-bottom: 0.8rem; padding-bottom: 0.4rem; border-bottom: 1px solid #f1f0ec; }
    .field { margin-bottom: 0.8rem; }
    .field label { display: block; font-size: 0.75rem; font-weight: 600; color: #787774; margin-bottom: 0.25rem; }
    .field input, .field select, .field textarea {
      width: 100%; padding: 0.5rem 0.7rem; border: 1px solid #e8e6e1; border-radius: 6px;
      font-family: inherit; font-size: 0.82rem; outline: none; transition: border-color 0.2s;
    }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: #787774; }
    .body-editor { font-family: 'Courier New', monospace; font-size: 0.78rem; line-height: 1.5; }
    .tags-select { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .tag-option { font-size: 0.75rem; display: flex; align-items: center; gap: 0.2rem; padding: 0.2rem 0.4rem; background: #f7f6f3; border-radius: 4px; cursor: pointer; }
    .cover-preview { width: 100%; border-radius: 6px; margin: 0.5rem 0; }
    .toggle-row { display: flex; gap: 1rem; font-size: 0.8rem; }
    .toggle-row label { display: flex; align-items: center; gap: 0.3rem; }
    @media (max-width: 960px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class ArticleFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private authorService = inject(AuthorService);
  private tagService = inject(TagService);

  isEdit = signal(false);
  articleId = signal<number | null>(null);
  categories = signal<Category[]>([]);
  authors = signal<Author[]>([]);
  allTags = signal<Tag[]>([]);

  form: ArticleCreate & { coverImageCredit?: string } = {
    title: '', slug: '', excerpt: '', body: '',
    categoryId: 0, authorId: 0, tagIds: [],
    cardEmoji: '', coverImageUrl: '', coverImageCredit: '',
    status: 'DRAFT', academic: false, featured: false,
    publishedDate: '', metaTitle: '', metaDescription: ''
  };

  ngOnInit() {
    this.categoryService.getAdminCategories().subscribe(c => this.categories.set(c));
    this.authorService.getAdminAuthors().subscribe(a => this.authors.set(a));
    this.tagService.getAllTags().subscribe(t => this.allTags.set(t));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.articleId.set(+id);
      this.articleService.getAdminArticle(+id).subscribe(a => {
        this.form = {
          title: a.title, slug: a.slug, excerpt: a.excerpt, body: a.body,
          categoryId: a.category.id, authorId: a.author.id,
          tagIds: a.tags.map(t => t.id),
          cardEmoji: a.cardEmoji || '', coverImageUrl: a.coverImageUrl || '',
          coverImageCredit: a.coverImageCredit || '',
          status: a.status, academic: a.academic, featured: a.featured,
          publishedDate: a.publishedDate || '', readingTimeMinutes: a.readingTimeMinutes,
          metaTitle: a.metaTitle || '', metaDescription: a.metaDescription || ''
        };
      });
    }
  }

  generateSlug() {
    if (!this.isEdit() || !this.form.slug) {
      this.form.slug = this.form.title
        .toLowerCase()
        .replace(/ü/g, 'ue').replace(/ö/g, 'oe').replace(/ä/g, 'ae').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
  }

  isTagSelected(id: number): boolean {
    return this.form.tagIds?.includes(id) || false;
  }

  toggleTag(id: number) {
    const ids = this.form.tagIds || [];
    const i = ids.indexOf(id);
    if (i >= 0) ids.splice(i, 1);
    else ids.push(id);
    this.form.tagIds = [...ids];
  }

  save(status: string) {
    this.form.status = status;
    if (status === 'PUBLISHED' && !this.form.publishedDate) {
      this.form.publishedDate = new Date().toISOString().split('T')[0];
    }
    const obs = this.isEdit()
      ? this.articleService.updateArticle(this.articleId()!, this.form)
      : this.articleService.createArticle(this.form);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/beitraege']),
      error: (err) => alert('Fehler beim Speichern: ' + (err.error?.message || err.message))
    });
  }
}
