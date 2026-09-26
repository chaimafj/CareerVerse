import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  template: `
    <div class="careerverse-shell">
      <aside class="sidebar">
        <div class="brand-block">
          <div class="brand-mark">
            <span class="brand-core"></span>
          </div>
          <div class="brand-text">CareerVerse</div>
        </div>

        <nav class="nav-list" aria-label="Main navigation">
          <button class="nav-item active" type="button" routerLink="/dashboard/overview">
            <span class="nav-icon">⌂</span>
            <span>Home</span>
            <span class="nav-arrow">›</span>
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
          <button class="nav-item" type="button">
            <span class="nav-icon">✦</span>
            <span>Learning Path</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-footer-card">
            <div class="spark"></div>
            <div class="sidebar-footer-text">Your future starts with the right experience.</div>
          </div>
        </div>
      </aside>

      <div class="workspace" [class.scrolled]="isScrolled">
        <header class="appbar" [class.scrolled]="isScrolled">
          <div class="appbar-logo">CareerVerse</div>

          <label class="search-box" aria-label="Search bar">
            <span class="search-icon">⌕</span>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search for careers, labs, or skills..." />
          </label>

          <div class="appbar-actions">
            <button class="notify-button" type="button" aria-label="Notifications">
              <span class="bell-icon">◔</span>
              <span class="notification-dot"></span>
            </button>

            <div class="user-menu-wrap">
              <button class="user-badge" type="button" (click)="toggleProfileMenu()" aria-label="Profile menu">
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

              <div class="profile-dropdown" *ngIf="isProfileMenuOpen">
                <button type="button" class="dropdown-item" (click)="openSettings()">
                  <span>⚙</span>
                  <span>Settings</span>
                </button>
                <button type="button" class="dropdown-item danger" (click)="logout()">
                  <span>↩</span>
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main class="content-area">
          <section class="hero-panel">
            <div class="hero-copy">
              <p class="eyebrow">Hello, {{ currentUserName }} <span class="wave">👋</span></p>
              <h1>
                Discover your future career<br />
                through <span class="gradient-text">real</span> experience
              </h1>
              <p class="hero-text">
                Explore different career paths, complete immersive career labs,
                get AI-powered insights and find the path that truly fits you.
              </p>

              <div class="hero-actions">
                <button class="primary-btn" type="button">Start Exploring <span aria-hidden="true">→</span></button>
                <button class="secondary-btn" type="button"><span class="play-icon">▶</span> Watch Video</button>
              </div>
            </div>

            <div class="hero-visual" aria-hidden="true">
              <div class="city-glow"></div>
              <div class="floating-card cloud-card">
                <div class="mini-icon">☁</div>
                <span>Cloud</span>
              </div>
              <div class="floating-card cyber-card">
                <div class="mini-icon">◈</div>
                <span>Cybersecurity</span>
              </div>
              <div class="floating-card devops-card">
                <div class="mini-icon">⚙</div>
                <span>DevOps</span>
              </div>
              <div class="floating-card backend-card">
                <div class="mini-icon">&lt;/&gt;</div>
                <span>Backend</span>
              </div>
              <div class="figure-silhouette">
                <div class="head"></div>
                <div class="body"></div>
              </div>
            </div>
          </section>

          <section id="discover" class="stat-grid">
            <article class="stat-card light-card">
              <div class="stat-header">
                <div class="stat-icon person">◔</div>
                <div class="stat-title">Your AI Profile</div>
              </div>

              <div class="stat-score-row">
                <div class="stat-score">78%</div>
                <div class="donut-ring">
                  <div class="donut-inner">78%</div>
                </div>
              </div>

              <p>See how your skills and interests match with different careers.</p>
              <button class="card-button" type="button">View Profile →</button>
            </article>

            <article class="stat-card green-card">
              <div class="stat-header">
                <div class="stat-icon labs">🧪</div>
                <div class="stat-title">Career Labs</div>
              </div>

              <div class="stat-score-row compact-row">
                <div class="stat-score mini">3/4</div>
                <div class="label-complete">Completed</div>
              </div>

              <p>Match code hands-on simulations and gain real-world experience.</p>
              <button class="card-button" type="button">Explore Labs →</button>
            </article>

            <article class="stat-card green-soft-card">
              <div class="stat-header">
                <div class="stat-icon spark">✦</div>
                <div class="stat-title">Top Recommendations</div>
              </div>

              <div class="stat-score-row compact-row">
                <div class="stat-score mini">4</div>
                <div class="label-complete">Matches</div>
              </div>

              <p>Careers that match your profile and performance.</p>
              <button class="card-button" type="button">View Recommendations →</button>
            </article>

            <article class="stat-card peach-card">
              <div class="stat-header">
                <div class="stat-icon chart">▣</div>
                <div class="stat-title">Your Progress</div>
              </div>

              <div class="stat-score-row compact-row">
                <div class="stat-score mini">73%</div>
                <div class="label-complete">Growth</div>
              </div>

              <p>Track your skills, performance and growth over time.</p>
              <button class="card-button" type="button">View Progress →</button>
            </article>
          </section>

          <section class="main-lower-grid">
            <div class="recommended-panel">
              <div class="section-head">
                <h2>Recommended Careers</h2>
                <button class="view-link" type="button">View all →</button>
              </div>

              <div class="cards-row">
                <article class="career-card">
                  <div class="career-art cloud-art">
                    <span class="art-symbol">☁</span>
                  </div>
                  <h3>Cloud Engineer</h3>
                  <p>Design, deploy and manage cloud infrastructure.</p>
                  <div class="match-pill">91% match</div>
                  <div class="tag-row">
                    <span>AWS</span>
                    <span>Linux</span>
                    <span>Docker</span>
                  </div>
                </article>

                <article class="career-card">
                  <div class="career-art devops-art">
                    <span class="art-symbol">⟲</span>
                  </div>
                  <h3>DevOps Engineer</h3>
                  <p>Automate, deploy and monitor applications.</p>
                  <div class="match-pill">87% match</div>
                  <div class="tag-row">
                    <span>Docker</span>
                    <span>Kubernetes</span>
                    <span>CI/CD</span>
                  </div>
                </article>

                <article class="career-card">
                  <div class="career-art backend-art">
                    <span class="art-symbol">&lt;/&gt;</span>
                  </div>
                  <h3>Backend Developer</h3>
                  <p>Build and maintain server-side applications.</p>
                  <div class="match-pill">72% match</div>
                  <div class="tag-row">
                    <span>Python</span>
                    <span>Djange</span>
                    <span>API</span>
                  </div>
                </article>
              </div>

              <div class="view-more-row">
                <button type="button" class="view-more-btn" (click)="goToCareerExplorer()">
                  View more
                </button>
              </div>
            </div>

            <aside class="learning-panel">
              <div class="section-head">
                <h2>Your Learning Path</h2>
                <button class="view-link" type="button">View full path →</button>
              </div>

              <ol class="learning-list">
                <li class="complete">
                  <span class="list-check">✓</span>
                  <div class="item-copy">
                    <span>1. Complete your profile</span>
                    <small>You’ve finished your profile. Great job!</small>
                  </div>
                  <time>Apr 12, 2025</time>
                </li>
                <li class="active">
                  <span class="list-check">2</span>
                  <div class="item-copy">
                    <span>2. Explore career labs</span>
                    <small>Start with 3 recommended labs.</small>
                  </div>
                  <button class="start-btn" type="button">Start Now →</button>
                </li>
                <li>
                  <span class="list-check">3</span>
                  <div class="item-copy">
                    <span>3. Analyze your results</span>
                    <small>Get AI insights and recommendations.</small>
                  </div>
                  <time>Apr 15, 2025</time>
                </li>
                <li>
                  <span class="list-check">4</span>
                  <div class="item-copy">
                    <span>4. Follow your learning path</span>
                    <small>Fill the skill gaps and grow your career.</small>
                  </div>
                  <time>May 02, 2025</time>
                </li>
              </ol>
            </aside>
          </section>

          <section class="activity-panel">
            <div class="section-head">
              <h2>Latest Activity</h2>
              <button class="view-link" type="button">View all →</button>
            </div>

            <div class="activity-grid">
              <article class="activity-item">
                <div class="activity-icon cloud-mini">☁</div>
                <div class="activity-copy">
                  <strong>You completed the Cloud Lab</strong>
                </div>
                <span class="activity-time">2 hours ago</span>
              </article>

              <article class="activity-item">
                <div class="activity-icon profile-mini">✦</div>
                <div class="activity-copy">
                  <strong>Your AI profile has been updated</strong>
                </div>
                <span class="activity-time">5 hours ago</span>
              </article>

              <article class="activity-item">
                <div class="activity-icon badge-mini">◔</div>
                <div class="activity-copy">
                  <strong>You earned a new skill: Docker</strong>
                </div>
                <span class="activity-time">1 day ago</span>
              </article>
            </div>
          </section>
        </main>

        <footer class="home-footer">
          <div class="footer-copyright">© 2026 CareerVerse. All rights reserved.</div>

          <div class="footer-links-row">
            <a href="javascript:void(0)">About Us</a>
            <a href="javascript:void(0)">Our Services</a>
            <a href="javascript:void(0)">Privacy Policy</a>
            <a href="javascript:void(0)">Terms &amp; Conditions</a>
            <a href="javascript:void(0)">Support</a>
          </div>

          <div class="social-row" aria-label="Social links">
            <button type="button" class="social-btn" aria-label="X">𝕏</button>
            <button type="button" class="social-btn" aria-label="Facebook">f</button>
            <button type="button" class="social-btn" aria-label="Instagram">◎</button>
          </div>
        </footer>

        <button class="scroll-top-button" type="button" aria-label="Scroll to top" (click)="scrollToTop()">
          ↑
        </button>
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
        scroll-behavior: smooth;
      }

      * { box-sizing: border-box; }

      button {
        font: inherit;
      }

      .careerverse-shell {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        min-height: 100vh;
        background: linear-gradient(90deg, #0b214f 0%, #0b214f 260px, #f3f6fb 260px, #f3f6fb 100%);
      }

      .sidebar {
        background: linear-gradient(180deg, #0b214f 0%, #081d43 100%);
        padding: 20px 16px 18px;
        color: #e8f0ff;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(123, 143, 190, 0.18);
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 8px 8px 18px;
        margin-bottom: 8px;
      }

      .brand-mark {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        background: linear-gradient(135deg, #2fe8ff 0%, #6a62f7 35%, #d77dff 100%);
        position: relative;
        box-shadow: 0 0 18px rgba(90, 130, 255, 0.6);
      }

      .brand-core {
        position: absolute;
        inset: 8px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        box-shadow: inset 0 0 0 2px rgba(255,255,255,0.5);
      }

      .brand-text {
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.06em;
      }

      .nav-list {
        display: grid;
        gap: 10px;
        margin-top: 12px;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        border: 0;
        background: transparent;
        color: #dfe8ff;
        border-radius: 12px;
        padding: 12px 14px;
        font-weight: 600;
        text-align: left;
        cursor: pointer;
      }

      .nav-item.active {
        background: linear-gradient(90deg, rgba(75, 110, 255, 0.5), rgba(61, 88, 171, 0.3));
        color: #fff;
        box-shadow: inset 0 0 0 1px rgba(117, 149, 255, 0.35);
      }

      .nav-icon {
        width: 24px;
        display: inline-flex;
        justify-content: center;
        font-size: 1.15rem;
        opacity: 0.9;
      }

      .nav-item span:nth-child(2) {
        flex: 1;
      }

      .nav-arrow {
        font-size: 1.2rem;
        color: rgba(255,255,255,0.7);
        margin-left: auto;
      }

      .sidebar-footer {
        margin-top: auto;
        padding: 14px 8px 0;
      }

      .sidebar-footer-card {
        background: linear-gradient(180deg, rgba(17,32,75,0.95), rgba(22,38,82,0.9));
        border: 1px solid rgba(116, 146, 255, 0.25);
        border-radius: 18px;
        padding: 14px 14px 18px;
        position: relative;
        overflow: hidden;
      }

      .spark {
        position: absolute;
        right: 18px;
        top: 12px;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(123,198,255,0.7), rgba(123,198,255,0.04) 70%);
        box-shadow: 0 0 20px rgba(130, 204, 255, 0.55);
      }

      .sidebar-footer-text {
        width: 70%;
        color: #cfe0ff;
        font-size: 1.1rem;
        font-weight: 700;
        line-height: 1.4;
        letter-spacing: -0.04em;
      }

      .workspace {
        min-height: 100vh;
        height: 100vh;
        padding: 0 26px 30px;
        background: linear-gradient(180deg, #f4f7fd 0%, #edf2fb 100%);
        overflow-y: auto;
        scroll-behavior: smooth;
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
        transition: all 0.25s ease;
      }

      .workspace.scrolled .appbar,
      .appbar.scrolled {
        background: linear-gradient(135deg, #cfe3f8 0%, #a7c7ea 100%);
        box-shadow: 0 14px 30px rgba(96, 126, 168, 0.2);
        border-color: rgba(130, 161, 198, 0.9);
      }

      .appbar-logo {
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.06em;
        color: #1d2f5c;
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(141, 164, 198, 0.4);
        border-radius: 16px;
        padding: 12px 18px;
        color: #5c718d;
        font-size: 1rem;
        height: 58px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
        min-width: 0;
      }

      .search-box input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        color: #2a3d5f;
        font-size: 1rem;
      }

      .search-box input::placeholder {
        color: #6a7f9d;
      }

      .search-icon {
        font-size: 1.3rem;
        opacity: 0.8;
      }

      .appbar-actions {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .notify-button {
        position: relative;
        width: 42px;
        height: 42px;
        border-radius: 12px;
        border: 1px solid rgba(127, 151, 184, 0.4);
        background: rgba(255,255,255,0.28);
        color: #39537d;
        font-size: 1.2rem;
        box-shadow: 0 6px 14px rgba(120, 143, 177, 0.1);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .bell-icon {
        transform: translateY(-1px);
      }

      .notification-dot {
        position: absolute;
        right: 9px;
        top: 8px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #ff5c7a;
        border: 2px solid #f8fbff;
      }

      .user-menu-wrap {
        position: relative;
      }

      .user-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255,255,255,0.55);
        border: 1px solid rgba(130, 143, 181, 0.12);
        border-radius: 999px;
        padding: 5px 10px 5px 6px;
        cursor: pointer;
      }

      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffbca5 0%, #8d7ef7 100%);
        color: #fff;
        display: grid;
        place-items: center;
        font-weight: 700;
        overflow: hidden;
      }

      .user-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .user-meta {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }

      .user-name {
        color: #212f50;
        font-size: 0.9rem;
        font-weight: 700;
      }

      .user-meta small {
        color: #687998;
      }

      .user-chevron {
        color: #55688c;
        font-size: 1.1rem;
      }

      .profile-dropdown {
        position: absolute;
        right: 0;
        top: calc(100% + 10px);
        display: grid;
        min-width: 170px;
        background: rgba(255,255,255,0.96);
        border: 1px solid rgba(146, 157, 185, 0.2);
        border-radius: 16px;
        box-shadow: 0 18px 38px rgba(82, 96, 133, 0.18);
        padding: 8px;
        z-index: 20;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border: 0;
        background: transparent;
        border-radius: 10px;
        color: #1d2d56;
        font-weight: 600;
        cursor: pointer;
        text-align: left;
      }

      .dropdown-item:hover {
        background: rgba(146, 168, 255, 0.08);
      }

      .dropdown-item.danger {
        color: #d94d5f;
      }

      .content-area {
        display: grid;
        gap: 22px;
        padding-bottom: 12px;
      }

      @keyframes floatPanel {
        0%, 100% {
          transform: translateY(0px);
          box-shadow: 0 18px 30px rgba(33, 60, 109, 0.12);
        }
        50% {
          transform: translateY(-6px);
          box-shadow: 0 24px 40px rgba(39, 66, 120, 0.18);
        }
      }

      @keyframes pulseGlow {
        0%, 100% {
          opacity: 0.72;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.08);
        }
      }

      .home-footer {
        position: relative;
        margin-top: 12px;
        background: #dfeaf3;
        border-top: 1px solid rgba(26, 53, 93, 0.08);
        color: #1d2d56;
        padding: 24px 34px 18px;
        min-height: 170px;
      }

      .footer-copyright {
        text-align: center;
        color: rgba(29, 45, 86, 0.9);
        font-size: 1.02rem;
        margin-bottom: 28px;
        font-weight: 500;
      }

      .footer-links-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 32px;
        flex-wrap: wrap;
        margin-bottom: 18px;
      }

      .footer-links-row a {
        color: #1d2d56;
        text-decoration: none;
        font-size: 1.05rem;
        font-weight: 500;
      }

      .social-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 16px;
        margin-top: 10px;
      }

      .social-btn {
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: #1d2d56;
        font-size: 1.7rem;
        font-weight: 700;
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .scroll-top-button {
        position: fixed;
        right: 24px;
        bottom: 28px;
        width: 52px;
        height: 52px;
        border: 0;
        border-radius: 16px;
        background: linear-gradient(135deg, #ffbca5 0%, #8d7ef7 100%);
        color: #fff;
        font-size: 1.7rem;
        font-weight: 700;
        box-shadow: 0 16px 28px rgba(125, 110, 243, 0.35);
        cursor: pointer;
        z-index: 100;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .scroll-top-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 32px rgba(125, 110, 243, 0.42);
      }

      .hero-panel {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 410px;
        padding: 36px 34px 20px;
        border-radius: 30px;
        border: 1px solid rgba(97, 125, 204, 0.2);
        background:
          radial-gradient(circle at 15% 20%, rgba(97, 120, 255, 0.28), transparent 20%),
          radial-gradient(circle at 75% 25%, rgba(82, 160, 255, 0.2), transparent 25%),
          linear-gradient(135deg, #0b1e58 0%, #182d73 26%, #1d2d74 52%, #111e58 100%);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 48px rgba(6, 16, 42, 0.4);
      }

      .hero-panel::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(15,27,66,0.15), rgba(97,170,255,0.05), rgba(255,255,255,0));
        pointer-events: none;
      }

      .hero-copy,
      .hero-visual {
        position: relative;
        z-index: 1;
      }

      .hero-copy {
        max-width: 760px;
        color: #eaf4ff;
      }

      .eyebrow {
        margin: 0 0 18px;
        color: #f8fbff;
        font-size: 1.02rem;
        font-weight: 500;
        letter-spacing: 0.01em;
      }

      .wave {
        display: inline-block;
        transform: translateY(-2px);
      }

      h1 {
        margin: 0;
        font-size: clamp(2.6rem, 3.5vw, 5rem);
        line-height: 0.96;
        letter-spacing: -0.06em;
        font-weight: 900;
        color: #f5f9ff;
      }

      .gradient-text {
        background: linear-gradient(90deg, #8bc4ff 0%, #58d6ff 30%, #a877ff 70%, #ec6df7 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .hero-text {
        margin: 22px 0 0;
        max-width: 700px;
        color: rgba(226, 237, 255, 0.9);
        font-size: clamp(1.12rem, 1.5vw, 1.6rem);
        line-height: 1.5;
        font-weight: 400;
      }

      .hero-actions {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-top: 28px;
        flex-wrap: wrap;
      }

      .primary-btn,
      .secondary-btn,
      .card-button,
      .start-btn,
      .view-link {
        border: 0;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .primary-btn:hover,
      .secondary-btn:hover,
      .card-button:hover,
      .view-link:hover,
      .start-btn:hover {
        transform: translateY(-1px);
      }

      .primary-btn {
        background: linear-gradient(135deg, #4e63ff 0%, #6d5af6 48%, #7b79ff 100%);
        color: #fff;
        border-radius: 18px;
        padding: 16px 28px;
        font-size: 1.05rem;
        font-weight: 700;
        box-shadow: 0 16px 30px rgba(90, 101, 255, 0.45);
        border: 1px solid rgba(160, 186, 255, 0.4);
      }

      .secondary-btn {
        background: rgba(255,255,255,0.04);
        color: #edf6ff;
        border: 1px solid rgba(179, 202, 255, 0.45);
        border-radius: 18px;
        padding: 15px 24px;
        font-size: 1.05rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }

      .play-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        font-size: 0.76rem;
      }

      .hero-visual {
        position: relative;
        width: 520px;
        min-width: 330px;
        height: 330px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .city-glow {
        position: absolute;
        inset: 14% 12% 8% 12%;
        border-radius: 30px;
        background: linear-gradient(180deg, rgba(91, 121, 255, 0.18), rgba(20, 31, 60, 0));
        filter: blur(18px);
      }

      .figure-silhouette {
        position: absolute;
        bottom: 16px;
        left: 50%;
        width: 130px;
        height: 220px;
        transform: translateX(-50%);
      }

      .figure-silhouette .head {
        position: absolute;
        left: 50%;
        top: 0;
        width: 42px;
        height: 42px;
        transform: translateX(-50%);
        border-radius: 50%;
        background: linear-gradient(180deg, rgba(74, 92, 172, 0.9), rgba(22, 25, 52, 0.95));
        box-shadow: 0 0 18px rgba(117, 170, 255, 0.4);
      }

      .figure-silhouette .body {
        position: absolute;
        left: 50%;
        top: 40px;
        width: 110px;
        height: 170px;
        transform: translateX(-50%);
        border-radius: 26px 26px 18px 18px;
        background: linear-gradient(180deg, rgba(23, 28, 63, 0.95), rgba(16, 18, 41, 0.96));
        box-shadow: 0 0 20px rgba(78, 103, 214, 0.54);
      }

      .floating-card {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 135px;
        padding: 15px 18px;
        border-radius: 22px;
        background: linear-gradient(180deg, rgba(91, 120, 255, 0.28), rgba(26, 37, 72, 0.48));
        border: 1px solid rgba(160, 213, 255, 0.45);
        box-shadow: 0 0 18px rgba(96, 164, 255, 0.25), inset 0 0 0 1px rgba(255,255,255,0.08);
        color: #ebf4ff;
        backdrop-filter: blur(6px);
      }

      .floating-card span {
        font-weight: 700;
        font-size: 1.05rem;
      }

      .mini-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 10px;
        font-size: 1.2rem;
        color: #ffffff;
        background: rgba(255,255,255,0.08);
      }

      .cloud-card {
        top: 24px;
        left: 58px;
        transform: rotate(-8deg);
      }

      .cyber-card {
        top: 18px;
        right: 54px;
        background: linear-gradient(180deg, rgba(27, 199, 186, 0.25), rgba(23, 62, 78, 0.52));
        border-color: rgba(98, 255, 204, 0.5);
      }

      .devops-card {
        left: 20px;
        bottom: 68px;
        background: linear-gradient(180deg, rgba(179, 104, 255, 0.25), rgba(58, 35, 88, 0.5));
        border-color: rgba(219, 141, 255, 0.5);
      }

      .backend-card {
        right: 30px;
        bottom: 30px;
        background: linear-gradient(180deg, rgba(255, 103, 193, 0.25), rgba(82, 32, 74, 0.52));
        border-color: rgba(255, 118, 208, 0.48);
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 18px;
        align-items: stretch;
      }

      .stat-card {
        position: relative;
        border: 1px solid rgba(144, 148, 171, 0.15);
        border-radius: 24px;
        padding: 18px 18px 16px;
        background: rgba(255,255,255,0.72);
        box-shadow: 0 18px 30px rgba(94, 109, 151, 0.08);
        min-height: 250px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
      }

      .stat-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.32), transparent 55%);
        pointer-events: none;
      }

      .stat-card:hover {
        transform: translateY(-6px) scale(1.01);
        box-shadow: 0 22px 34px rgba(94, 109, 151, 0.12);
        border-color: rgba(123, 138, 196, 0.2);
      }

      .light-card {
        background: linear-gradient(180deg, rgba(232, 232, 255, 0.9), rgba(230, 241, 255, 0.86));
      }
      .green-card {
        background: linear-gradient(180deg, rgba(224, 246, 255, 0.9), rgba(235, 241, 255, 0.86));
      }
      .green-soft-card {
        background: linear-gradient(180deg, rgba(241, 232, 255, 0.9), rgba(239, 248, 255, 0.86));
      }
      .peach-card {
        background: linear-gradient(180deg, rgba(255, 234, 247, 0.9), rgba(255, 242, 248, 0.86));
      }

      .stat-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
        position: relative;
        z-index: 1;
      }

      .stat-icon {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: rgba(76, 111, 255, 0.12);
        color: #2a4fd2;
        font-size: 1.05rem;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
      }

      .light-card .stat-icon { background: rgba(133, 118, 255, 0.12); color: #5046d6; }
      .green-card .stat-icon { background: rgba(93, 175, 255, 0.12); color: #2d6dd2; }
      .green-soft-card .stat-icon { background: rgba(177, 125, 255, 0.12); color: #6d4dc7; }
      .peach-card .stat-icon { background: rgba(255, 146, 214, 0.12); color: #c6549f; }

      .stat-title {
        font-size: 1.05rem;
        font-weight: 800;
        color: #1d2b4f;
        letter-spacing: -0.04em;
      }

      .stat-score-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 14px;
        position: relative;
        z-index: 1;
      }

      .stat-score {
        font-size: 2.2rem;
        font-weight: 900;
        color: #172d58;
        letter-spacing: -0.08em;
      }

      .compact-row {
        justify-content: flex-start;
        gap: 10px;
      }

      .stat-score.mini {
        font-size: 1.8rem;
      }

      .donut-ring {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        position: relative;
        background: conic-gradient(#6d63ff 0 78%, rgba(109, 99, 255, 0.14) 78% 100%);
        display: grid;
        place-items: center;
        box-shadow: inset 0 0 0 8px rgba(255,255,255,0.14);
        animation: gentleSpin 8s linear infinite;
      }

      .donut-inner {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255,255,255,0.74);
        display: grid;
        place-items: center;
        font-size: 0.8rem;
        font-weight: 800;
        color: #1c2e58;
      }

      .label-complete {
        font-size: 0.78rem;
        font-weight: 800;
        color: #4c5d89;
        letter-spacing: 0.02em;
      }

      .stat-card p {
        margin: 0 0 18px;
        color: #53647f;
        line-height: 1.55;
        font-size: 0.96rem;
        position: relative;
        z-index: 1;
      }

      .card-button {
        margin-top: auto;
        background: linear-gradient(135deg, rgba(120, 112, 255, 0.12), rgba(96, 182, 255, 0.1), rgba(255, 146, 210, 0.1));
        color: #2f3f9b;
        border: 1px solid rgba(136, 150, 188, 0.18);
        border-radius: 14px;
        padding: 12px 14px;
        font-weight: 800;
        position: relative;
        z-index: 1;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        cursor: pointer;
      }

      .card-button:hover {
        transform: translateY(-1px);
        border-color: rgba(120, 131, 188, 0.24);
        box-shadow: 0 10px 18px rgba(116, 126, 174, 0.12);
      }

      @keyframes gentleSpin {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(6deg); }
        100% { transform: rotate(0deg); }
      }

      .main-lower-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.75fr);
        gap: 18px;
      }

      .recommended-panel,
      .learning-panel,
      .activity-panel {
        background: rgba(255,255,255,0.7);
        border: 1px solid rgba(144, 148, 171, 0.15);
        border-radius: 22px;
        padding: 18px 18px 16px;
        box-shadow: 0 12px 22px rgba(103, 113, 150, 0.05);
      }

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }

      .section-head h2 {
        margin: 0;
        font-size: 1.8rem;
        line-height: 1.1;
        letter-spacing: -0.05em;
        color: #172a4f;
      }

      .view-link {
        background: transparent;
        color: #1d2d56;
        font-weight: 700;
        padding: 0;
      }

      .cards-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      .view-more-row {
        display: flex;
        justify-content: center;
        margin-top: 18px;
      }

      .view-more-btn {
        border: 2px solid rgba(120, 115, 255, 0.8);
        background: linear-gradient(135deg, rgba(120, 112, 255, 0.08), rgba(255, 146, 214, 0.08));
        color: #2a3a88;
        border-radius: 999px;
        padding: 12px 20px;
        font-size: 1.05rem;
        font-weight: 700;
        min-width: 160px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .view-more-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 18px rgba(89, 122, 185, 0.12);
      }

      .career-card {
        background: linear-gradient(180deg, rgba(255,255,255,0.64), rgba(245, 247, 255, 0.8));
        border: 1px solid rgba(136, 150, 188, 0.15);
        border-radius: 22px;
        padding: 16px 16px 14px;
      }

      .career-art {
        display: grid;
        place-items: center;
        width: 100%;
        height: 118px;
        border-radius: 18px;
        margin-bottom: 16px;
        background: linear-gradient(135deg, rgba(85, 106, 255, 0.18), rgba(250, 146, 214, 0.12), rgba(96, 177, 255, 0.18));
      }

      .cloud-art { background: linear-gradient(135deg, rgba(115, 127, 255, 0.2), rgba(95, 182, 255, 0.2), rgba(255, 146, 214, 0.18)); }
      .devops-art { background: linear-gradient(135deg, rgba(117, 138, 255, 0.18), rgba(80, 199, 255, 0.2), rgba(178, 120, 255, 0.18)); }
      .backend-art { background: linear-gradient(135deg, rgba(120, 117, 255, 0.18), rgba(132, 197, 255, 0.18), rgba(255, 177, 216, 0.18)); }

      .art-symbol {
        font-size: 3rem;
        font-weight: 800;
        color: #1a2e59;
      }

      .career-card h3 {
        margin: 0 0 8px;
        font-size: 1.15rem;
        letter-spacing: -0.04em;
        color: #1d2d56;
      }

      .career-card p {
        margin: 0 0 14px;
        color: #586a8c;
        line-height: 1.5;
        min-height: 44px;
      }

      .match-pill {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        border-radius: 999px;
        padding: 0 10px;
        background: linear-gradient(90deg, rgba(126, 117, 255, 0.14), rgba(255, 146, 214, 0.14), rgba(96, 182, 255, 0.12));
        color: #4e49c9;
        font-size: 0.78rem;
        font-weight: 800;
      }

      .tag-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 14px;
      }

      .tag-row span {
        display: inline-flex;
        align-items: center;
        min-height: 26px;
        padding: 0 9px;
        border-radius: 999px;
        background: linear-gradient(135deg, rgba(126, 117, 255, 0.09), rgba(96, 182, 255, 0.09), rgba(255, 146, 214, 0.08));
        color: #4258b6;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .learning-panel {
        background: rgba(242, 246, 255, 0.86);
      }

      .learning-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 12px;
      }

      .learning-list li {
        display: grid;
        grid-template-columns: 38px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        border-radius: 16px;
        padding: 12px 10px;
        background: rgba(255,255,255,0.36);
        color: #1b2d4f;
      }

      .learning-list li.active {
        background: rgba(92, 109, 255, 0.07);
      }

      .list-check {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(74, 109, 255, 0.12);
        color: #2e4ec2;
        font-weight: 800;
      }

      .complete .list-check {
        background: rgba(30, 193, 123, 0.12);
        color: #168b61;
      }

      .item-copy {
        display: grid;
        gap: 4px;
      }

      .item-copy span {
        font-weight: 700;
      }

      .item-copy small {
        color: #607195;
      }

      .learning-list time {
        color: #7b889f;
        font-size: 0.74rem;
        white-space: nowrap;
      }

      .start-btn {
        border-radius: 10px;
        background: linear-gradient(135deg, #586df6, #49b9ff);
        color: #fff;
        padding: 9px 14px;
        font-weight: 700;
      }

      .activity-panel {
        padding-bottom: 12px;
      }

      .activity-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(244, 247, 255, 0.7);
        border: 1px solid rgba(147, 159, 195, 0.12);
        border-radius: 18px;
        padding: 12px 14px;
      }

      .activity-icon {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-weight: 800;
      }

      .cloud-mini { background: rgba(67, 156, 255, 0.12); color: #1f82dd; }
      .profile-mini { background: rgba(149, 120, 255, 0.12); color: #6a55d9; }
      .badge-mini { background: rgba(255, 182, 131, 0.16); color: #c5733d; }

      .activity-copy {
        flex: 1;
        min-width: 0;
      }

      .activity-copy strong {
        display: block;
        color: #1d2d56;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .activity-time {
        color: #7584a0;
        font-size: 0.78rem;
        white-space: nowrap;
      }

      @media (max-width: 1180px) {
        .careerverse-shell {
          grid-template-columns: 220px 1fr;
        }

        .stat-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .main-lower-grid,
        .cards-row,
        .activity-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 900px) {
        .careerverse-shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          padding-bottom: 12px;
        }

        .workspace {
          padding: 16px;
        }

        .appbar {
          grid-template-columns: 1fr;
        }

        .hero-panel {
          flex-direction: column;
          align-items: flex-start;
          gap: 18px;
        }

        .hero-visual {
          width: 100%;
          max-width: 440px;
          margin-right: 0;
        }
      }
    `,
  ],
})
export class DashboardPage implements OnInit {
  isScrolled = false;
  isProfileMenuOpen = false;
  searchQuery = '';
  currentUserName = 'User';
  currentUserRole = 'Student';
  firstName = 'User';
  userInitials = 'U';
  userAvatar = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const profile = this.authService.getProfile();

    const firstName = user?.first_name || profile?.fullName?.split(' ')[0] || 'User';
    const lastName = user?.last_name || profile?.fullName?.split(' ').slice(1).join(' ') || '';
    const fullName = profile?.fullName || `${firstName} ${lastName}`.trim() || 'User';

    this.currentUserName = fullName || 'User';
    this.firstName = firstName || 'User';
    this.currentUserRole = user?.role || profile?.role || 'Student';
    this.userInitials = this.getInitials(firstName, lastName);
    this.userAvatar = profile?.avatar || '';
  }

  private getInitials(firstName: string, lastName: string): string {
    return `${(firstName || '').charAt(0) || 'U'}${(lastName || '').charAt(0) || ''}`.toUpperCase();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  openSettings(): void {
    this.isProfileMenuOpen = false;
    this.router.navigateByUrl('/dashboard/profile');
  }

  logout(): void {
    this.isProfileMenuOpen = false;
    this.router.navigateByUrl('/auth/login');
  }

  goToCareerExplorer(): void {
    this.router.navigateByUrl('/dashboard/career-explorer');
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop(): void {
    const workspace = document.querySelector('.workspace') as HTMLElement | null;

    if (workspace) {
      workspace.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const workspace = document.querySelector('.workspace') as HTMLElement | null;
    this.isScrolled = (workspace ? workspace.scrollTop : window.scrollY) > 20;
  }
}

