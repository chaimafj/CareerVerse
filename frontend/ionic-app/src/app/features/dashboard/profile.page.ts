import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  template: `
    <ion-content class="dashboard-shell">
      <div class="dashboard-page">
        <aside class="sidebar">
          <div class="brand-block">
            <div class="brand-mark">C</div>
            <div>
              <div class="brand-name">CareerVerse</div>
              <div class="brand-subtitle">Profile</div>
            </div>
          </div>

          <nav class="nav-list">
            <button class="nav-item" type="button" routerLink="/dashboard/overview">Overview</button>
            <button class="nav-item active" type="button" routerLink="/dashboard/profile">Profile</button>
            <button class="nav-item" type="button" routerLink="/dashboard/simulation">Career simulation</button>
          </nav>
        </aside>

        <main class="main-panel">
          <section class="hero-card">
            <div>
              <p class="eyebrow">Your identity</p>
              <h1>Profile overview</h1>
            </div>
            <button class="primary-btn" type="button">Edit profile</button>
          </section>

          <section class="content-grid">
            <article class="panel-card">
              <div class="card-header">
                <h2>Personal information</h2>
                <span class="chip">Verified</span>
              </div>

              <div class="user-row">
                <div class="avatar">A</div>
                <div>
                  <strong>Amine A.</strong>
                  <p>Business & Data student</p>
                </div>
              </div>

              <ul class="info-list">
                <li><span>Email</span><strong>amine&#64;example.com</strong></li>
                <li><span>Location</span><strong>Paris, France</strong></li>
                <li><span>Study level</span><strong>Master 1</strong></li>
                <li><span>Career goal</span><strong>Product manager</strong></li>
              </ul>
            </article>

            <article class="panel-card">
              <div class="card-header">
                <h2>Skills</h2>
                <span class="chip success">Strong</span>
              </div>

              <div class="skill-list">
                <span>Communication</span>
                <span>Research</span>
                <span>Data analysis</span>
                <span>Problem solving</span>
                <span>Leadership</span>
                <span>Presentation</span>
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
        display: block;
        --bg: #f4f1ff;
        --panel: rgba(255,255,255,0.75);
        --primary: #6d5ef6;
        --primary-2: #4d87ff;
        --pink: #ff7cc8;
        --text: #171c2b;
        --muted: #58657a;
        --line: rgba(108, 121, 146, 0.24);
        --shadow: 0 18px 42px rgba(48, 57, 96, 0.12);
      }

      .dashboard-shell {
        --background: linear-gradient(135deg, #f3efff 0%, #eef7ff 100%);
        background: var(--background);
      }

      .dashboard-page {
        max-width: 1380px;
        margin: 0 auto;
        padding: 28px;
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 24px;
        min-height: 100vh;
      }

      .sidebar, .panel-card, .hero-card { background: rgba(255,255,255,0.7); border: 1px solid var(--line); box-shadow: var(--shadow); }
      .sidebar { border-radius: 28px; padding: 22px 18px; }
      .brand-block { display: flex; align-items: center; gap: 12px; padding: 12px 10px 20px; border-bottom: 1px solid var(--line); }
      .brand-mark { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: linear-gradient(135deg, var(--primary), var(--pink)); color: white; font-size: 1.4rem; font-weight: 800; }
      .brand-name { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; }
      .brand-subtitle { color: var(--muted); font-size: 0.8rem; }
      .nav-list { display: grid; gap: 10px; margin-top: 22px; }
      .nav-item { background: transparent; border: none; border-radius: 12px; padding: 12px 14px; text-align: left; font-weight: 700; color: var(--text); cursor: pointer; }
      .nav-item.active { background: linear-gradient(90deg, rgba(109, 94, 246, 0.14), rgba(77, 135, 255, 0.12)); color: var(--primary); }
      .main-panel { display: grid; gap: 24px; }
      .hero-card { border-radius: 28px; padding: 24px 26px; display: flex; align-items: center; justify-content: space-between; gap: 18px; background: linear-gradient(135deg, rgba(109, 94, 246, 0.12), rgba(255, 124, 200, 0.10)); }
      .eyebrow { margin: 0 0 8px; text-transform: uppercase; color: var(--primary); font-weight: 800; letter-spacing: 0.12em; font-size: 0.75rem; }
      h1 { margin: 0; font-size: clamp(2.1rem, 3vw, 3.3rem); letter-spacing: -0.06em; }
      .primary-btn { border: none; border-radius: 999px; cursor: pointer; font-weight: 800; background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 35%, #ff73c9 100%); color: white; padding: 15px 24px; box-shadow: 0 16px 28px rgba(109, 94, 246, 0.25); }
      .content-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 20px; }
      .panel-card { border-radius: 24px; padding: 22px; }
      .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
      h2 { margin: 0; font-size: 1.4rem; letter-spacing: -0.04em; }
      .chip { display: inline-flex; align-items: center; justify-content: center; padding: 8px 12px; border-radius: 999px; background: rgba(109, 94, 246, 0.1); color: var(--primary); font-size: 0.72rem; font-weight: 800; }
      .chip.success { background: rgba(50, 180, 120, 0.12); color: #1d8a5c; }
      .user-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
      .avatar { width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; background: linear-gradient(135deg, var(--primary), var(--pink)); color: white; font-weight: 800; }
      .user-row strong { display: block; font-size: 1.1rem; }
      .user-row p { margin: 4px 0 0; color: var(--muted); }
      .info-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
      .info-list li { display: flex; justify-content: space-between; gap: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--line); color: var(--muted); }
      .info-list li strong { color: var(--text); }
      .skill-list { display: flex; flex-wrap: wrap; gap: 10px; }
      .skill-list span { padding: 10px 12px; border-radius: 999px; background: rgba(109, 94, 246, 0.08); color: var(--primary); font-weight: 700; }

      @media (max-width: 960px) {
        .dashboard-page, .content-grid { grid-template-columns: 1fr; }
        .dashboard-page { padding: 16px; }
        .hero-card { flex-direction: column; align-items: flex-start; }
      }
    `,
  ],
})
export class ProfilePage {}
