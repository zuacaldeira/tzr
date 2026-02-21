import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <span class="brand-logo">TZR</span>
            <p>Impulse für frühkindliche Bildung nach dem Berliner Bildungsprogramm</p>
          </div>
          <div class="footer-col">
            <h4>Navigation</h4>
            <a routerLink="/">Start</a>
            <a routerLink="/bereiche">Bildungsbereiche</a>
            <a routerLink="/suche" [queryParams]="{academic: true}">Fachartikel</a>
          </div>
          <div class="footer-col">
            <h4>Themen</h4>
            <a routerLink="/bereiche/gesundheit">Gesundheit</a>
            <a routerLink="/bereiche/kommunikation">Kommunikation</a>
            <a routerLink="/bereiche/soziales">Soziales Lernen</a>
          </div>
          <div class="footer-col">
            <h4>Rechtliches</h4>
            <span class="placeholder-link">Impressum</span>
            <span class="placeholder-link">Datenschutz</span>
            <a href="mailto:tzr@zuacaldeira.com">Kontakt</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; {{ currentYear }} TZR &mdash; Alle Rechte vorbehalten</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid var(--border); margin-top: 3rem;
      padding: 3rem 0 1.5rem; background: #faf9f7;
    }
    .footer-top {
      display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 2rem;
      padding-bottom: 2rem; border-bottom: 1px solid var(--border-light);
    }
    .brand-logo {
      font-family: 'Lora', serif; font-weight: 800; font-size: 1.3rem;
      color: var(--ink);
    }
    .footer-brand p { font-size: 0.8rem; color: var(--ink-light); margin-top: 0.4rem; line-height: 1.5; max-width: 260px; }
    .footer-col { display: flex; flex-direction: column; gap: 0.4rem; }
    .footer-col h4 { font-size: 0.78rem; font-weight: 800; color: var(--ink); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.3rem; }
    .footer-col a, .placeholder-link { font-size: 0.82rem; color: var(--ink-light); transition: color 0.2s; }
    .footer-col a:hover { color: var(--ink); }
    .placeholder-link { opacity: 0.5; }
    .footer-bottom {
      padding-top: 1.2rem; text-align: center;
      font-size: 0.74rem; color: var(--ink-faint);
    }
    @media (max-width: 768px) {
      .footer-top { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    }
    @media (max-width: 480px) {
      .footer-top { grid-template-columns: 1fr; gap: 1.5rem; }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
