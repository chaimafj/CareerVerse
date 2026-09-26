import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-career-explorer-page',
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
          <button class="nav-item" type="button" routerLink="/dashboard/overview">
            <span class="nav-icon">⌂</span>
            <span>Home</span>
          </button>
          <button class="nav-item" type="button" routerLink="/dashboard/profile">
            <span class="nav-icon">◔</span>
            <span>My Profile</span>
          </button>
          <button class="nav-item active" type="button" routerLink="/dashboard/career-explorer">
            <span class="nav-icon">◌</span>
            <span>Career Explorer</span>
            <span class="nav-arrow">›</span>
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
            <div class="sidebar-footer-text">Explore opportunities built around your strengths.</div>
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
              <p class="eyebrow">Career Explorer</p>
              <h1>Discover careers that fit<br />your strengths and goals</h1>
              <p class="hero-text">
                Compare paths, explore roles, and find opportunities that match your interests, skills, and future goals.
              </p>

              <div class="hero-actions">
                <button class="primary-btn" type="button">Explore Matches</button>
                <button class="secondary-btn" type="button">Discover AI Insights</button>
              </div>
            </div>

            <div class="hero-visual" aria-hidden="true">
              <div class="orb orb-one"></div>
              <div class="orb orb-two"></div>
              <div class="pulse-card">
                <span>Top match</span>
                <strong>Cloud Engineer</strong>
                <small>91% fit</small>
              </div>
            </div>
          </section>

          <section class="filter-bar">
            <button
              *ngFor="let category of categoryOptions"
              type="button"
              class="filter-chip"
              [class.active]="selectedCategory === category"
              (click)="selectCategory(category)"
            >
              {{ category }}
            </button>
          </section>

          <section class="career-grid">
            <article
              *ngFor="let career of visibleCareerCards"
              class="career-card"
              [class.featured]="career.featured"
            >
              <div class="career-header">
                <div class="career-icon" [ngClass]="career.iconClass">{{ career.icon }}</div>
                <span class="match-pill">{{ career.match }}% match</span>
              </div>
              <h3>{{ career.title }}</h3>
              <p>{{ career.description }}</p>
              <div class="tag-row">
                <span *ngFor="let tag of career.tags">{{ tag }}</span>
              </div>
              <button type="button" class="card-button" (click)="openCareer(career.slug)">View career →</button>
            </article>
          </section>

          <div class="view-more-row">
            <button type="button" class="view-more-btn" (click)="toggleCareerList()">
              {{ careerViewLevel === 2 ? 'View less' : 'View more' }}
            </button>
          </div>

          <section class="insight-panel">
            <div class="section-head">
              <h2>Career Insights</h2>
              <button class="view-link" type="button">View all →</button>
            </div>

            <div class="insight-grid">
              <article class="insight-box">
                <span class="mini-label">High demand</span>
                <strong>Cloud & DevOps roles</strong>
                <p>Strong future growth with increasing demand in AI infrastructure and operations.</p>
              </article>

              <article class="insight-box">
                <span class="mini-label">Best fit</span>
                <strong>Problem solving + teamwork</strong>
                <p>Your strengths align closely with systems, automation and collaborative delivery roles.</p>
              </article>

              <article class="insight-box">
                <span class="mini-label">Recommended next step</span>
                <strong>Take a Cloud Lab</strong>
                <p>Gain hands-on practice to confirm your match before committing to a long-term track.</p>
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
        align-items: flex-start;
        line-height: 1.1;
      }

      .user-name {
        font-size: 0.95rem;
        font-weight: 700;
        color: #1f2d50;
      }

      .user-meta small {
        color: #5a6c8f;
        font-size: 0.7rem;
      }

      .user-chevron {
        color: #3a496d;
        font-size: 1.2rem;
      }

      .profile-dropdown {
        position: absolute;
        right: 0;
        top: calc(100% + 12px);
        width: 180px;
        padding: 8px;
        border-radius: 16px;
        background: rgba(255,255,255,0.96);
        border: 1px solid rgba(140, 153, 185, 0.18);
        box-shadow: 0 18px 26px rgba(79, 92, 136, 0.12);
        display: grid;
        gap: 8px;
        z-index: 60;
      }

      .dropdown-item {
        border: 0;
        background: transparent;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 10px;
        padding: 10px 12px;
        color: #1e2f52;
        font-weight: 600;
        cursor: pointer;
      }

      .dropdown-item.danger {
        color: #d44a5a;
      }

      .content-area {
        display: grid;
        gap: 24px;
        padding-top: 12px;
      }

      .hero-panel {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        background: linear-gradient(135deg, rgba(223, 215, 255, 0.9), rgba(209, 233, 255, 0.86), rgba(255, 228, 244, 0.7));
        border: 1px solid rgba(170, 163, 255, 0.38);
        border-radius: 30px;
        padding: 34px 28px 28px;
        box-shadow: 0 15px 35px rgba(128, 110, 212, 0.08);
        position: relative;
        overflow: hidden;
      }

      .hero-panel::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top right, rgba(117, 176, 255, 0.12), transparent 34%);
        pointer-events: none;
      }

      .hero-copy {
        max-width: 660px;
        position: relative;
        z-index: 1;
      }

      .eyebrow {
        margin: 0 0 10px;
        font-size: 0.74rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #5b5ce6;
      }

      h1 {
        margin: 0;
        font-size: clamp(3rem, 4vw, 5rem);
        line-height: 0.96;
        letter-spacing: -0.08em;
        color: #131f3d;
      }

      .hero-text {
        margin: 16px 0 0;
        font-size: 1.1rem;
        line-height: 1.6;
        color: #45607d;
        max-width: 640px;
      }

      .hero-actions {
        display: flex;
        gap: 18px;
        margin-top: 28px;
        flex-wrap: wrap;
      }

      .primary-btn, .secondary-btn {
        border: 0;
        border-radius: 999px;
        padding: 1.05rem 1.8rem;
        font-weight: 800;
        font-size: 1.15rem;
        cursor: pointer;
        transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
      }

      .primary-btn {
        background: linear-gradient(135deg, #5d5ce7, #5ab3ff 48%, #ff8ed8);
        color: #fff;
        box-shadow: 0 14px 26px rgba(120, 104, 255, 0.24);
      }

      .secondary-btn {
        background: rgba(255,255,255,0.72);
        color: #2b3864;
        border: 1px solid rgba(146, 137, 255, 0.26);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
      }

      .primary-btn:hover, .secondary-btn:hover,
      .filter-chip:hover, .view-more-btn:hover, .card-button:hover {
        transform: translateY(-2px);
      }

      .hero-visual {
        position: relative;
        width: 350px;
        height: 240px;
        border-radius: 28px;
        background: linear-gradient(180deg, rgba(255,255,255,0.32), rgba(172, 214, 255, 0.12));
        border: 1px solid rgba(143, 170, 218, 0.22);
        overflow: hidden;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
        animation: floatCard 7s ease-in-out infinite;
      }

      .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(4px);
        animation: pulseGlow 5s ease-in-out infinite alternate;
      }

      .orb-one {
        width: 220px;
        height: 220px;
        background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(130, 188, 255, 0.7) 38%, rgba(130, 188, 255, 0.18) 68%, transparent 100%);
        right: -18px;
        top: 12px;
      }

      .orb-two {
        width: 160px;
        height: 160px;
        background: radial-gradient(circle at 30% 30%, rgba(133, 232, 255, 0.72), rgba(63, 133, 255, 0.18) 58%, transparent 100%);
        left: -18px;
        bottom: -26px;
      }

      .pulse-card {
        position: absolute;
        right: 32px;
        bottom: 24px;
        min-width: 180px;
        background: rgba(255,255,255,0.82);
        border: 1px solid rgba(128, 150, 211, 0.2);
        border-radius: 20px;
        padding: 18px 19px 16px;
        display: grid;
        gap: 4px;
        box-shadow: 0 16px 30px rgba(90, 111, 168, 0.12);
        backdrop-filter: blur(10px);
      }

      .pulse-card span {
        color: #5d7497;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 700;
      }

      .pulse-card strong {
        font-size: 1.25rem;
        color: #1a2d53;
        letter-spacing: -0.06em;
      }

      .pulse-card small {
        color: #3f5ecc;
        font-weight: 800;
        font-size: 0.9rem;
      }

      .filter-bar {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        padding-left: 2px;
      }

      .filter-chip {
        border: 1px solid rgba(126, 150, 200, 0.28);
        background: rgba(255,255,255,0.7);
        color: #49607d;
        border-radius: 999px;
        padding: 10px 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.22s ease;
      }

      .filter-chip.active {
        background: linear-gradient(135deg, #eef0ff, #e4f5ff, #ffe9f8);
        border-color: rgba(118, 107, 252, 0.5);
        color: #2f3c8a;
        box-shadow: 0 8px 16px rgba(129, 110, 255, 0.12);
      }

      .career-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;
      }

      .view-more-row {
        display: flex;
        justify-content: center;
        margin: 18px 0 12px;
      }

      .view-more-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 170px;
        padding: 14px 26px;
        border: 2px solid rgba(82, 116, 204, 0.82);
        background: rgba(255, 255, 255, 0.35);
        color: #1a2d59;
        border-radius: 999px;
        font-size: 1.05rem;
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .view-more-btn:hover {
        box-shadow: 0 12px 22px rgba(92, 122, 180, 0.12);
      }

      .career-card {
        background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(251,253,255,0.95));
        border: 1px solid rgba(136, 156, 201, 0.18);
        border-radius: 24px;
        padding: 18px 18px 16px;
        box-shadow: 0 16px 28px rgba(96, 111, 150, 0.08);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        animation: fadeUp 0.5s ease both;
      }

      .career-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 22px 36px rgba(96, 111, 150, 0.12);
        border-color: rgba(88, 131, 255, 0.22);
      }

      .career-card.featured {
        border-color: rgba(88, 131, 255, 0.25);
        box-shadow: 0 18px 36px rgba(88, 131, 255, 0.12);
      }

      .career-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 16px;
      }

      .career-icon {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        font-weight: 800;
        color: #1a2f5f;
      }

      .career-icon.cloud { background: rgba(129, 191, 255, 0.18); }
      .career-icon.devops { background: rgba(133, 225, 194, 0.18); }
      .career-icon.backend { background: rgba(151, 126, 255, 0.16); }
      .career-icon.ux { background: rgba(255, 184, 120, 0.18); }
      .career-icon.pm { background: rgba(98, 173, 255, 0.16); }
      .career-icon.analytics { background: rgba(104, 210, 190, 0.18); }
      .career-icon.security { background: rgba(166, 136, 255, 0.16); }
      .career-icon.ai { background: rgba(255, 176, 130, 0.2); }
      .career-icon.mobile { background: rgba(126, 206, 255, 0.16); }
      .career-icon.health { background: rgba(148, 220, 186, 0.18); }
      .career-icon.design { background: rgba(255, 182, 149, 0.18); }
      .career-icon.business { background: rgba(181, 170, 255, 0.18); }

      .match-pill {
        background: linear-gradient(135deg, rgba(127, 119, 255, 0.12), rgba(255, 148, 216, 0.12));
        color: #4c49c6;
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .career-card h3 {
        margin: 0 0 10px;
        font-size: 1.4rem;
        letter-spacing: -0.05em;
      }

      .career-card p {
        margin: 0 0 14px;
        color: #5b6f90;
        line-height: 1.7;
      }

      .tag-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }

      .tag-row span {
        background: rgba(111, 127, 175, 0.08);
        border: 1px solid rgba(120, 137, 179, 0.16);
        border-radius: 999px;
        padding: 6px 10px;
        color: #4f648f;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .card-button {
        width: 100%;
        border: 0;
        border-radius: 12px;
        padding: 10px 12px;
        background: linear-gradient(135deg, rgba(126, 119, 255, 0.12), rgba(250, 134, 208, 0.12), rgba(90, 179, 255, 0.12));
        color: #3d4fbd;
        font-weight: 700;
        cursor: pointer;
      }

      .insight-panel {
        background: rgba(255,255,255,0.8);
        border: 1px solid rgba(136, 156, 201, 0.18);
        border-radius: 26px;
        padding: 22px 22px 18px;
        box-shadow: 0 16px 28px rgba(96, 111, 150, 0.08);
      }

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      .section-head h2 {
        margin: 0;
        font-size: 1.6rem;
        letter-spacing: -0.05em;
      }

      .view-link {
        border: 0;
        background: transparent;
        color: #3e5fc1;
        font-weight: 700;
        cursor: pointer;
      }

      .insight-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .insight-box {
        background: linear-gradient(180deg, rgba(233, 242, 255, 0.85), rgba(255,255,255,0.9));
        border: 1px solid rgba(128, 154, 204, 0.2);
        border-radius: 18px;
        padding: 18px 18px 16px;
      }

      .mini-label {
        display: inline-block;
        background: linear-gradient(135deg, rgba(122, 119, 255, 0.12), rgba(255, 152, 220, 0.14));
        color: #5049d0;
        border-radius: 999px;
        padding: 6px 10px;
        margin-bottom: 12px;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .insight-box strong {
        display: block;
        margin-bottom: 10px;
        font-size: 1.12rem;
        color: #1e2f52;
      }

      .insight-box p {
        margin: 0;
        color: #5e708f;
        line-height: 1.7;
      }

      @keyframes floatCard {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      @keyframes pulseGlow {
        0% { transform: scale(0.96); opacity: 0.7; }
        100% { transform: scale(1.08); opacity: 1; }
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 1180px) {
        .career-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 960px) {
        .careerverse-shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          display: none;
        }

        .workspace {
          height: auto;
          min-height: 100vh;
          padding: 18px 16px 30px;
        }

        .hero-panel {
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }

        .career-grid,
        .insight-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CareerExplorerPage implements OnInit {
  isScrolled = false;
  isProfileMenuOpen = false;
  searchQuery = '';
  currentUserName = 'User';
  currentUserRole = 'Student';
  userInitials = 'U';
  userAvatar = '';
  careerViewLevel = 0;
  selectedCategory = 'All careers';
  categoryOptions = ['All careers', 'Technology', 'Design', 'Business', 'Healthcare'];

  careerCards = [
    {
      title: 'Cloud Engineer',
      slug: 'cloud-engineer',
      category: 'Technology',
      icon: '☁',
      iconClass: 'cloud',
      match: 91,
      description: 'Design and manage secure, scalable cloud infrastructures to power modern applications.',
      tags: ['AWS', 'Docker', 'Linux'],
      featured: true,
    },
    {
      title: 'DevOps Engineer',
      slug: 'devops-engineer',
      category: 'Technology',
      icon: '⟲',
      iconClass: 'devops',
      match: 87,
      description: 'Automate deployment pipelines, monitor systems and speed up software delivery.',
      tags: ['Kubernetes', 'CI/CD', 'Linux'],
      featured: false,
    },
    {
      title: 'Backend Developer',
      slug: 'backend-developer',
      category: 'Technology',
      icon: '< />',
      iconClass: 'backend',
      match: 82,
      description: 'Build reliable applications, APIs, data workflows and server-side logic.',
      tags: ['Python', 'API', 'PostgreSQL'],
      featured: false,
    },
    {
      title: 'UX Researcher',
      slug: 'ux-researcher',
      category: 'Design',
      icon: '✦',
      iconClass: 'ux',
      match: 78,
      description: 'Understand user behavior and translate insights into better digital experiences.',
      tags: ['Research', 'Testing', 'Insights'],
      featured: false,
    },
    {
      title: 'Product Manager',
      slug: 'product-manager',
      category: 'Business',
      icon: '◈',
      iconClass: 'pm',
      match: 76,
      description: 'Lead product strategy, roadmap planning and cross-functional execution for digital experiences.',
      tags: ['Strategy', 'Roadmap', 'UX'],
      featured: false,
    },
    {
      title: 'Data Analyst',
      slug: 'data-analyst',
      category: 'Technology',
      icon: '◫',
      iconClass: 'analytics',
      match: 74,
      description: 'Transform raw data into insights that guide smarter product decisions and business priorities.',
      tags: ['SQL', 'Power BI', 'Insights'],
      featured: false,
    },
    {
      title: 'Cybersecurity Analyst',
      slug: 'cybersecurity-analyst',
      category: 'Technology',
      icon: '◌',
      iconClass: 'security',
      match: 79,
      description: 'Protect systems and data with proactive monitoring, threat detection and risk mitigation.',
      tags: ['Security', 'SIEM', 'Cloud'],
      featured: false,
    },
    {
      title: 'AI Engineer',
      slug: 'ai-engineer',
      category: 'Technology',
      icon: '✧',
      iconClass: 'ai',
      match: 81,
      description: 'Design and deploy intelligent systems that combine machine learning with practical business impact.',
      tags: ['ML', 'Python', 'AI'],
      featured: false,
    },
    {
      title: 'Mobile Developer',
      slug: 'mobile-developer',
      category: 'Technology',
      icon: '▣',
      iconClass: 'mobile',
      match: 75,
      description: 'Build polished mobile experiences that blend design, performance and user-centered interaction.',
      tags: ['Flutter', 'iOS', 'Android'],
      featured: false,
    },
    {
      title: 'Healthcare Analyst',
      slug: 'healthcare-analyst',
      category: 'Healthcare',
      icon: '✚',
      iconClass: 'health',
      match: 73,
      description: 'Use data and research to improve patient outcomes, operations and healthcare decision-making.',
      tags: ['Health', 'Data', 'Research'],
      featured: false,
    },
    {
      title: 'Graphic Designer',
      slug: 'graphic-designer',
      category: 'Design',
      icon: '◐',
      iconClass: 'design',
      match: 71,
      description: 'Design visually engaging experiences that communicate clearly across digital products and brands.',
      tags: ['Brand', 'Figma', 'UI'],
      featured: false,
    },
    {
      title: 'Business Analyst',
      slug: 'business-analyst',
      category: 'Business',
      icon: '◍',
      iconClass: 'business',
      match: 77,
      description: 'Translate business needs into actionable strategies, processes and digital improvements.',
      tags: ['Strategy', 'Planning', 'Analysis'],
      featured: false,
    },
  ];

  get filteredCareerCards() {
    if (this.selectedCategory === 'All careers') {
      return this.careerCards;
    }

    return this.careerCards.filter((career) => career.category === this.selectedCategory);
  }

  get visibleCareerCards() {
    const currentList = this.filteredCareerCards;

    if (this.careerViewLevel === 0) {
      return currentList.slice(0, 4);
    }

    if (this.careerViewLevel === 1) {
      return currentList.slice(0, 8);
    }

    return currentList;
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

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.careerViewLevel = 0;
  }

  toggleCareerList(): void {
    const total = this.filteredCareerCards.length;

    if (this.careerViewLevel < 2 && total > this.visibleCareerCards.length) {
      this.careerViewLevel += 1;
      return;
    }

    this.careerViewLevel = 0;
  }

  openCareer(slug: string): void {
    this.router.navigateByUrl(`/dashboard/career-explorer/${slug}`);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const workspace = document.querySelector('.workspace') as HTMLElement | null;
    this.isScrolled = (workspace ? workspace.scrollTop : window.scrollY) > 20;
  }
}
