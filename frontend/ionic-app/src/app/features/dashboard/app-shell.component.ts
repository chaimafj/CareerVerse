import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/** Barre latérale + barre du haut communes, au même style que les autres pages du dashboard. */
@Component({
  selector: 'app-shell',
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand-block">
          <div class="brand-mark"><span class="brand-core"></span></div>
          <div class="brand-text">CareerVerse</div>
        </div>

        <nav class="nav-list" aria-label="Main navigation">
          <button *ngFor="let item of nav" class="nav-item" [class.active]="item.key === active" type="button" [routerLink]="item.link">
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span class="nav-arrow" *ngIf="item.key === active">›</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-footer-card">
            <div class="spark"></div>
            <div class="sidebar-footer-text">Your profile and labs feed a real deep learning model.</div>
          </div>
        </div>
      </aside>

      <div class="workspace">
        <header class="appbar">
          <div class="appbar-logo">CareerVerse</div>
          <div class="appbar-title">{{ title }}</div>
          <div class="appbar-actions">
            <button class="user-badge" type="button" routerLink="/dashboard/profile" aria-label="Profile">
              <div class="user-avatar">
                <img *ngIf="userAvatar" [src]="userAvatar" alt="" />
                <span *ngIf="!userAvatar">{{ userInitials }}</span>
              </div>
              <div class="user-meta">
                <span class="user-name">{{ userName }}</span>
                <small>Student</small>
              </div>
            </button>
            <button class="logout-btn" type="button" (click)="logout()">Log out</button>
          </div>
        </header>

        <main class="content-area">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; font-family: Inter, 'Segoe UI', sans-serif; color: #1b2d4f; }
    * { box-sizing: border-box; }
    button { font: inherit; }
    .shell { display: grid; grid-template-columns: 260px minmax(0, 1fr); min-height: 100vh; background: #f3f6fb; }
    .sidebar { background: linear-gradient(180deg, #071d45 0%, #0d2349 100%); padding: 20px 16px 18px; color: #e8f0ff; display: flex; flex-direction: column; }
    .brand-block { display: flex; align-items: center; gap: 16px; padding: 8px 10px 22px; }
    .brand-mark { width: 42px; height: 42px; border-radius: 14px; background: linear-gradient(135deg, #7b6dff 0%, #5ea3ff 100%); position: relative; box-shadow: 0 0 18px rgba(116, 142, 255, 0.35); }
    .brand-core { position: absolute; inset: 11px; border-radius: 11px; background: rgba(255,255,255,0.18); box-shadow: inset 0 0 0 2px rgba(255,255,255,0.58); }
    .brand-text { font-size: 2rem; font-weight: 800; letter-spacing: -0.06em; line-height: 1; }
    .nav-list { display: grid; gap: 8px; margin-top: 10px; }
    .nav-item { display: flex; align-items: center; gap: 16px; width: 100%; border: 0; background: transparent; color: #dfe8ff; border-radius: 14px; padding: 15px 16px; font-weight: 600; cursor: pointer; text-align: left; font-size: 1.02rem; }
    .nav-item:hover { background: rgba(255,255,255,0.05); }
    .nav-item.active { background: rgba(255,255,255,0.08); color: #fff; box-shadow: inset 0 0 0 1px rgba(161, 177, 255, 0.14); }
    .nav-icon { width: 28px; display: inline-flex; justify-content: center; font-size: 1.2rem; }
    .nav-item span:nth-child(2) { flex: 1; }
    .nav-arrow { font-size: 1.4rem; color: rgba(255,255,255,0.7); }
    .sidebar-footer { margin-top: auto; padding: 14px 8px 0; }
    .sidebar-footer-card { background: linear-gradient(180deg, rgba(17,32,75,0.95), rgba(22,38,82,0.9)); border: 1px solid rgba(116, 146, 255, 0.25); border-radius: 18px; padding: 14px 14px 18px; position: relative; overflow: hidden; }
    .spark { position: absolute; right: 14px; top: 12px; width: 40px; height: 40px; border-radius: 50%; background: radial-gradient(circle, rgba(123,198,255,0.7), rgba(123,198,255,0.04) 70%); }
    .sidebar-footer-text { width: 75%; color: #cfe0ff; font-size: 1rem; font-weight: 700; line-height: 1.4; }
    .workspace { height: 100vh; overflow-y: auto; padding: 0 26px 32px; background: linear-gradient(180deg, #f4f7fd 0%, #edf2fb 100%); }
    .appbar { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; gap: 18px; background: linear-gradient(135deg, #bfdaf4 0%, #9fc3ea 100%); border: 1px solid rgba(122, 155, 194, 0.85); box-shadow: 0 12px 28px rgba(96, 126, 168, 0.18); border-radius: 22px; padding: 10px 18px; margin: 12px 0 18px; }
    .appbar-logo { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.06em; color: #1d2f5c; }
    .appbar-title { flex: 1; font-weight: 700; color: #3a5079; }
    .appbar-actions { display: flex; align-items: center; gap: 12px; }
    .user-badge { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.55); border: 1px solid rgba(130, 143, 181, 0.12); border-radius: 999px; padding: 5px 12px 5px 6px; cursor: pointer; color: #212f50; font-weight: 700; }
    .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #ffbca5 0%, #8d7ef7 100%); color: #fff; display: grid; place-items: center; overflow: hidden; }
    .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .user-meta { display: flex; flex-direction: column; line-height: 1.1; text-align: left; }
    .user-name { font-size: 0.9rem; }
    .user-meta small { color: #687998; font-weight: 500; }
    .logout-btn { border: 1px solid rgba(120, 140, 175, 0.6); background: rgba(255,255,255,0.35); color: #2e3f6d; border-radius: 999px; padding: 9px 16px; font-weight: 700; cursor: pointer; }
    .content-area { display: grid; gap: 22px; }
    @media (max-width: 980px) {
      .shell { grid-template-columns: 1fr; }
      .workspace { height: auto; padding: 0 16px 24px; }
      .appbar-title { display: none; }
    }
  `],
})
export class AppShellComponent implements OnInit {
  @Input() active = '';
  @Input() title = '';

  readonly nav = [
    { key: 'overview', label: 'Home', icon: '⌂', link: '/dashboard/overview' },
    { key: 'profile', label: 'My Profile', icon: '◔', link: '/dashboard/profile' },
    { key: 'assessment', label: 'Assessment', icon: '☰', link: '/dashboard/assessment' },
    { key: 'career-explorer', label: 'Career Explorer', icon: '◌', link: '/dashboard/career-explorer' },
    { key: 'career-lab', label: 'Career Labs', icon: '◫', link: '/dashboard/career-lab' },
    { key: 'results', label: 'AI Results', icon: '✦', link: '/dashboard/results' },
    { key: 'learning', label: 'Learning Path', icon: '❖', link: '/dashboard/learning' },
  ];

  userName = 'User';
  userInitials = 'U';
  userAvatar = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const profile = this.authService.getProfile();
    const first = user?.first_name || '';
    const last = user?.last_name || '';
    this.userName = profile?.fullName || `${first} ${last}`.trim() || user?.email || 'User';
    this.userInitials = `${first.charAt(0) || 'U'}${last.charAt(0) || ''}`.toUpperCase();
    this.userAvatar = profile?.avatar || '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
