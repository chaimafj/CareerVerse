import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  template: `
    <ion-header class="top-header">
      <ion-toolbar>
        <ion-title>CareerVerse</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="dashboard-shell" scrollEvents="true" [style.--scroll-progress]="scrollProgress">
      <div class="dashboard-page">
        <aside class="sidebar">
          <div class="brand-block">
            <div class="brand-mark">C</div>
            <div>
              <div class="brand-name">CareerVerse</div>
              <div class="brand-subtitle">Student dashboard</div>
            </div>
          </div>

          <nav class="nav-list">
            <button class="nav-item active" type="button" routerLink="/dashboard/overview">Overview</button>
            <button class="nav-item" type="button" routerLink="/dashboard/profile">Profile</button>
            <button class="nav-item" type="button" routerLink="/dashboard/simulation">Career simulation</button>
            <button class="nav-item" type="button" routerLink="/dashboard/learning">Learning path</button>
          </nav>
        </aside>

        <main class="main-panel">
          <section class="hero-card">
            <div class="hero-copy">
              <p class="eyebrow">Welcome back</p>
              <h1>Build your future with clarity.</h1>
            </div>
            <button class="primary-btn" type="button" routerLink="/dashboard/simulation">Launch career simulation</button>
          </section>

          <section class="stats-grid">
            <article class="stat-card accent">
              <span class="label">Profile score</span>
              <strong>86%</strong>
              <small>Strong match for tech and product roles</small>
            </article>

            <article class="stat-card">
              <span class="label">Career matches</span>
              <strong>12</strong>
              <small>Based on your interests and skills</small>
            </article>

            <article class="stat-card">
              <span class="label">Skills to grow</span>
              <strong>4</strong>
              <small>Focus on communication and analytics</small>
            </article>
          </section>

          <section class="content-grid">
            <article class="panel-card">
              <div class="card-header">
                <h2>User profile</h2>
                <button class="chip-button" type="button" routerLink="/dashboard/profile">Updated today</button>
              </div>

              <div class="user-row">
                <div class="avatar">A</div>
                <div>
                  <strong>Amine A.</strong>
                  <p>Business & Data student</p>
                </div>
              </div>

              <ul class="info-list">
                <li><span>Interests</span><strong>AI, product, design</strong></li>
                <li><span>Current focus</span><strong>Career discovery</strong></li>
                <li><span>Preferred path</span><strong>Data analyst / PM</strong></li>
              </ul>
            </article>

            <article class="panel-card">
              <div class="card-header">
                <h2>Career simulation</h2>
                <span class="chip success">Live</span>
              </div>

              <div class="simulation-box">
                <div class="badge">AI Scenario</div>
                <h3>Product Management Challenge</h3>
                <p>Explore a real-world career scenario and evaluate your decisions.</p>
                <button class="secondary-btn" type="button" routerLink="/dashboard/simulation">Start simulation</button>
              </div>
            </article>
          </section>
        </main>
      </div>
    </ion-content>
  `,
  styles: [
    `
      :host {
        --bg-1: #f7f2ee;
        --bg-2: #f3eadf;
        --panel: rgba(255, 255, 255, 0.82);
        --panel-strong: rgba(255, 255, 255, 0.94);
        --primary: #7b6ce6;
        --primary-2: #a68bff;
        --warm: #f6b8a5;
        --peach: #fbe9df;
        --pink: #f0cfe7;
        --text: #1f2433;
        --muted: #5f697e;
        --line: rgba(97, 103, 128, 0.14);
        --success: #4bbd9a;
        --shadow: 0 24px 42px rgba(79, 66, 92, 0.09);
        --scroll-progress: 0;
      }

      :host {
        display: block;
        background: linear-gradient(180deg, var(--bg-2) 0%, #fbf8f5 100%);
      }

      .top-header {
        --background: linear-gradient(90deg, #7c6ce6 0%, #9381f0 100%);
        --color: #ffffff;
        border-bottom: 1px solid rgba(255,255,255,0.12);
      }

      .top-header ion-toolbar {
        --background: transparent;
        --color: #ffffff;
        --border-width: 0;
        min-height: 58px;
      }

      .top-header ion-title {
        font-size: 1.08rem;
        font-weight: 800;
        letter-spacing: -0.04em;
      }

      .dashboard-shell {
        --background: transparent;
        background:
          radial-gradient(circle at top left, rgba(255, 206, 177, 0.32) 0%, transparent 24%),
          radial-gradient(circle at bottom right, rgba(166, 139, 255, 0.18) 0%, transparent 25%),
          linear-gradient(180deg, var(--bg-1) 0%, #fdf9f7 100%);
        scroll-behavior: smooth;
      }

      .dashboard-page {
        max-width: 1360px;
        margin: 0 auto;
        padding: 24px 22px 46px;
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 24px;
        min-height: calc(100vh - 58px);
      }

      .sidebar,
      .panel-card,
      .hero-card,
      .stat-card {
        background: var(--panel);
        border: 1px solid var(--line);
        box-shadow: var(--shadow);
      }

      .sidebar {
        border-radius: 24px;
        padding: 18px 16px 20px;
        min-height: 420px;
        position: sticky;
        top: 18px;
        align-self: start;
        background: rgba(255, 255, 255, 0.68);
        backdrop-filter: blur(10px);
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 8px 18px;
        border-bottom: 1px solid var(--line);
      }

      .brand-mark {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--primary), var(--warm));
        color: white;
        font-size: 1.3rem;
        font-weight: 800;
        box-shadow: 0 14px 22px rgba(123, 108, 230, 0.22);
      }

      .brand-name {
        font-size: 1.45rem;
        font-weight: 800;
        letter-spacing: -0.06em;
        color: var(--text);
      }

      .brand-subtitle {
        color: var(--muted);
        font-size: 0.8rem;
      }

      .nav-list {
        display: grid;
        gap: 10px;
        margin-top: 18px;
      }

      .nav-item {
        background: transparent;
        border: 1px solid transparent;
        border-radius: 14px;
        padding: 12px 14px;
        text-align: left;
        font-weight: 700;
        color: var(--text);
        cursor: pointer;
        transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
      }

      .nav-item:hover {
        transform: translateX(2px);
        border-color: rgba(123, 108, 230, 0.18);
        background: rgba(123, 108, 230, 0.04);
      }

      .nav-item.active {
        background: linear-gradient(90deg, rgba(123, 108, 230, 0.11), rgba(246, 184, 165, 0.12));
        border-color: rgba(123, 108, 230, 0.18);
        color: var(--primary);
        box-shadow: inset 0 0 0 1px rgba(123, 108, 230, 0.06);
      }

      .main-panel {
        display: grid;
        gap: 22px;
      }

      .hero-card {
        border-radius: 28px;
        padding: 26px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        background: linear-gradient(135deg, rgba(250, 242, 237, 0.92), rgba(243, 246, 255, 0.96));
        border: 1px solid rgba(123, 108, 230, 0.09);
        animation: riseIn 0.7s ease-out;
        transform: translateY(calc(var(--scroll-progress) * -16px));
        transition: transform 0.3s ease;
      }

      .hero-copy {
        flex: 1;
      }

      .eyebrow {
        margin: 0 0 10px;
        text-transform: uppercase;
        color: var(--primary);
        font-weight: 800;
        letter-spacing: 0.12em;
        font-size: 0.72rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.3rem, 3vw, 4rem);
        line-height: 1.02;
        letter-spacing: -0.07em;
        font-weight: 800;
        color: var(--text);
      }

      .primary-btn,
      .secondary-btn {
        border: none;
        border-radius: 999px;
        cursor: pointer;
        font-weight: 800;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .primary-btn:hover,
      .secondary-btn:hover,
      .chip-button:hover {
        transform: translateY(-1px);
      }

      .primary-btn {
        background: linear-gradient(90deg, #8a7ef4 0%, #7d79ef 32%, #f6b8a5 100%);
        color: white;
        padding: 15px 22px;
        box-shadow: 0 16px 26px rgba(123, 108, 230, 0.22);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
      }

      .stat-card {
        border-radius: 18px;
        padding: 18px 18px 16px;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 30px rgba(95, 105, 126, 0.1);
      }

      .stat-card.accent {
        background: linear-gradient(135deg, rgba(123, 108, 230, 0.08), rgba(246, 184, 165, 0.12));
      }

      .label {
        display: block;
        color: var(--muted);
        font-size: 0.8rem;
        margin-bottom: 10px;
      }

      .stat-card strong {
        display: block;
        font-size: 2.5rem;
        letter-spacing: -0.06em;
        margin-bottom: 8px;
        color: var(--text);
      }

      .stat-card small {
        color: var(--muted);
        line-height: 1.4;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 20px;
      }

      .panel-card {
        border-radius: 20px;
        padding: 18px 20px;
        transition: transform 0.25s ease;
      }

      .panel-card:hover {
        transform: translateY(-3px);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      h2 {
        margin: 0;
        font-size: 1.3rem;
        letter-spacing: -0.04em;
        color: var(--text);
      }

      .chip,
      .chip-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(123, 108, 230, 0.08);
        color: var(--primary);
        font-size: 0.72rem;
        font-weight: 800;
        border: none;
        cursor: pointer;
      }

      .chip.success {
        background: rgba(75, 189, 154, 0.12);
        color: #1f8e70;
      }

      .user-row {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 16px;
      }

      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--primary), var(--warm));
        color: white;
        font-weight: 800;
        box-shadow: 0 12px 20px rgba(123, 108, 230, 0.2);
      }

      .user-row strong {
        display: block;
        font-size: 1.15rem;
        color: var(--text);
      }

      .user-row p {
        margin: 4px 0 0;
        color: var(--muted);
      }

      .info-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 12px;
      }

      .info-list li {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--line);
        color: var(--muted);
      }

      .info-list li strong {
        color: var(--text);
      }

      .simulation-box {
        background: linear-gradient(135deg, rgba(123, 108, 230, 0.08), rgba(249, 232, 222, 0.88));
        border-radius: 18px;
        padding: 18px;
      }

      .badge {
        display: inline-block;
        margin-bottom: 12px;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(123, 108, 230, 0.12);
        color: var(--primary);
        font-size: 0.72rem;
        font-weight: 800;
      }

      .simulation-box h3 {
        margin: 0 0 10px;
        font-size: 1.4rem;
        letter-spacing: -0.04em;
        color: var(--text);
      }

      .simulation-box p {
        margin: 0 0 18px;
        color: var(--muted);
        line-height: 1.6;
      }

      .secondary-btn {
        background: rgba(255,255,255,0.72);
        border: 1px solid var(--line);
        padding: 12px 18px;
        color: var(--text);
      }

      @keyframes riseIn {
        from {
          opacity: 0;
          transform: translateY(18px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 960px) {
        .dashboard-page,
        .content-grid,
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .dashboard-page {
          padding: 16px;
        }

        .hero-card {
          flex-direction: column;
          align-items: flex-start;
        }

        .sidebar {
          position: static;
        }
      }
    `,
  ],
})
export class DashboardPage {
  public scrollProgress = 0;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    this.scrollProgress = Math.min(scrollTop / 220, 1);
  }
}
