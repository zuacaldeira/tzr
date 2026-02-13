import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../../core/services/author.service';
import { AuthorCreate } from '../../../core/models/author.model';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="form-page">
      <div class="form-header">
        <h1>{{ isEdit() ? 'Autor bearbeiten' : 'Neuer Autor' }}</h1>
        <div class="form-actions">
          <a routerLink="/admin/autoren" class="btn-secondary">Abbrechen</a>
          <button class="btn-primary" (click)="save()">Speichern</button>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-main">
          <div class="field"><label>Name</label><input type="text" [(ngModel)]="form.name" /></div>
          <div class="field"><label>Slug</label><input type="text" [(ngModel)]="form.slug" /></div>
          <div class="field"><label>E-Mail</label><input type="email" [(ngModel)]="form.email" /></div>
          <div class="field"><label>Biografie</label><textarea [(ngModel)]="form.bio" rows="4"></textarea></div>
          <div class="field"><label>Avatar-URL</label><input type="text" [(ngModel)]="form.avatarUrl" /></div>
        </div>
        <div class="preview-card">
          <h3>Vorschau</h3>
          <div class="author-preview">
            @if (form.avatarUrl) {
              <img [src]="form.avatarUrl" class="avatar" />
            } @else {
              <div class="avatar-placeholder">{{ (form.name || 'A').charAt(0) }}</div>
            }
            <h4>{{ form.name || 'Name' }}</h4>
            <p>{{ form.bio || 'Biografie…' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-page h1 { font-family: 'Lora', serif; font-size: 1.3rem; font-weight: 700; color: #1e1e2e; }
    .form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .form-actions { display: flex; gap: 0.5rem; }
    .btn-primary { padding: 0.5rem 1rem; background: #1e1e2e; color: #fff; border-radius: 6px; font-size: 0.82rem; font-weight: 700; }
    .btn-secondary { padding: 0.5rem 1rem; background: #f7f6f3; color: #787774; border-radius: 6px; font-size: 0.82rem; font-weight: 600; border: 1px solid #e8e6e1; }
    .form-grid { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; align-items: start; }
    .form-main, .preview-card { background: #fff; border-radius: 10px; padding: 1.2rem; border: 1px solid #e8e6e1; }
    .field { margin-bottom: 0.8rem; }
    .field label { display: block; font-size: 0.75rem; font-weight: 600; color: #787774; margin-bottom: 0.25rem; }
    .field input, .field textarea { width: 100%; padding: 0.5rem 0.7rem; border: 1px solid #e8e6e1; border-radius: 6px; font-family: inherit; font-size: 0.82rem; outline: none; }
    .preview-card h3 { font-size: 0.82rem; font-weight: 700; margin-bottom: 0.8rem; color: #787774; }
    .author-preview { text-align: center; }
    .avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; margin: 0 auto; }
    .avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; background: #f7f6f3; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: #787774; }
    .author-preview h4 { font-family: 'Lora', serif; font-weight: 600; margin-top: 0.5rem; color: #1e1e2e; }
    .author-preview p { font-size: 0.8rem; color: #787774; margin-top: 0.3rem; }
    @media (max-width: 960px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class AuthorFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authorService = inject(AuthorService);

  isEdit = signal(false);
  authorId = signal<number | null>(null);
  form: AuthorCreate = { name: '', slug: '', bio: '', email: '', avatarUrl: '' };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.authorId.set(+id);
      this.authorService.getAdminAuthor(+id).subscribe(a => {
        this.form = { name: a.name, slug: a.slug, bio: a.bio, email: a.email, avatarUrl: a.avatarUrl };
      });
    }
  }

  save() {
    const obs = this.isEdit()
      ? this.authorService.updateAuthor(this.authorId()!, this.form)
      : this.authorService.createAuthor(this.form);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/autoren']),
      error: (err) => alert(err.error?.message || 'Fehler beim Speichern')
    });
  }
}
