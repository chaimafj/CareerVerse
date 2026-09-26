import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-learning-page',
  template: `
    <div class="learning-shell">
      <aside class="sidebar">
        <div class="brand-block">
          <div class="brand-mark">
            <span class="brand-core"></span>
          </div>
          <div class="brand-text">CareerVerse</div>
        </div>

        <nav class="nav-list" aria-label="Main navigation">
          <button class="nav-item" type="button" routerLink="/dashboard/overview">
            <span class="nav-icon">⌂</span>
            <span>Home</span>
          </button>
          <button class="nav-item" type="button" routerLink="/dashboard/profile">
            <span class="nav-icon">◔</span>
            <span>My Profile</span>
          </button>
          <button class="nav-item" type="button" routerLink="/dashboard/career-explorer">
            <span class="nav-icon">◌</span>
            <span>Career Explorer</span>
          </button>
          <button class="nav-item" type="button" routerLink="/dashboard/career-lab">
            <span class="nav-icon">◫</span>
            <span>Career Labs</span>
          </button>
          <button class="nav-item" type="button">
            <span class="nav-icon">⎍</span>
            <span>My Performance</span>
          </button>
          <button class="nav-item" type="button">
            <span class="nav-icon">◌</span>
            <span>Recommendations</span>
          </button>
          <button class="nav-item active" type="button" routerLink="/dashboard/learning">
            <span class="nav-icon">✦</span>
            <span>Learning Path</span>
            <span class="nav-arrow">›</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-footer-card">
            <div class="spark"></div>
            <div class="sidebar-footer-text">Your future starts with the right experience.</div>
          </div>
        </div>
      </aside>

      <div class="workspace">
        <header class="appbar">
          <div class="appbar-logo">CareerVerse</div>

          <label class="search-box" aria-label="Search bar">
            <span class="search-icon">⌕</span>
            <input type="text" placeholder="Search for careers, labs, or skills..." />
          </label>

          <div class="appbar-actions">
            <button class="notify-button" type="button" aria-label="Notifications">
              <span class="bell-icon">◔</span>
              <span class="notification-dot"></span>
            </button>

            <div class="user-menu-wrap">
              <button class="user-badge" type="button" routerLink="/dashboard/profile" aria-label="Profile menu">
                <div class="user-avatar" [style.background]="userAvatar ? 'transparent' : 'linear-gradient(135deg, #ffbca5 0%, #8d7ef7 100%)'">
                  <img *ngIf="userAvatar" [src]="userAvatar" alt="Profile" />
                  <span *ngIf="!userAvatar">{{ userInitials }}</span>
                </div>
                <div class="user-meta">
                  <span class="user-name">{{ currentUserName }}</span>
                  <small>{{ currentUserRole }}</small>
                </div>
                <span class="user-chevron">⌄</span>
              </button>
            </div>
          </div>
        </header>

        <main class="content-panel">
          <section class="hero-card">
            <div class="hero-copy">
              <p class="eyebrow">Growth plan</p>
              <h1>Learning path</h1>
            </div>
            <button class="primary-btn" type="button" routerLink="/dashboard/profile">Review profile</button>
          </section>

          <section class="content-grid">
            <article class="panel-card">
              <div class="card-header">
                <h2>Recommended modules</h2>
                <span class="chip success">3 active</span>
              </div>

              <ul class="path-list">
                <li>
                  <div>
                    <strong>Data storytelling</strong>
                    <small>Improve decision-making with data narratives</small>
                  </div>
                  <span>Week 1</span>
                </li>
                <li>
                  <div>
                    <strong>Product thinking</strong>
                    <small>Learn user-centered prioritization and discovery</small>
                  </div>
                  <span>Week 2</span>
                </li>
                <li>
                  <div>
                    <strong>Communication skills</strong>
                    <small>Present ideas clearly and influence stakeholders</small>
                  </div>
                  <span>Week 3</span>
                </li>
              </ul>
            </article>

            <article class="panel-card">
              <div class="card-header">
                <h2>Milestones</h2>
                <span class="chip">Progress</span>
              </div>

              <div class="milestone-box">
                <div class="milestone-row">
                  <span>Profile setup</span>
                  <strong>100%</strong>
                </div>
                <div class="milestone-row">
                  <span>Simulation practice</span>
                  <strong>68%</strong>
                </div>
                <div class="milestone-row">
                  <span>Skill roadmap</span>
                  <strong>82%</strong>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: linear-gradient(180deg, #faf8ff 0%, #eef3ff 100%);
        font-family: Inter, 'Segoe UI', sans-serif;
        color: #1b2d4f;
      }

      * { box-sizing: border-box; }
      button { font: inherit; }

      .learning-shell {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        min-height: 100vh;
        background: linear-gradient(90deg, #0b214f 0%, #0b214f 260px, #f3f6fb 260px, #f3f6fb 100%);
      }

      .sidebar {
        background: linear-gradient(180deg, #071d45 0%, #0d2349 100%);
        padding: 20px 16px 18px;
        color: #e8f0ff;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(130, 151, 201, 0.14);
      }

      .brand-block {
        display: flex; align-items: center; gap: 16px; padding: 8px 10px 22px;
      }
      .brand-mark {
        width: 42px; height: 42px; border-radius: 14px; background: linear-gradient(135deg, #7b6dff 0%, #5ea3ff 100%);
        position: relative; box-shadow: 0 0 18px rgba(116, 142, 255, 0.35);
      }
      .brand-core {
        position: absolute; inset: 11px; border-radius: 11px; background: rgba(255,255,255,0.18);
        box-shadow: inset 0 0 0 2px rgba(255,255,255,0.58);
      }
      .brand-text { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.06em; line-height: 1; }
      .nav-list { display: grid; gap: 12px; margin-top: 10px; }
      .nav-item {
        display: flex; align-items: center; gap: 16px; width: 100%; border: 0; background: transparent; color: #dfe8ff;
        border-radius: 14px; padding: 18px 16px; font-weight: 600; text-align: left; cursor: pointer; font-size: 1.05rem;
      }
      .nav-item.active {
        background: rgba(255,255,255,0.08); color: #fff; box-shadow: inset 0 0 0 1px rgba(161, 177, 255, 0.14);
      }
      .nav-icon { width: 28px; display: inline-flex; justify-content: center; font-size: 1.3rem; opacity: 0.95; }
      .nav-item span:nth-child(2) { flex: 1; }
      .nav-arrow { font-size: 1.4rem; color: rgba(255,255,255,0.7); }

      .sidebar-footer { margin-top: auto; padding: 14px 8px 0; }
      .sidebar-footer-card {
        background: linear-gradient(180deg, rgba(17,32,75,0.95), rgba(22,38,82,0.9));
        border: 1px solid rgba(116, 146, 255, 0.25); border-radius: 18px; padding: 14px 14px 18px; position: relative; overflow: hidden;
      }
      .spark {
        position: absolute; right: 18px; top: 12px; width: 46px; height: 46px; border-radius: 50%;
        background: radial-gradient(circle, rgba(123,198,255,0.7), rgba(123,198,255,0.04) 70%);
        box-shadow: 0 0 20px rgba(130, 204, 255, 0.55);
      }
      .sidebar-footer-text { width: 70%; color: #cfe0ff; font-size: 1.1rem; font-weight: 700; line-height: 1.4; letter-spacing: -0.04em; }

      .workspace {
        min-height: 100vh;
        padding: 0 26px 30px;
        background: linear-gradient(180deg, #f4f7fd 0%, #edf2fb 100%);
        overflow-y: auto;
      }

      .appbar {
        position: sticky;
        top: 0;
        z-index: 50;
        display: grid;
        grid-template-columns: auto minmax(360px, 1fr) auto;
        align-items: center;
        gap: 18px;
        background: linear-gradient(135deg, #bfdaf4 0%, #9fc3ea 100%);
        border: 1px solid rgba(122, 155, 194, 0.85);
        box-shadow: 0 12px 28px rgba(96, 126, 168, 0.18);
        border-radius: 22px;
        padding: 10px 18px;
        margin-bottom: 20px;
        backdrop-filter: blur(10px);
      }
      .appbar-logo { font-size: 2rem; font-weight: 800; letter-spacing: -0.06em; color: #1d2f5c; }
      .search-box {
        display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(141, 164, 198, 0.4);
        border-radius: 16px; padding: 12px 18px; color: #5c718d; font-size: 1rem; height: 58px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.3); min-width: 0;
      }
      .search-box input { width: 100%; border: 0; outline: 0; background: transparent; color: #2a3d5f; font-size: 1rem; }
      .search-box input::placeholder { color: #6a7f9d; }
      .search-icon { font-size: 1.3rem; opacity: 0.8; }
      .appbar-actions { display: flex; align-items: center; gap: 14px; }
      .notify-button {
        position: relative; width: 42px; height: 42px; border-radius: 12px; border: 1px solid rgba(127, 151, 184, 0.4);
        background: rgba(255,255,255,0.28); color: #39537d; font-size: 1.2rem; box-shadow: 0 6px 14px rgba(120, 143, 177, 0.1); display: grid; place-items: center; cursor: pointer;
      }
      .notification-dot {
        position: absolute; right: 9px; top: 8px; width: 9px; height: 9px; border-radius: 50%; background: #ff5c7a; border: 2px solid #f8fbff;
      }
      .user-menu-wrap { position: relative; }
      .user-badge {
        display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.55); border: 1px solid rgba(130, 143, 181, 0.12); border-radius: 999px; padding: 5px 10px 5px 6px; cursor: pointer; color: #212f50; font-weight: 700;
      }
      .user-avatar {
        width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #ffbca5 0%, #8d7ef7 100%); color: #fff; display: grid; place-items: center; font-weight: 700;
        overflow: hidden; border: 2px solid rgba(255,255,255,0.7); box-shadow: 0 6px 12px rgba(93, 95, 171, 0.18);
      }
      .user-avatar img {
        width: 100%; height: 100%; object-fit: cover; display: block;
      }
      .user-meta { display: flex; flex-direction: column; line-height: 1.1; }
      .user-name { color: #212f50; font-size: 0.9rem; font-weight: 700; }
      .user-meta small { color: #687998; }
      .user-chevron { color: #55688c; font-size: 1.1rem; }

      .content-panel { display: grid; gap: 24px; }
      .hero-card {
        display: flex; align-items: center; justify-content: space-between; gap: 18px; border-radius: 28px; padding: 26px 28px;
        background: linear-gradient(135deg, rgba(116, 96, 255, 0.12), rgba(124, 194, 255, 0.12), rgba(255, 125, 200, 0.12));
        border: 1px solid rgba(140, 164, 208, 0.5);
      }
      .eyebrow { margin: 0 0 10px; color: #5b6bc5; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; font-weight: 800; }
      h1 { margin: 0; font-size: clamp(2.5rem, 3vw, 3.8rem); letter-spacing: -0.06em; line-height: 0.97; color: #1d2947; }
      .primary-btn {
        border: none; border-radius: 999px; cursor: pointer; font-weight: 800; background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 35%, #ff73c9 100%);
        color: white; padding: 15px 24px; box-shadow: 0 16px 28px rgba(109, 94, 246, 0.25);
      }

      .content-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
      .panel-card {
        border-radius: 24px; padding: 22px; background: rgba(255,255,255,0.6); border: 1px solid rgba(138, 153, 210, 0.36);
        box-shadow: 0 16px 28px rgba(76, 93, 141, 0.08);
      }
      .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
      h2 { margin: 0; font-size: 1.5rem; letter-spacing: -0.04em; }
      .chip {
        display: inline-flex; align-items: center; justify-content: center; padding: 8px 12px; border-radius: 999px;
        background: rgba(109, 94, 246, 0.1); color: #4d57d7; font-size: 0.72rem; font-weight: 800;
      }
      .chip.success { background: rgba(50, 180, 120, 0.12); color: #1d8a5c; }
      .path-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
      .path-list li {
        display: flex; align-items: center; justify-content: space-between; gap: 16px; border: 1px solid rgba(138, 153, 210, 0.28);
        border-radius: 16px; padding: 14px 16px; background: rgba(109,94,246,0.03);
      }
      .path-list strong { display: block; margin-bottom: 4px; }
      .path-list small { color: #556884; }
      .path-list span { color: #4d57d7; font-weight: 800; }
      .milestone-box { display: grid; gap: 14px; }
      .milestone-row {
        display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-radius: 14px;
        background: rgba(109,94,246,0.04); border: 1px solid rgba(138, 153, 210, 0.28);
      }
      .milestone-row span { color: #1d2947; }
      .milestone-row strong { color: #4d57d7; }

      @media (max-width: 980px) {
        .learning-shell { grid-template-columns: 1fr; }
        .hero-card, .content-grid { grid-template-columns: 1fr; display: grid; }
        .workspace { padding: 0 16px 20px; }
      }
    `,
  ]
})
export class LearningPage implements OnInit {
  currentUserName = 'User';
  currentUserRole = 'Student';
  userInitials = 'U';
  userAvatar = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const profile = this.authService.getProfile();

    const firstName = user?.first_name || profile?.fullName?.split(' ')[0] || 'User';
    const lastName = user?.last_name || profile?.fullName?.split(' ').slice(1).join(' ') || '';
    const fullName = profile?.fullName || `${firstName} ${lastName}`.trim() || 'User';

    this.currentUserName = fullName || 'User';
    this.currentUserRole = user?.role || profile?.role || 'Student';
    this.userInitials = this.getInitials(firstName, lastName);
    this.userAvatar = profile?.avatar || '';
  }

  private getInitials(firstName: string, lastName: string): string {
    return `${(firstName || '').charAt(0) || 'U'}${(lastName || '').charAt(0) || ''}`.toUpperCase();
  }
}
