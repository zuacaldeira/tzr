import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { token: string; refreshToken: string; expiresIn: number; user: AdminUser; }
export interface AdminUser { id: number; username: string; displayName: string; role: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = environment.apiUrl;

  currentUser = signal<AdminUser | null>(null);
  isLoggedIn = computed(() => !!this.currentUser() && !!this.getToken());

  constructor() {
    const user = localStorage.getItem('tzr_user');
    if (user && this.getToken()) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, req).pipe(
      tap(res => {
        localStorage.setItem('tzr_token', res.token);
        localStorage.setItem('tzr_refresh', res.refreshToken);
        localStorage.setItem('tzr_user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('tzr_token');
    localStorage.removeItem('tzr_refresh');
    localStorage.removeItem('tzr_user');
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null { return localStorage.getItem('tzr_token'); }
  getRefreshToken(): string | null { return localStorage.getItem('tzr_refresh'); }

  refreshToken(): Observable<LoginResponse | null> {
    const refresh = this.getRefreshToken();
    if (!refresh) return of(null);
    return this.http.post<LoginResponse>(`${this.api}/auth/refresh`, { refreshToken: refresh }).pipe(
      tap(res => {
        localStorage.setItem('tzr_token', res.token);
        localStorage.setItem('tzr_refresh', res.refreshToken);
        localStorage.setItem('tzr_user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      }),
      catchError(() => { this.logout(); return of(null); })
    );
  }

  getCurrentUser(): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.api}/auth/me`);
  }
}
