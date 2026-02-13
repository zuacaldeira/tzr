import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token && (req.url.includes('/api/admin') || req.url.includes('/api/auth/me'))) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        return auth.refreshToken().pipe(
          switchMap(res => {
            if (res) {
              req = req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } });
              return next(req);
            }
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
