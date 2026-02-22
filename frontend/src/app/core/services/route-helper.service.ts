import { Injectable, inject } from '@angular/core';
import { LanguageService, AppLanguage } from './language.service';
import { ROUTE_SEGMENTS } from '../i18n/route-segments';

@Injectable({ providedIn: 'root' })
export class RouteHelperService {
  private langService = inject(LanguageService);

  private seg(key: string, lang?: AppLanguage): string {
    const l = lang || this.langService.currentLang();
    return ROUTE_SEGMENTS[l]?.[key] || ROUTE_SEGMENTS['de'][key] || key;
  }

  private prefix(lang?: AppLanguage): string {
    return '/' + (lang || this.langService.currentLang());
  }

  home(lang?: AppLanguage): string {
    return this.prefix(lang);
  }

  articleUrl(slug: string, lang?: AppLanguage): string[] {
    return [this.prefix(lang), this.seg('article', lang), slug];
  }

  areasUrl(lang?: AppLanguage): string[] {
    return [this.prefix(lang), this.seg('areas', lang)];
  }

  areaDetailUrl(slug: string, lang?: AppLanguage): string[] {
    return [this.prefix(lang), this.seg('areas', lang), slug];
  }

  authorUrl(slug: string, lang?: AppLanguage): string[] {
    return [this.prefix(lang), this.seg('authors', lang), slug];
  }

  topicUrl(slug: string, lang?: AppLanguage): string[] {
    return [this.prefix(lang), this.seg('topic', lang), slug];
  }

  searchUrl(lang?: AppLanguage): string[] {
    return [this.prefix(lang), this.seg('search', lang)];
  }

  /** Generate equivalent URL in another language for the language switcher */
  switchLangUrl(newLang: AppLanguage, currentPath: string): string {
    const currentLang = this.langService.currentLang();
    // Remove current language prefix
    let path = currentPath.replace(new RegExp(`^/${currentLang}`), '');

    // Replace route segments
    for (const key of Object.keys(ROUTE_SEGMENTS[currentLang])) {
      const oldSeg = ROUTE_SEGMENTS[currentLang][key];
      const newSeg = ROUTE_SEGMENTS[newLang][key];
      path = path.replace(new RegExp(`/${oldSeg}(/|$)`), `/${newSeg}$1`);
    }

    return `/${newLang}${path}`;
  }
}
