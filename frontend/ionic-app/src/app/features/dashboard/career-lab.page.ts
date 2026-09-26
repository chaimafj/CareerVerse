import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface MissionItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: string;
  description: string;
  tags: string[];
  progress: number;
}

interface CareerLabItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  accent: string;
  missions: MissionItem[];
}

@Component({
  selector: 'app-career-lab-page',
  template: `
    <div class="career-lab-shell">
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
          <button class="nav-item active" type="button" routerLink="/dashboard/career-lab">
            <span class="nav-icon">◫</span>
            <span>Career Labs</span>
            <span class="nav-arrow">›</span>
          </button>
          <button class="nav-item" type="button" routerLink="/dashboard/learning">
            <span class="nav-icon">✦</span>
            <span>Learning Path</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-footer-card">
            <div class="spark"></div>
            <div class="sidebar-footer-text">Practice the work before you commit to a path.</div>
          </div>
        </div>
      </aside>

      <div class="workspace">
        <header class="appbar">
          <div class="appbar-logo">CareerVerse</div>

          <label class="search-box" aria-label="Search bar">
            <span class="search-icon">⌕</span>
            <input type="text" [value]="query" (input)="query = $any($event.target).value" placeholder="Search careers or missions..." />
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

        <main class="content-area">
          <section class="hero-panel">
            <div class="hero-copy">
              <p class="eyebrow">Career Labs</p>
              <h1>Choose your job and train in real missions.</h1>
              <p class="subtitle">
                Explore each profession, select the lab that matches your goals, and complete multiple hands-on simulations to measure your performance.
              </p>
              <div class="hero-actions">
                <button class="primary-btn" type="button" (click)="startMission(selectedCareer.id, selectedCareer.missions[0].id)">Start a challenge</button>
                <button class="secondary-btn" type="button" routerLink="/dashboard/career-explorer">Explore careers</button>
              </div>
            </div>

            <div class="hero-visual" aria-hidden="true">
              <div class="orb-glow"></div>
              <div class="role-pill">
                <span class="mini-tag">Selected role</span>
                <strong>{{ selectedCareer.title }}</strong>
              </div>
              <div class="labs-pill">
                <span class="mini-tag">Labs</span>
                <strong>{{ totalMissions }} missions</strong>
              </div>
            </div>
          </section>

          <section class="stats-grid">
            <article class="stat-card purple-card">
              <div class="stat-header">
                <span class="stat-icon">◎</span>
                <span class="stat-label">Career paths</span>
              </div>
              <div class="stat-value">{{ careers.length }}</div>
              <small>Active professions</small>
            </article>

            <article class="stat-card blue-card">
              <div class="stat-header">
                <span class="stat-icon">✦</span>
                <span class="stat-label">Missions</span>
              </div>
              <div class="stat-value">{{ totalMissions }}</div>
              <small>Ready to practice</small>
            </article>

            <article class="stat-card pink-card">
              <div class="stat-header">
                <span class="stat-icon">▣</span>
                <span class="stat-label">Score</span>
              </div>
              <div class="stat-value">88%</div>
              <small>Performance</small>
            </article>
          </section>

          <section class="simulation-preview">
            <div class="preview-copy">
              <p class="preview-label">Simulation preview</p>
              <h2>{{ selectedCareer.title }}</h2>
              <p>{{ selectedCareer.missions[0].description }}</p>
            </div>

            <div class="preview-meta">
              <div class="meta-item">
                <span>Current lab</span>
                <strong>{{ selectedCareer.missions[0].subtitle }}</strong>
              </div>
              <div class="meta-item">
                <span>Difficulty</span>
                <strong>{{ selectedCareer.missions[0].difficulty }}</strong>
              </div>
            </div>

            <button class="preview-btn" type="button" (click)="startMission(selectedCareer.id, selectedCareer.missions[0].id)">
              Open simulation
            </button>
          </section>

          <section class="career-picker">
            <div class="section-head">
              <h2>Available careers</h2>
            </div>

            <div class="career-list">
              <article
                *ngFor="let career of filteredCareers"
                class="career-card"
                [class.active]="selectedCareerId === career.id"
                [style.borderColor]="career.accent"
                (click)="selectCareer(career.id)"
              >
                <div class="career-head">
                  <span class="career-icon" [style.background]="career.accent">{{ career.icon }}</span>
                  <span class="career-text">
                    <strong>{{ career.title }}</strong>
                    <small>{{ career.missions.length }} lab</small>
                  </span>
                </div>

                <p>{{ career.description }}</p>

                <button class="view-lab-btn" type="button" (click)="startMission(career.id, career.missions[0].id); $event.stopPropagation()">
                  View lab
                </button>
              </article>
            </div>
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

      .career-lab-shell {
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
        display: flex; align-items: center; gap: 16px; width: 100%; border: 0; background: transparent;
        color: #dfe8ff; border-radius: 14px; padding: 18px 16px; font-weight: 600; cursor: pointer; text-align: left; font-size: 1.05rem;
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
      .sidebar-footer-text { width: 70%; color: #cfe0ff; font-size: 1.1rem; font-weight: 700; line-height: 1.4; }

      .workspace {
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0 26px 32px;
        background: linear-gradient(180deg, #f4f7fd 0%, #edf2fb 100%);
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
        margin-bottom: 8px;
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

      .content-area { display: grid; gap: 22px; padding-bottom: 12px; }
      .hero-panel {
        display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.9fr); align-items: center;
        gap: 10px; background: linear-gradient(90deg, rgba(222, 233, 245, 0.9) 0%, rgba(219, 228, 240, 0.95) 100%);
        border: 1px solid rgba(158, 170, 193, 0.7); border-radius: 30px; padding: 28px 32px 26px; min-height: 308px;
        box-shadow: 0 18px 24px rgba(141, 160, 195, 0.08);
      }
      .eyebrow {
        margin: 0 0 12px; color: #5b6bc5; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; font-weight: 800;
      }
      h1 {
        margin: 0; font-size: clamp(2.8rem, 4vw, 5.2rem); letter-spacing: -0.065em; line-height: 0.97; color: #1d2947;
        max-width: 760px;
      }
      .subtitle { margin: 20px 0 0; max-width: 760px; color: #4f607d; font-size: 1.06rem; line-height: 1.7; }
      .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 22px; }
      .primary-btn, .secondary-btn, .lab-btn { border: 0; border-radius: 999px; cursor: pointer; font-weight: 700; }
      .primary-btn {
        padding: 16px 26px; background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 42%, #ff73c9 100%);
        color: #fff; box-shadow: 0 16px 28px rgba(109, 94, 246, 0.2); font-size: 1.05rem;
      }
      .secondary-btn {
        padding: 16px 26px; background: rgba(255,255,255,0.28); color: #2e3f6d; border: 1px solid rgba(120, 140, 175, 0.7);
        font-size: 1.05rem;
      }

      .hero-visual {
        position: relative; min-height: 250px; display: flex; align-items: center; justify-content: center;
      }
      .orb-glow {
        width: 300px; height: 220px; border-radius: 52% 48% 50% 50% / 52% 55% 45% 48%;
        background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(199, 181, 255, 0.55) 28%, rgba(255,255,255,0.12) 64%, rgba(255,255,255,0) 100%);
        border: 1px solid rgba(163, 170, 217, 0.36); box-shadow: inset 0 0 30px rgba(255,255,255,0.45);
      }
      .role-pill, .labs-pill {
        position: absolute; display: grid; gap: 7px; padding: 16px 18px; border-radius: 18px; background: rgba(255,255,255,0.82);
        box-shadow: 0 18px 28px rgba(96, 106, 154, 0.12); border: 1px solid rgba(149, 163, 203, 0.35);
        backdrop-filter: blur(8px);
      }
      .role-pill {
        top: 42px; right: 14px; min-width: 190px;
      }
      .labs-pill {
        bottom: 22px; left: 30px; min-width: 170px;
      }
      .mini-tag {
        font-size: 0.72rem; font-weight: 700; color: #6f78d9; letter-spacing: 0.02em; margin-bottom: 2px;
      }
      .role-pill strong, .labs-pill strong { color: #1d2947; font-size: 1.08rem; }

      .stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
      .stat-card {
        border-radius: 22px; padding: 20px 22px 18px; border: 1px solid rgba(138, 153, 210, 0.36);
        box-shadow: 0 16px 28px rgba(76, 93, 141, 0.08); background: rgba(255,255,255,0.48);
      }
      .purple-card { background: linear-gradient(135deg, rgba(117, 108, 255, 0.08), rgba(255,255,255,0.8)); }
      .blue-card { background: linear-gradient(135deg, rgba(126, 195, 255, 0.10), rgba(255,255,255,0.8)); }
      .pink-card { background: linear-gradient(135deg, rgba(255, 167, 214, 0.10), rgba(255,255,255,0.8)); }
      .stat-header { display: flex; align-items: center; gap: 10px; color: #304a7c; font-weight: 700; }
      .stat-icon {
        width: 38px; height: 38px; border-radius: 12px; background: rgba(111, 118, 255, 0.12); display: grid; place-items: center;
        font-size: 1.1rem; color: #354a87;
      }
      .stat-label { font-size: 0.98rem; }
      .stat-value { margin-top: 18px; font-size: 3rem; font-weight: 800; letter-spacing: -0.06em; color: #1d2947; }
      .stat-card small { display: block; margin-top: 2px; color: #546886; font-size: 1rem; }

      .simulation-preview {
        display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(220px, 0.8fr) auto;
        align-items: center; gap: 18px; padding: 22px 24px; border-radius: 24px;
        background: linear-gradient(135deg, rgba(107, 118, 255, 0.09), rgba(255,255,255,0.9));
        border: 1px solid rgba(138, 153, 210, 0.36);
        box-shadow: 0 16px 28px rgba(76, 93, 141, 0.08);
      }
      .preview-label { margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.72rem; font-weight: 800; color: #5957d7; }
      .preview-copy h2 { margin: 0; font-size: 2rem; letter-spacing: -0.06em; color: #1d2947; }
      .preview-copy p { margin: 8px 0 0; color: #4e607d; line-height: 1.6; }
      .preview-meta { display: grid; gap: 10px; }
      .meta-item {
        display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 14px;
        background: rgba(255,255,255,0.5); border: 1px solid rgba(138, 153, 210, 0.28);
      }
      .meta-item span { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: #63779a; }
      .meta-item strong { color: #1d2947; font-size: 0.98rem; }
      .preview-btn {
        border: 0; border-radius: 999px; background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 35%, #ff73c9 100%);
        color: #fff; font-weight: 700; padding: 14px 20px; cursor: pointer; box-shadow: 0 16px 28px rgba(109, 94, 246, 0.2);
      }

      .career-picker { background: rgba(255,255,255,0.7); border: 1px solid rgba(138, 153, 210, 0.36); border-radius: 24px; padding: 22px; }
      .section-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 18px; }
      .section-head h2 { margin: 0; font-size: 1.5rem; letter-spacing: -0.04em; }
      .career-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
      .career-card {
        display: grid; gap: 14px; padding: 18px; border-radius: 20px; border: 1px solid rgba(130, 149, 211, 0.35);
        background: rgba(255,255,255,0.75); color: #23375e; text-align: left; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .career-card.active {
        box-shadow: 0 14px 28px rgba(97, 112, 188, 0.12); transform: translateY(-1px);
      }
      .career-head { display: flex; align-items: center; gap: 12px; }
      .career-icon {
        width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; color: #fff; font-weight: 800;
      }
      .career-text { display: grid; gap: 4px; }
      .career-text strong { font-size: 1.02rem; }
      .career-text small { color: #5d6d8d; }
      .career-card p { margin: 0; color: #4f628b; line-height: 1.6; }
      .view-lab-btn {
        border: 0; border-radius: 999px; padding: 11px 16px; background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 35%, #ff73c9 100%);
        color: #fff; font-weight: 700; cursor: pointer; justify-self: start; min-width: 118px;
      }

      @media (max-width: 980px) {
        .career-lab-shell { grid-template-columns: 1fr; }
        .sidebar { border-right: 0; }
        .hero-panel, .stats-grid, .lab-grid { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class CareerLabPage implements OnInit {
  query = '';
  selectedCareerId = 'cloud-engineer';
  currentUserName = 'User';
  currentUserRole = 'Student';
  userInitials = 'U';
  userAvatar = '';

  careers: CareerLabItem[] = [
    {
      id: 'cloud-engineer',
      title: 'Cloud Engineer',
      icon: '☁',
      description: 'Design resilient cloud systems and scalable infrastructure for real-world applications.',
      accent: '#6d7cff',
      missions: [
        { id: 'cloud-engineer-lab-1', title: 'Lab 1', subtitle: 'Cloud architecture', duration: '20 min', difficulty: 'Intermediate', description: 'Build a solid cloud setup for web traffic, security and availability.', tags: ['AWS', 'Architecture', 'Scalability'], progress: 0 },
        { id: 'cloud-engineer-lab-2', title: 'Lab 2', subtitle: 'Resilience plan', duration: '24 min', difficulty: 'Advanced', description: 'Create a fault-tolerant design that survives spikes and outages.', tags: ['Failover', 'Safety', 'Reliability'], progress: 0 },
        { id: 'cloud-engineer-lab-3', title: 'Lab 3', subtitle: 'Cost optimization', duration: '22 min', difficulty: 'Advanced', description: 'Reduce costs without sacrificing performance or security.', tags: ['Cost', 'Automation', 'Optimization'], progress: 0 },
        { id: 'cloud-engineer-lab-4', title: 'Lab 4', subtitle: 'Security baseline', duration: '26 min', difficulty: 'Advanced', description: 'Protect workloads with the right controls and segregation model.', tags: ['IAM', 'Security', 'Scaling'], progress: 0 },
      ],
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      icon: '⚙',
      description: 'Automate delivery, deployments and system reliability across modern environments.',
      accent: '#53b5ff',
      missions: [
        { id: 'devops-engineer-lab-1', title: 'Lab 1', subtitle: 'CI/CD pipeline', duration: '25 min', difficulty: 'Advanced', description: 'Create an automated pipeline for testing, deployment and observability.', tags: ['CI/CD', 'Automation', 'Monitoring'], progress: 0 },
        { id: 'devops-engineer-lab-2', title: 'Lab 2', subtitle: 'Container orchestration', duration: '30 min', difficulty: 'Advanced', description: 'Deploy services with consistency and recovery in distributed environments.', tags: ['Docker', 'Kubernetes', 'Ops'], progress: 0 },
        { id: 'devops-engineer-lab-3', title: 'Lab 3', subtitle: 'Incident response', duration: '28 min', difficulty: 'Advanced', description: 'Handle failures quickly using logs, rollback and monitoring strategies.', tags: ['Monitoring', 'Recovery', 'Alerting'], progress: 0 },
      ],
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer',
      icon: '</>',
      description: 'Build secure APIs, services and workflows that power business logic and data access.',
      accent: '#4bc0ff',
      missions: [
        { id: 'backend-developer-lab-1', title: 'Lab 1', subtitle: 'Reliable API', duration: '18 min', difficulty: 'Intermediate', description: 'Design backend services with data persistence, access control and resilience.', tags: ['API', 'Database', 'Security'], progress: 0 },
        { id: 'backend-developer-lab-2', title: 'Lab 2', subtitle: 'Auth & access', duration: '22 min', difficulty: 'Advanced', description: 'Protect sensitive endpoints and provide safe role-based access.', tags: ['Auth', 'Tokens', 'Access'], progress: 0 },
        { id: 'backend-developer-lab-3', title: 'Lab 3', subtitle: 'Scaling service', duration: '24 min', difficulty: 'Advanced', description: 'Improve performance and data flow under increased request volume.', tags: ['Performance', 'Queue', 'Scale'], progress: 0 },
      ],
    },
    {
      id: 'ux-researcher',
      title: 'UX Researcher',
      icon: '◎',
      description: 'Study user behavior to uncover pain points and improve product experience.',
      accent: '#ff7ac6',
      missions: [
        { id: 'ux-researcher-lab-1', title: 'Lab 1', subtitle: 'User insights', duration: '15 min', difficulty: 'Beginner', description: 'Identify friction points and turn them into actionable research leads.', tags: ['Research', 'Interviews', 'Insights'], progress: 0 },
        { id: 'ux-researcher-lab-2', title: 'Lab 2', subtitle: 'Usability testing', duration: '20 min', difficulty: 'Intermediate', description: 'Observe actual user behavior and discover blockers in product flow.', tags: ['Testing', 'UX', 'Behavior'], progress: 0 },
        { id: 'ux-researcher-lab-3', title: 'Lab 3', subtitle: 'Journey mapping', duration: '17 min', difficulty: 'Intermediate', description: 'Map the complete experience to spot friction and opportunity areas.', tags: ['Journey', 'UX', 'Analytics'], progress: 0 },
      ],
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      icon: '▣',
      description: 'Turn priorities into roadmaps, measurable goals and customer-centered product decisions.',
      accent: '#8f82ff',
      missions: [
        { id: 'product-manager-lab-1', title: 'Lab 1', subtitle: 'Product strategy', duration: '20 min', difficulty: 'Intermediate', description: 'Prioritize opportunities and define scope around user impact and business value.', tags: ['Roadmap', 'Strategy', 'Metrics'], progress: 0 },
        { id: 'product-manager-lab-2', title: 'Lab 2', subtitle: 'Prioritization', duration: '18 min', difficulty: 'Intermediate', description: 'Choose the next features using impact, effort and business goals.', tags: ['Prioritization', 'ROI', 'Planning'], progress: 0 },
        { id: 'product-manager-lab-3', title: 'Lab 3', subtitle: 'Feature validation', duration: '21 min', difficulty: 'Advanced', description: 'Validate whether the product decision solves the right problem.', tags: ['Validation', 'Feedback', 'Growth'], progress: 0 },
      ],
    },
    {
      id: 'data-analyst',
      title: 'Data Analyst',
      icon: '▤',
      description: 'Analyze trends, uncover meaning and help teams translate numbers into decisions.',
      accent: '#ffb454',
      missions: [
        { id: 'data-analyst-lab-1', title: 'Lab 1', subtitle: 'KPI dashboard', duration: '17 min', difficulty: 'Intermediate', description: 'Transform raw data into insights, dashboards and focused recommendations.', tags: ['Analytics', 'SQL', 'Dashboards'], progress: 0 },
        { id: 'data-analyst-lab-2', title: 'Lab 2', subtitle: 'Trend analysis', duration: '19 min', difficulty: 'Intermediate', description: 'Measure user or business movement over time and explain the drivers.', tags: ['Trends', 'Metrics', 'Forecast'], progress: 0 },
        { id: 'data-analyst-lab-3', title: 'Lab 3', subtitle: 'Insight report', duration: '23 min', difficulty: 'Advanced', description: 'Summarize findings into a decision-ready recommendation package.', tags: ['Report', 'Insights', 'Decision'], progress: 0 },
      ],
    },
    {
      id: 'cybersecurity-analyst',
      title: 'Cybersecurity Analyst',
      icon: '🛡',
      description: 'Monitor risks, protect systems and strengthen digital defenses against threats.',
      accent: '#59d4a9',
      missions: [
        { id: 'cybersecurity-analyst-lab-1', title: 'Lab 1', subtitle: 'Threat protection', duration: '22 min', difficulty: 'Advanced', description: 'Evaluate attack vectors and choose the right defense controls for the environment.', tags: ['Security', 'IAM', 'Monitoring'], progress: 0 },
        { id: 'cybersecurity-analyst-lab-2', title: 'Lab 2', subtitle: 'Access control', duration: '20 min', difficulty: 'Advanced', description: 'Reduce exposure by structuring permission flows and identity controls.', tags: ['IAM', 'Access', 'Security'], progress: 0 },
        { id: 'cybersecurity-analyst-lab-3', title: 'Lab 3', subtitle: 'Detection setup', duration: '24 min', difficulty: 'Advanced', description: 'Build detection strategies and alerts to catch suspicious activity early.', tags: ['Alerting', 'SIEM', 'Monitoring'], progress: 0 },
      ],
    },
    {
      id: 'ai-engineer',
      title: 'AI Engineer',
      icon: '✦',
      description: 'Build smart solutions with machine learning pipelines and model-driven experiences.',
      accent: '#7a6bff',
      missions: [
        { id: 'ai-engineer-lab-1', title: 'Lab 1', subtitle: 'Model workflow', duration: '25 min', difficulty: 'Advanced', description: 'Design an AI workflow that turns data into useful predictions and measurable value.', tags: ['AI', 'ML', 'Modeling'], progress: 0 },
        { id: 'ai-engineer-lab-2', title: 'Lab 2', subtitle: 'Prompt design', duration: '19 min', difficulty: 'Intermediate', description: 'Shape prompts and workflows that improve quality and consistency.', tags: ['Prompt', 'LLM', 'Evaluation'], progress: 0 },
        { id: 'ai-engineer-lab-3', title: 'Lab 3', subtitle: 'Monitoring model', duration: '21 min', difficulty: 'Advanced', description: 'Track drift, quality and reliability as the model is used in production.', tags: ['Monitoring', 'MLops', 'Quality'], progress: 0 },
      ],
    },
    {
      id: 'mobile-developer',
      title: 'Mobile Developer',
      icon: '▣',
      description: 'Design smooth mobile experiences with reliable interfaces and app performance.',
      accent: '#ff8a8a',
      missions: [
        { id: 'mobile-developer-lab-1', title: 'Lab 1', subtitle: 'Mobile app flow', duration: '18 min', difficulty: 'Intermediate', description: 'Create an intuitive app flow with prioritized features and a strong user journey.', tags: ['Mobile', 'UX', 'Performance'], progress: 0 },
        { id: 'mobile-developer-lab-2', title: 'Lab 2', subtitle: 'Offline support', duration: '20 min', difficulty: 'Advanced', description: 'Build a resilient app experience when the connection is weak or unavailable.', tags: ['Offline', 'Sync', 'UX'], progress: 0 },
        { id: 'mobile-developer-lab-3', title: 'Lab 3', subtitle: 'App performance', duration: '22 min', difficulty: 'Advanced', description: 'Fasten interaction and reduce loads while keeping the interface smooth.', tags: ['Performance', 'Optimization', 'UX'], progress: 0 },
      ],
    },
    {
      id: 'healthcare-analyst',
      title: 'Healthcare Analyst',
      icon: '✚',
      description: 'Analyze operational and clinical data to improve care quality and organizational decisions.',
      accent: '#64d5c6',
      missions: [
        { id: 'healthcare-analyst-lab-1', title: 'Lab 1', subtitle: 'Care outcome analysis', duration: '20 min', difficulty: 'Intermediate', description: 'Evaluate care performance indicators and identify where service quality can improve.', tags: ['Healthcare', 'Outcomes', 'Data'], progress: 0 },
        { id: 'healthcare-analyst-lab-2', title: 'Lab 2', subtitle: 'Patient flow', duration: '18 min', difficulty: 'Intermediate', description: 'Find operational delays and improve patient care coordination.', tags: ['Operations', 'Care', 'Process'], progress: 0 },
        { id: 'healthcare-analyst-lab-3', title: 'Lab 3', subtitle: 'Resource planning', duration: '24 min', difficulty: 'Advanced', description: 'Align workforce and equipment planning with care demand trends.', tags: ['Planning', 'Efficiency', 'Healthcare'], progress: 0 },
      ],
    },
    {
      id: 'graphic-designer',
      title: 'Graphic Designer',
      icon: '◍',
      description: 'Shape visual identity, layouts and creative systems that communicate with clarity.',
      accent: '#ff9ed1',
      missions: [
        { id: 'graphic-designer-lab-1', title: 'Lab 1', subtitle: 'Brand design', duration: '16 min', difficulty: 'Beginner', description: 'Build a visual concept around clarity, hierarchy and emotional response.', tags: ['Design', 'Brand', 'Creative'], progress: 0 },
        { id: 'graphic-designer-lab-2', title: 'Lab 2', subtitle: 'Visual hierarchy', duration: '18 min', difficulty: 'Intermediate', description: 'Structure content so the viewer understands what matters first.', tags: ['Layout', 'Typography', 'Hierarchy'], progress: 0 },
        { id: 'graphic-designer-lab-3', title: 'Lab 3', subtitle: 'Campaign concept', duration: '20 min', difficulty: 'Intermediate', description: 'Design a polished storytelling concept with a consistent creative direction.', tags: ['Campaign', 'Branding', 'Art'], progress: 0 },
      ],
    },
    {
      id: 'business-analyst',
      title: 'Business Analyst',
      icon: '◫',
      description: 'Bridge business needs and technical execution with analysis, process thinking and prioritization.',
      accent: '#77c2ff',
      missions: [
        { id: 'business-analyst-lab-1', title: 'Lab 1', subtitle: 'Process optimization', duration: '22 min', difficulty: 'Intermediate', description: 'Map business needs, spot bottlenecks and propose a value-driven improvement plan.', tags: ['Process', 'Analysis', 'Strategy'], progress: 0 },
        { id: 'business-analyst-lab-2', title: 'Lab 2', subtitle: 'Requirements mapping', duration: '19 min', difficulty: 'Intermediate', description: 'Translate stakeholder needs into rules, priorities and deliverables.', tags: ['Requirements', 'Mapping', 'Scope'], progress: 0 },
        { id: 'business-analyst-lab-3', title: 'Lab 3', subtitle: 'Decision support', duration: '23 min', difficulty: 'Advanced', description: 'Support strategy decisions with a clear evidence and impact model.', tags: ['Decision', 'KPIs', 'Insights'], progress: 0 },
      ],
    },
  ];

  get selectedCareer(): CareerLabItem {
    return this.careers.find((career) => career.id === this.selectedCareerId) ?? this.careers[0];
  }

  get filteredCareers(): CareerLabItem[] {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      return this.careers;
    }

    return this.careers.filter((career) =>
      career.title.toLowerCase().includes(q) ||
      career.description.toLowerCase().includes(q) ||
      career.missions.some((mission) =>
        mission.title.toLowerCase().includes(q) ||
        mission.subtitle.toLowerCase().includes(q) ||
        mission.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    );
  }

  get totalMissions(): number {
    return this.careers.reduce((total, career) => total + career.missions.length, 0);
  }

  constructor(private router: Router, private authService: AuthService) {}

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

  selectCareer(careerId: string): void {
    this.selectedCareerId = careerId;
  }

  startMission(careerId: string, missionId: string): void {
    this.router.navigate(['/dashboard/simulation'], {
      queryParams: {
        career: careerId,
        mission: missionId,
      },
    });
  }
}
