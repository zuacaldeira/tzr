import { Component, input, output, signal, computed } from '@angular/core';

export type TranslationLang = 'DE' | 'PT' | 'EN';

export interface TranslationStatus {
  DE: boolean;
  PT: boolean;
  EN: boolean;
}

@Component({
  selector: 'app-translation-tabs',
  standalone: true,
  template: `
    <div class="translation-tabs">
      @for (lang of langs; track lang) {
        <button
          class="tab"
          [class.active]="activeLang() === lang"
          (click)="selectLang(lang)"
        >
          <span class="flag">{{ flagFor(lang) }}</span>
          <span class="lang-code">{{ lang }}</span>
          <span class="status-dot" [class.filled]="status()[lang]" [class.empty]="!status()[lang]"></span>
        </button>
      }
    </div>
  `,
  styles: [`
    .translation-tabs {
      display: flex; gap: 0.3rem; margin-bottom: 1rem;
      border-bottom: 2px solid #e8e6e1; padding-bottom: 0;
    }
    .tab {
      display: flex; align-items: center; gap: 0.35rem;
      padding: 0.45rem 0.8rem; font-size: 0.78rem; font-weight: 600;
      background: none; border: none; border-bottom: 2px solid transparent;
      margin-bottom: -2px; cursor: pointer; color: #787774;
      transition: all 0.15s; font-family: inherit;
    }
    .tab:hover { color: #37352f; }
    .tab.active {
      color: #1e1e2e; border-bottom-color: #3a9e7e;
    }
    .flag { font-size: 0.9rem; }
    .status-dot {
      width: 6px; height: 6px; border-radius: 50%;
      border: 1.5px solid #b4b3af;
    }
    .status-dot.filled {
      background: #3a9e7e; border-color: #3a9e7e;
    }
    .status-dot.empty {
      background: transparent; border-color: #d4763e;
    }
  `]
})
export class TranslationTabsComponent {
  status = input<TranslationStatus>({ DE: true, PT: false, EN: false });
  langChange = output<TranslationLang>();

  readonly langs: TranslationLang[] = ['DE', 'PT', 'EN'];
  activeLang = signal<TranslationLang>('DE');

  flagFor(lang: TranslationLang): string {
    return { DE: '\u{1F1E9}\u{1F1EA}', PT: '\u{1F1F5}\u{1F1F9}', EN: '\u{1F1EC}\u{1F1E7}' }[lang];
  }

  selectLang(lang: TranslationLang) {
    this.activeLang.set(lang);
    this.langChange.emit(lang);
  }
}
