import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="brand-logo">TZR</span>
          <p>Impulse für frühkindliche Bildung nach dem Berliner Bildungsprogramm</p>
        </div>
        <div class="footer-links">
          <a routerLink="/">Start</a>
          <a routerLink="/bereiche">Bereiche</a>
        </div>
        <div class="footer-copy">
          &copy; {{ currentYear }} TZR &mdash; Alle Rechte vorbehalten
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid var(--border); margin-top: 3rem;
      padding: 2.5rem 0 1.5rem; background: var(--surface-hover);
    }
    .footer-inner { text-align: center; }
    .brand-logo {
      font-family: 'Lora', serif; font-weight: 800; font-size: 1.1rem;
      color: var(--ink);
    }
    .footer-brand p { font-size: 0.78rem; color: var(--ink-light); margin-top: 0.3rem; }
    .footer-links { display: flex; justify-content: center; gap: 1.5rem; margin: 1rem 0; }
    .footer-links a { font-size: 0.82rem; font-weight: 600; color: var(--ink-light); transition: color 0.2s; }
    .footer-links a:hover { color: var(--ink); }
    .footer-copy { font-size: 0.72rem; color: var(--ink-faint); }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
