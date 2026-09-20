import { Component } from '@angular/core';

@Component({
  selector: 'app-learning-page',
  template: `
    <ion-content class="dashboard-shell">
      <div class="dashboard-page">
        <aside class="sidebar">
          <div class="brand-block">
            <div class="brand-mark">C</div>
            <div>
              <div class="brand-name">CareerVerse</div>
              <div class="brand-subtitle">Learning path</div>
            </div>
          </div>

          <nav class="nav-list">
            <button class="nav-item" type="button" routerLink="/dashboard/overview">Overview</button>
            <button class="nav-item" type="button" routerLink="/dashboard/profile">Profile</button>
            <button class="nav-item" type="button" routerLink="/dashboard/simulation">Career simulation</button>
            <button class="nav-item active" type="button" routerLink="/dashboard/learning">Learning path</button>
          </nav>
        </aside>

        <main class="main-panel">
          <section class="hero-card">
            <div>
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
    </ion-content>
  `,
  styles: [
    `
      :host {
        display: block;
        --bg: #f4f1ff;
        --primary: #6d5ef6;
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
      .path-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
      .path-list li { display: flex; align-items: center; justify-content: space-between; gap: 16px; border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; background: rgba(109,94,246,0.03); }
      .path-list strong { display: block; margin-bottom: 4px; }
      .path-list small { color: var(--muted); }
      .path-list span { color: var(--primary); font-weight: 800; }
      .milestone-box { display: grid; gap: 14px; }
      .milestone-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-radius: 14px; background: rgba(109,94,246,0.04); border: 1px solid var(--line); }
      .milestone-row span { color: var(--text); }
      .milestone-row strong { color: var(--primary); }

      @media (max-width: 960px) {
        .dashboard-page, .content-grid { grid-template-columns: 1fr; }
        .dashboard-page { padding: 16px; }
        .hero-card { flex-direction: column; align-items: flex-start; }
      }
    `,
  ],
})
export class LearningPage {}
