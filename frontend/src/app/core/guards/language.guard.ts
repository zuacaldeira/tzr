import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LanguageService, AppLanguage } from '../services/language.service';
import { SUPPORTED_LANGS } from '../i18n/route-segments';

export const languageGuard: CanActivateFn = (route) => {
  const langService = inject(LanguageService);
  const router = inject(Router);
  const lang = route.paramMap.get('lang');

  if (lang && SUPPORTED_LANGS.includes(lang as AppLanguage)) {
    langService.setLanguage(lang as AppLanguage);
    return true;
  }

  return router.createUrlTree(['/de']);
};
