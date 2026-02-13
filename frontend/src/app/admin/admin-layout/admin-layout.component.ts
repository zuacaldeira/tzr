import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-shell">
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <div class="sidebar-brand">
          <span class="brand">TZR</span>
          <span class="brand-sub">CMS</span>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <span class="icon">📊</span><span class="label">Dashboard</span>
          </a>
          <a routerLink="/admin/beitraege" routerLinkActive="active">
            <span class="icon">📝</span><span class="label">Beiträge</span>
          </a>
          <a routerLink="/admin/kategorien" routerLinkActive="active">
            <span class="icon">📂</span><span class="label">Kategorien</span>
          </a>
          <a routerLink="/admin/autoren" routerLinkActive="active">
            <span class="icon">👤</span><span class="label">Autoren</span>
          </a>
          <a routerLink="/admin/tags" routerLinkActive="active">
            <span class="icon">🏷️</span><span class="label">Tags</span>
          </a>
          <div class="separator"></div>
          <a href="/" target="_blank" class="external">
            <span class="icon">↗</span><span class="label">Zum Blog</span>
          </a>
          <button class="nav-btn" (click)="logout()">
            <span class="icon">🚪</span><span class="label">Abmelden</span>
          </button>
        </nav>
      </aside>
      <div class="main-area">
        <header class="topbar">
          <button class="toggle-btn" (click)="toggleSidebar()">☰</button>
          <div class="topbar-right">
            @if (auth.currentUser()) {
              <span class="user-name">{{ auth.currentUser()!.displayName }}</span>
              <span class="role-badge">{{ auth.currentUser()!.role }}</span>
            }
          </div>
        </header>
        <main class="admin-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-shell { display: flex; min-height: 100vh; }
    .sidebar {
      width: 240px; background: #1e1e2e; color: #fff; display: flex; flex-direction: column;
      position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transition: width 0.2s;
    }
    .sidebar.collapsed { width: 60px; }
    .sidebar.collapsed .label { display: none; }
    .sidebar.collapsed .brand-sub { display: none; }
    .sidebar-brand {
      padding: 1.2rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: baseline; gap: 0.4rem;
    }
    .brand { font-family: 'Lora', serif; font-weight: 800; font-size: 1.2rem; }
    .brand-sub { font-size: 0.7rem; opacity: 0.5; }
    .sidebar-nav { flex: 1; padding: 0.8rem 0; display: flex; flex-direction: column; }
    .sidebar-nav a, .nav-btn {
      display: flex; align-items: center; gap: 0.7rem; padding: 0.6rem 1rem;
      font-size: 0.82rem; color: rgba(255,255,255,0.65); transition: all 0.15s;
      text-decoration: none; background: none; border: none; width: 100%; text-align: left;
      font-family: inherit; cursor: pointer;
    }
    .sidebar-nav a:hover, .nav-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
    .sidebar-nav a.active { color: #fff; background: rgba(58,158,126,0.2); border-right: 3px solid #3a9e7e; }
    .icon { font-size: 1rem; width: 20px; text-align: center; }
    .separator { height: 1px; background: rgba(255,255,255,0.08); margin: 0.8rem 0; }
    .main-area { flex: 1; margin-left: 240px; background: #f7f6f3; min-height: 100vh; transition: margin-left 0.2s; }
    .sidebar.collapsed ~ .main-area { margin-left: 60px; }
    .topbar {
      height: 50px; background: #fff; border-bottom: 1px solid #e8e6e1;
      display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem;
    }
    .toggle-btn { background: none; font-size: 1.2rem; color: #787774; }
    .topbar-right { display: flex; align-items: center; gap: 0.6rem; }
    .user-name { font-size: 0.82rem; font-weight: 600; color: #37352f; }
    .role-badge {
      font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 4px;
      background: #e5f5ef; color: #3a9e7e; text-transform: uppercase;
    }
    .admin-content { padding: 1.5rem; }
    @media (max-width: 960px) {
      .sidebar { width: 60px; }
      .sidebar .label { display: none; }
      .sidebar .brand-sub { display: none; }
      .main-area { margin-left: 60px; }
    }
  `]
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  sidebarCollapsed = signal(false);

  toggleSidebar() { this.sidebarCollapsed.update(v => !v); }
  logout() { this.auth.logout(); }
}
