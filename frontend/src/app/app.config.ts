import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { LanguageService } from './core/services/language.service';

export function initializeLanguage(langService: LanguageService) {
  return () => langService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'de',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguage,
      deps: [LanguageService],
      multi: true
    }
  ]
};
