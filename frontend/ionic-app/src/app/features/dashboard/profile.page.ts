import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile-page',
  template: `
    <div class="profile-shell">
      <aside class="sidebar">
        <div class="brand-block">
          <div class="brand-mark">
            <span>C</span>
          </div>
          <div class="brand-text">CareerVerse</div>
        </div>

        <nav class="nav-list" aria-label="Main navigation">
          <button class="nav-item" type="button" routerLink="/dashboard/overview">
            <span class="nav-icon">⌂</span>
            <span>Home</span>
          </button>
          <button class="nav-item active" type="button" routerLink="/dashboard/profile">
            <span class="nav-icon">◔</span>
            <span>My Profile</span>
            <span class="nav-arrow">›</span>
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
            <div class="sidebar-footer-text">Build your future with CareerVerse</div>
          </div>
        </div>
      </aside>

      <div class="workspace">
        <header class="appbar">
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
                <div class="user-avatar" [style.background]="profile.avatar ? 'transparent' : 'linear-gradient(135deg, #ffbca5 0%, #8d7ef7 100%)'">
                  <img *ngIf="profile.avatar" [src]="profile.avatar" alt="Profile" />
                  <span *ngIf="!profile.avatar">{{ profile.initials }}</span>
                </div>
                <div class="user-meta">
                  <span class="user-name">{{ profile.fullName }}</span>
                  <small>{{ profile.role }}</small>
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

        <main class="content-panel">
          <div class="page-head">
            <div>
              <h1>My Profile</h1>
              <p>Manage your information and see your AI-powered profile.</p>
            </div>
            <div class="head-actions">
              <button class="edit-primary" type="button" (click)="toggleEdit()">
                <span>✎</span> {{ isEditing ? 'Save profile' : 'Edit Profile' }}
              </button>
            </div>
          </div>

          <section id="overview" class="profile-summary">
            <div class="identity-panel">
              <div class="avatar-wrap">
                <div class="profile-avatar" [style.background]="profile.avatar ? 'transparent' : 'linear-gradient(135deg, #f7d1c9 0%, #9c8ef8 100%)'">
                  <img *ngIf="profile.avatar" [src]="profile.avatar" alt="User avatar" />
                  <span *ngIf="!profile.avatar">{{ profile.initials }}</span>
                </div>
                <label class="photo-button" for="profile-photo-input">Add photo</label>
                <input id="profile-photo-input" type="file" accept="image/*" hidden (change)="onFileSelected($event)" />
              </div>

              <div class="identity-copy">
                <div class="name-row">
                  <h2>{{ profile.fullName }}</h2>
                  <span class="role-pill">{{ profile.role }}</span>
                </div>

                <div class="mail-row">
                  <span class="mini-icon">✉</span>
                  <span>{{ profile.email }}</span>
                </div>
                <div class="mail-row">
                  <span class="mini-icon">⌂</span>
                  <span>{{ profile.university || 'University' }}</span>
                </div>
                <div class="mail-row">
                  <span class="mini-icon">◌</span>
                  <span>{{ profile.studyLevel || 'Study Level' }}</span>
                </div>
                <div class="mail-row" *ngIf="profile.quickInfo">
                  <span class="mini-icon">✦</span>
                  <span>{{ profile.quickInfo }}</span>
                </div>
              </div>

              <div class="tags-row" *ngIf="profile.interests?.length">
                <span *ngFor="let interest of profile.interests">{{ interest }}</span>
              </div>
            </div>

            <div class="quick-info">
              <div class="quick-card">
                <div class="quick-head">
                  <span class="quick-icon">◌</span>
                  <span>Quick Info</span>
                </div>

                <div class="quick-items">
                  <div class="quick-item">
                    <span class="quick-label">University</span>
                    <span class="quick-value">{{ profile.university || 'Not set yet' }}</span>
                  </div>
                  <div class="quick-item">
                    <span class="quick-label">Study Level</span>
                    <span class="quick-value">{{ profile.studyLevel || 'Not set yet' }}</span>
                  </div>
                  <div class="quick-item">
                    <span class="quick-label">Specialty</span>
                    <span class="quick-value">{{ profile.specialty || 'Not set yet' }}</span>
                  </div>
                  <div class="quick-item" *ngIf="profile.quickInfo">
                    <span class="quick-label">Quick Info</span>
                    <span class="quick-value">{{ profile.quickInfo }}</span>
                  </div>
                </div>
              </div>

              <div class="ready-card">
                <span class="ready-badge">✦</span>
                <h3>Your AI Profile is ready!</h3>
                <p>Based on your skills, interests and performance in career labs.</p>
                <button type="button">View AI Profile <span>→</span></button>
              </div>
            </div>
          </section>

          <div class="tabs" aria-label="Profile sections">
            <button class="tab active" type="button" (click)="scrollToSection('overview')">Overview</button>
            <button class="tab" type="button" (click)="scrollToSection('skills')">Skills</button>
            <button class="tab" type="button" (click)="scrollToSection('interests')">Interests</button>
            <button class="tab" type="button" (click)="scrollToSection('experience')">Experience</button>
            <button class="tab" type="button" (click)="scrollToSection('settings')">Settings</button>
          </div>

          <section class="details-grid">
            <article id="settings" class="panel-card personal-card" [class.editing]="isEditingPersonal">
              <div class="panel-header">
                <h3>Personal Information</h3>
                <button class="inline-edit" type="button" (click)="togglePersonalInformationEdit()">✎ {{ isEditingPersonal ? 'Close' : 'Edit' }}</button>
              </div>

              <div class="info-grid" *ngIf="!isEditingPersonal">
                <div class="field-row">
                  <span class="field-label">Full Name</span>
                  <span class="field-value">{{ profile.fullName }}</span>
                </div>
                <div class="field-row">
                  <span class="field-label">Email</span>
                  <span class="field-value">{{ profile.email }}</span>
                </div>
                <div class="field-row">
                  <span class="field-label">University</span>
                  <span class="field-value">{{ profile.university }}</span>
                </div>
                <div class="field-row">
                  <span class="field-label">Study Level</span>
                  <span class="field-value">{{ profile.studyLevel }}</span>
                </div>
                <div class="field-row">
                  <span class="field-label">Specialty</span>
                  <span class="field-value">{{ profile.specialty }}</span>
                </div>
              </div>

              <div class="edit-form" *ngIf="isEditingPersonal">
                <label>
                  <span>Full Name</span>
                  <input type="text" [(ngModel)]="profile.fullName" />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" [(ngModel)]="profile.email" />
                </label>
                <label>
                  <span>University</span>
                  <input type="text" [(ngModel)]="profile.university" />
                </label>
                <label>
                  <span>Study Level</span>
                  <input type="text" [(ngModel)]="profile.studyLevel" />
                </label>
                <label>
                  <span>Specialty</span>
                  <input type="text" [(ngModel)]="profile.specialty" />
                </label>
                <label>
                  <span>Quick Info</span>
                  <textarea rows="3" [(ngModel)]="profile.quickInfo"></textarea>
                </label>
                <button type="button" class="save-section-btn" (click)="savePersonalInformation()">Save</button>
              </div>
            </article>

            <article id="skills" class="panel-card skills-panel">
              <div class="panel-header">
                <h3>AI Profile</h3>
                <span class="last-updated">Last updated: Apr 12, 2025</span>
              </div>

              <div class="skill-list">
                <div class="skill-row" *ngFor="let skill of aiSkills">
                  <div class="skill-text">
                    <span class="skill-icon" [style.color]="skill.color">{{ skill.icon }}</span>
                    <span>{{ skill.name }}</span>
                  </div>
                  <div class="skill-meter">
                    <span [style.width.%]="skill.level" [style.background]="skill.bar"></span>
                  </div>
                  <strong>{{ skill.level }}%</strong>
                </div>
              </div>
            </article>

            <article id="interests" class="panel-card interests-panel">
              <div class="panel-header">
                <h3>Career Interests</h3>
                <button class="inline-edit" type="button" (click)="toggleCareerInterestsEdit()">✎ {{ isEditingCareerInterests ? 'Close' : 'Edit' }}</button>
              </div>

              <div *ngIf="!isEditingCareerInterests">
                <div class="interest-grid" *ngIf="profile.interests?.length; else emptyInterests">
                  <div class="interest-item" *ngFor="let interest of profile.interests; let i = index" [ngClass]="getInterestClass(i)">
                    <span class="interest-icon">{{ getInterestIcon(i) }}</span>
                    <span>{{ interest }}</span>
                    <small>Selected interest</small>
                  </div>
                </div>

                <ng-template #emptyInterests>
                  <div class="interest-grid empty-interests">
                    <div class="interest-item white">
                      <span class="interest-icon">✦</span>
                      <span>Add your career interests</span>
                      <small>Use Edit Profile to fill them</small>
                    </div>
                  </div>
                </ng-template>
              </div>

              <div class="edit-form" *ngIf="isEditingCareerInterests">
                <label>
                  <span>Interests</span>
                  <div class="interest-input-wrap">
                    <input type="text" [(ngModel)]="newInterest" (keyup.enter)="addInterest()" placeholder="Add an interest" />
                    <button type="button" class="add-interest-btn" (click)="addInterest()">+</button>
                  </div>
                  <div class="interest-chips" *ngIf="profile.interests?.length">
                    <span class="interest-chip" *ngFor="let interest of profile.interests; let i = index">
                      {{ interest }}
                      <button type="button" (click)="removeInterest(i)">×</button>
                    </span>
                  </div>
                </label>
                <button type="button" class="save-section-btn" (click)="saveCareerInterests()">Save</button>
              </div>

            </article>

            <article class="panel-card stats-panel">
              <div class="panel-header">
                <h3>My Stats</h3>
              </div>

              <div class="stats-grid">
                <div class="stat-box">
                  <span class="stat-number">4 / 8</span>
                  <small>Career labs completed</small>
                </div>
                <div class="stat-box">
                  <span class="stat-number">71%</span>
                  <small>Average score</small>
                </div>
                <div class="stat-box">
                  <span class="stat-number">12</span>
                  <small>Total simulations</small>
                </div>
                <div class="stat-box">
                  <span class="stat-number">3</span>
                  <small>Recommended careers</small>
                </div>
              </div>
            </article>

            <article id="experience" class="panel-card preferences-panel">
              <div class="panel-header">
                <h3>My Interests & Preferences</h3>
                <button class="inline-edit" type="button" (click)="togglePreferenceEdit()">✎ {{ isEditingPreferences ? 'Close' : 'Edit' }}</button>
              </div>

              <div class="selection-summary">
                <div class="selection-list" *ngIf="selectedInterestOptions.length; else emptyInterestSelection">
                  <span class="selection-chip" *ngFor="let option of selectedInterestOptions">
                    {{ option }}
                  </span>
                </div>
                <ng-template #emptyInterestSelection>
                  <div class="empty-selection">No interest selected</div>
                </ng-template>

                <button class="selection-add-btn" type="button" (click)="showInterestOptions = !showInterestOptions" *ngIf="isEditingPreferences">+</button>
              </div>

              <div class="selection-picker" *ngIf="showInterestOptions && isEditingPreferences">
                <button
                  type="button"
                  class="chip-option"
                  *ngFor="let option of interestOptions"
                  [class.selected]="selectedInterestOptions.includes(option)"
                  (click)="toggleInterestOption(option)"
                >
                  {{ option }}
                </button>
              </div>

              <div class="preference-section-title">Preferred Work Environment</div>
              <div class="selection-summary compact">
                <div class="selection-list" *ngIf="selectedWorkEnvironment.length; else emptyWorkSelection">
                  <span class="selection-chip accent" *ngFor="let option of selectedWorkEnvironment">
                    {{ option }}
                  </span>
                </div>
                <ng-template #emptyWorkSelection>
                  <div class="empty-selection">No preference selected</div>
                </ng-template>

                <button class="selection-add-btn" type="button" (click)="showWorkEnvironmentOptions = !showWorkEnvironmentOptions" *ngIf="isEditingPreferences">+</button>
              </div>

              <div class="selection-picker" *ngIf="showWorkEnvironmentOptions && isEditingPreferences">
                <button
                  type="button"
                  class="preference-item"
                  *ngFor="let option of workEnvironmentOptions"
                  [class.selected]="selectedWorkEnvironment.includes(option.label)"
                  (click)="toggleWorkEnvironment(option.label)"
                >
                  <span class="tag-icon">{{ option.icon }}</span>
                  <span>{{ option.label }}</span>
                </button>
              </div>

              <button *ngIf="isEditingPreferences" type="button" class="save-section-btn" (click)="savePreferenceSelections()">Save</button>
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

      button, input { font: inherit; }

      .profile-shell {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        height: 100vh;
        overflow: hidden;
        background: linear-gradient(90deg, #1a1538 0%, #1a1538 260px, #f4f1ff 260px, #f4f1ff 100%);
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
        background: linear-gradient(135deg, #8e7dff 0%, #4cb5ff 45%, #ff8fd8 100%);
        position: relative;
        box-shadow: 0 0 18px rgba(142, 125, 255, 0.6);
        display: grid;
        place-items: center;
        font-size: 1.1rem;
        font-weight: 800;
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
        font-size: 1.02rem;
        font-weight: 700;
        line-height: 1.45;
        letter-spacing: -0.04em;
      }

      .workspace {
        padding: 0 26px 30px;
        background: linear-gradient(180deg, #f4f7fd 0%, #edf2fb 100%);
        overflow-y: auto;
        height: 100vh;
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
        border: 1px solid rgba(130, 143, 181, 0.2);
        background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(233,239,255,0.8));
        color: #3d4d6d;
        font-size: 1.2rem;
        box-shadow: 0 6px 14px rgba(118, 130, 168, 0.08);
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
        display: grid;
        place-items: center;
        color: #fff;
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

      .content-panel {
        display: grid;
        gap: 20px;
        padding-bottom: 40px;
      }

      .page-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 22px;
        margin-top: 6px;
        margin-bottom: 8px;
      }

      .page-head h1 {
        margin: 0;
        font-size: 2.2rem;
        letter-spacing: -0.06em;
        color: #1d2e57;
      }

      .page-head p {
        margin: 6px 0 0;
        color: #5d6f8e;
        font-size: 1.02rem;
      }

      .head-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .edit-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(139, 124, 255, 0.22);
        background: linear-gradient(135deg, rgba(133, 117, 255, 0.14), rgba(255, 145, 210, 0.12), rgba(109, 195, 255, 0.12));
        color: #2b2f6d;
        border-radius: 14px;
        padding: 11px 18px;
        font-weight: 700;
        cursor: pointer;
      }

      .profile-summary {
        display: grid;
        grid-template-columns: 1.7fr 1fr;
        gap: 22px;
        align-items: stretch;
      }

      .identity-panel,
      .quick-card,
      .ready-card,
      .panel-card {
        background: rgba(255,255,255,0.7);
        border: 1px solid rgba(144, 148, 171, 0.15);
        border-radius: 24px;
        box-shadow: 0 12px 22px rgba(103, 113, 150, 0.05);
      }

      .identity-panel {
        display: flex;
        align-items: center;
        gap: 22px;
        padding: 22px 24px;
      }

      .avatar-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .profile-avatar {
        width: 92px;
        height: 92px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f7d1c9 0%, #9c8ef8 100%);
        display: grid;
        place-items: center;
        color: #fff;
        font-weight: 800;
        font-size: 2rem;
        overflow: hidden;
      }

      .profile-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-button {
        border: 1px solid rgba(114, 119, 172, 0.2);
        background: #eef3ff;
        color: #2a4fd2;
        border-radius: 999px;
        padding: 7px 12px;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
      }

      .identity-copy {
        flex: 1;
      }

      .name-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }

      .name-row h2 {
        margin: 0;
        font-size: 1.9rem;
        letter-spacing: -0.05em;
        color: #1d2d56;
      }

      .role-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(129, 118, 255, 0.12), rgba(255, 148, 218, 0.14));
        color: #5248cf;
        border-radius: 999px;
        padding: 7px 10px;
        font-weight: 700;
        font-size: 0.75rem;
      }

      .mail-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        color: #4e5f82;
        font-size: 0.98rem;
      }

      .mini-icon {
        width: 18px;
        color: #4a62d1;
        display: inline-flex;
        justify-content: center;
      }

      .tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-left: auto;
      }

      .tags-row span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 8px 12px;
        background: linear-gradient(90deg, rgba(126, 117, 255, 0.12), rgba(76, 181, 255, 0.12), rgba(255, 145, 210, 0.12));
        color: #4e4bc6;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .quick-info {
        display: grid;
        gap: 16px;
        align-content: start;
      }

      .quick-card,
      .ready-card {
        padding: 20px 18px;
      }

      .quick-head {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        color: #1d2d56;
        font-size: 1.05rem;
        margin-bottom: 16px;
      }

      .quick-icon {
        color: #4a62d1;
        font-size: 1.3rem;
      }

      .quick-items {
        display: grid;
        gap: 12px;
      }

      .quick-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        color: #536787;
        font-size: 0.95rem;
      }

      .quick-label {
        color: #5d6f8e;
      }

      .quick-value {
        color: #1b2d4f;
        font-weight: 700;
      }

      .ready-card {
        background: linear-gradient(180deg, rgba(211, 236, 255, 0.8), rgba(239, 247, 255, 0.85));
        position: relative;
        overflow: hidden;
      }

      .ready-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: rgba(255,255,255,0.7);
        color: #4a62d1;
        margin-bottom: 14px;
      }

      .ready-card h3 {
        margin: 0 0 10px;
        font-size: 1.3rem;
        letter-spacing: -0.04em;
        color: #1d2d56;
      }

      .ready-card p {
        margin: 0 0 18px;
        color: #536787;
        line-height: 1.6;
      }

      .ready-card button {
        width: 100%;
        border: 0;
        background: linear-gradient(135deg, #6d74ff 0%, #5ab3ff 45%, #ff8ed8 100%);
        color: #fff;
        border-radius: 14px;
        padding: 12px 16px;
        font-weight: 700;
        cursor: pointer;
      }

      .tabs {
        display: flex;
        align-items: center;
        gap: 18px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(128, 142, 176, 0.2);
      }

      .tab {
        border: 0;
        background: transparent;
        padding: 8px 0;
        color: #5d6f8e;
        font-weight: 700;
        cursor: pointer;
      }

      .tab.active {
        color: #4b4de4;
        border-bottom: 3px solid #7b6cf5;
      }

      .details-grid {
        display: grid;
        grid-template-columns: 1.2fr 1.0fr;
        gap: 18px;
      }

      #overview,
      #skills,
      #interests,
      #experience,
      #settings {
        scroll-margin-top: 110px;
      }

      .panel-card {
        padding: 18px 18px 16px;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 14px;
      }

      .panel-header h3 {
        margin: 0;
        font-size: 1.2rem;
        letter-spacing: -0.04em;
        color: #202d52;
      }

      .last-updated {
        color: #6d7b97;
        font-size: 0.76rem;
      }

      .inline-edit {
        border: 0;
        background: transparent;
        color: #3b57d7;
        font-weight: 700;
        cursor: pointer;
      }

      .info-grid {
        display: grid;
        gap: 14px;
      }

      .field-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(139, 153, 184, 0.12);
      }

      .field-label {
        color: #536787;
      }

      .field-value {
        color: #1d2d56;
        font-weight: 700;
      }

      .edit-form {
        display: grid;
        gap: 12px;
      }

      .edit-form label {
        display: grid;
        gap: 6px;
        font-size: 0.82rem;
        color: #536787;
        font-weight: 700;
      }

      .edit-form input,
      .edit-form textarea {
        border: 1px solid rgba(133, 146, 180, 0.25);
        background: rgba(244,248,255,0.8);
        border-radius: 12px;
        padding: 10px 12px;
        color: #1d2d56;
      }

      .edit-form textarea {
        resize: vertical;
      }

      .interest-input-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .interest-input-wrap input {
        flex: 1;
        min-height: 42px;
      }

      .add-interest-btn {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        border: 0;
        background: linear-gradient(135deg, #5d6ef6 0%, #69b8ff 100%);
        color: #ffffff;
        font-size: 1.8rem;
        font-weight: 700;
        cursor: pointer;
        line-height: 1;
        box-shadow: 0 10px 18px rgba(91, 110, 246, 0.2);
      }

      .interest-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }

      .interest-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(99, 125, 255, 0.12);
        color: #2d4ad7;
        border-radius: 999px;
        padding: 7px 10px;
        font-size: 0.78rem;
        font-weight: 700;
      }

      .interest-chip button {
        border: 0;
        background: transparent;
        color: #2d4ad7;
        font-size: 1rem;
        cursor: pointer;
        line-height: 1;
        padding: 0;
      }

      .save-section-btn {
        margin-top: 12px;
        border: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, #5d6ef6 0%, #69b8ff 45%, #ff8ed8 100%);
        color: #fff;
        font-weight: 700;
        padding: 10px 16px;
        cursor: pointer;
        box-shadow: 0 10px 18px rgba(109, 108, 255, 0.22);
      }

      .skills-panel .skill-list {
        display: grid;
        gap: 14px;
      }

      .skill-row {
        display: grid;
        grid-template-columns: minmax(120px, 1fr) minmax(120px, 1.7fr) auto;
        align-items: center;
        gap: 12px;
      }

      .skill-text {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1d2d56;
        font-weight: 700;
      }

      .skill-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background: rgba(139, 159, 250, 0.12);
      }

      .skill-meter {
        width: 100%;
        height: 10px;
        border-radius: 999px;
        background: rgba(137, 150, 182, 0.12);
        overflow: hidden;
      }

      .skill-meter span {
        display: block;
        height: 100%;
        border-radius: inherit;
      }

      .interest-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .interest-item {
        border-radius: 16px;
        padding: 14px 12px;
        display: grid;
        gap: 8px;
        min-height: 92px;
      }

      .interest-item.green { background: linear-gradient(180deg, rgba(185, 246, 227, 0.9), rgba(217, 249, 238, 0.85)); }
      .interest-item.white { background: linear-gradient(180deg, rgba(236, 240, 255, 0.9), rgba(248, 251, 255, 0.9)); }
      .interest-item.mint { background: linear-gradient(180deg, rgba(220, 252, 240, 0.8), rgba(240, 255, 248, 0.85)); }
      .interest-item.peach { background: linear-gradient(180deg, rgba(255, 239, 232, 0.88), rgba(255, 246, 240, 0.9)); }

      .interest-icon {
        font-size: 1.5rem;
        color: #1d2d56;
      }

      .interest-item span:nth-child(2) {
        color: #1d2d56;
        font-weight: 700;
        line-height: 1.3;
      }

      .interest-item small {
        color: #536787;
      }

      .stats-grid {
        margin-top: 16px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .stat-box {
        background: rgba(243, 248, 255, 0.9);
        border: 1px solid rgba(141, 155, 192, 0.12);
        border-radius: 16px;
        padding: 14px 12px;
        display: grid;
        gap: 10px;
      }

      .stat-number {
        font-size: 1.3rem;
        color: #1d2d56;
        font-weight: 800;
      }

      .stat-box small {
        color: #5d6f8e;
      }

      .preferences-panel {
        grid-column: 1 / -1;
      }

      .selection-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 48px;
        background: rgba(136, 156, 255, 0.08);
        border: 1px solid rgba(117, 128, 187, 0.14);
        border-radius: 16px;
        padding: 10px 12px;
        margin-bottom: 12px;
      }

      .selection-summary.compact {
        margin-top: 8px;
      }

      .selection-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        flex: 1;
      }

      .selection-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 7px 12px;
        background: linear-gradient(135deg, rgba(126, 117, 255, 0.16), rgba(81, 196, 255, 0.14), rgba(255, 145, 210, 0.12));
        color: #453fc2;
        border-radius: 999px;
        font-size: 0.76rem;
        font-weight: 700;
      }

      .selection-chip.accent {
        background: linear-gradient(135deg, rgba(73, 176, 159, 0.14), rgba(124, 216, 194, 0.16));
        color: #1b6d5d;
      }

      .empty-selection {
        color: #6d7b97;
        font-size: 0.82rem;
        font-style: italic;
      }

      .selection-add-btn {
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: 10px;
        background: linear-gradient(135deg, #5d6ef6 0%, #69b8ff 100%);
        color: #fff;
        font-size: 1.7rem;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        box-shadow: 0 8px 18px rgba(91, 110, 246, 0.18);
      }

      .selection-picker {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
      }

      .empty-interests {
        grid-template-columns: 1fr;
      }

      .chip-option,
      .preference-item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: rgba(142, 164, 255, 0.12);
        border: 1px solid rgba(117, 128, 187, 0.14);
        border-radius: 999px;
        padding: 10px 16px;
        color: #304684;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 42px;
      }

      .chip-option.selected,
      .preference-item.selected {
        background: linear-gradient(135deg, rgba(89, 114, 255, 0.18), rgba(81, 196, 255, 0.14));
        border-color: rgba(76, 98, 232, 0.3);
        box-shadow: 0 8px 18px rgba(91, 109, 219, 0.12);
      }

      .preference-section-title {
        margin-top: 18px;
        margin-bottom: 8px;
        color: #1d2d56;
        font-size: 0.9rem;
        font-weight: 700;
      }

      .tag-icon {
        font-size: 1.1rem;
      }

      @media (max-width: 1120px) {
        .profile-summary,
        .details-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 860px) {
        .profile-shell {
          grid-template-columns: 1fr;
          background: linear-gradient(180deg, #071b46 0%, #071b46 210px, #f3f6fb 210px, #f3f6fb 100%);
        }

        .sidebar {
          border-right: 0;
          border-bottom: 1px solid rgba(123, 143, 190, 0.18);
        }

        .workspace {
          padding: 16px;
        }

        .page-head {
          flex-direction: column;
          align-items: flex-start;
        }

        .identity-panel {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class ProfilePage implements OnInit {
  isEditing = false;
  isEditingPersonal = false;
  isEditingCareerInterests = false;
  isEditingPreferences = false;
  isProfileMenuOpen = false;
  searchQuery = '';
  newInterest = '';

  profile = {
    fullName: '',
    email: '',
    university: '',
    studyLevel: '',
    specialty: '',
    role: 'Student',
    avatar: '',
    initials: 'CF',
    interests: [] as string[],
    preferences: [] as string[],
    workEnvironment: [] as string[],
    quickInfo: '',
  };

  aiSkills = [
    { name: 'Programming', level: 85, icon: '◌', color: '#3b5ef6', bar: 'linear-gradient(90deg, #4c78ff 0%, #7ea8ff 100%)' },
    { name: 'Cloud', level: 72, icon: '☁', color: '#2da7a1', bar: 'linear-gradient(90deg, #30baa8 0%, #88d7ca 100%)' },
    { name: 'DevOps', level: 68, icon: '⟲', color: '#5d5ae7', bar: 'linear-gradient(90deg, #5f7afc 0%, #8ea2ff 100%)' },
    { name: 'Cybersecurity', level: 60, icon: '◈', color: '#d7678f', bar: 'linear-gradient(90deg, #ef5d8e 0%, #f9a7b7 100%)' },
    { name: 'Problem Solving', level: 85, icon: '◍', color: '#2da27d', bar: 'linear-gradient(90deg, #29b678 0%, #7ed7a4 100%)' },
    { name: 'Analytical Skills', level: 82, icon: '▣', color: '#5c8ff2', bar: 'linear-gradient(90deg, #5dc9d8 0%, #7be7dc 100%)' },
    { name: 'Teamwork', level: 76, icon: '✦', color: '#8057d0', bar: 'linear-gradient(90deg, #8b5cf6 0%, #c7a7ff 100%)' },
  ];

  readonly interestOptions = ['Technology', 'Innovation', 'Problem Solving', 'Collaboration'];
  readonly workEnvironmentOptions = [
    { icon: '⌂', label: 'Remote / Flexible' },
    { icon: '👥', label: 'Team Work' },
    { icon: '⚡', label: 'Fast-paced' },
    { icon: '✦', label: 'Creative' },
  ];

  selectedInterestOptions: string[] = [];
  selectedWorkEnvironment: string[] = [];
  showInterestOptions = false;
  showWorkEnvironmentOptions = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const storedUser = this.authService.getCurrentUser();
    const storedProfile = this.authService.getProfile();

    const firstName = storedUser?.first_name || '';
    const lastName = storedUser?.last_name || '';
    const email = storedUser?.email || '';
    const legacyDefaults = ['TEX-UP', '2nd Year', 'Software Engineering', 'Problem Solving', 'Curious', 'Team Player'];

    const cleanText = (value?: string) => {
      if (!value) {
        return '';
      }
      const text = value.trim();
      return legacyDefaults.includes(text) ? '' : text;
    };

    const cleanInterests = (values?: string[]) => {
      if (!Array.isArray(values)) {
        return [];
      }
      return values
        .map((value) => value.trim())
        .filter((value) => !!value && !legacyDefaults.includes(value));
    };

    this.profile = {
      ...this.profile,
      fullName: `${firstName} ${lastName}`.trim() || storedProfile?.fullName || '',
      email: storedProfile?.email || email,
      initials: this.getInitials(firstName, lastName),
      university: cleanText(storedProfile?.university),
      studyLevel: cleanText(storedProfile?.studyLevel),
      specialty: cleanText(storedProfile?.specialty),
      avatar: storedProfile?.avatar || '',
      interests: cleanInterests(storedProfile?.interests),
      preferences: cleanInterests(storedProfile?.preferences ?? storedProfile?.interests),
      workEnvironment: Array.isArray(storedProfile?.workEnvironment) ? storedProfile.workEnvironment.map((item: string) => item.trim()).filter(Boolean) : [],
      quickInfo: cleanText(storedProfile?.quickInfo),
    };

    this.selectedInterestOptions = [...this.profile.preferences];
    this.selectedWorkEnvironment = [...this.profile.workEnvironment];

    if (!this.profile.email && storedUser?.email) {
      this.profile.email = storedUser.email;
    }

    const hasProfileDetails = !!(
      this.profile.university ||
      this.profile.studyLevel ||
      this.profile.specialty ||
      this.profile.quickInfo ||
      this.profile.interests.length
    );

    this.isEditing = !hasProfileDetails;
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.persistProfile();
    }

    this.isEditing = !this.isEditing;
  }

  togglePersonalInformationEdit(): void {
    if (this.isEditingPersonal) {
      this.persistProfile();
    }

    this.isEditingPersonal = !this.isEditingPersonal;
  }

  toggleCareerInterestsEdit(): void {
    if (this.isEditingCareerInterests) {
      this.persistProfile();
    }

    this.isEditingCareerInterests = !this.isEditingCareerInterests;
  }

  togglePreferenceEdit(): void {
    if (this.isEditingPreferences) {
      this.savePreferenceSelections();
      return;
    }

    this.isEditingPreferences = true;
    this.showInterestOptions = false;
    this.showWorkEnvironmentOptions = false;
  }

  savePersonalInformation(): void {
    this.persistProfile();
    this.isEditingPersonal = false;
  }

  saveCareerInterests(): void {
    this.persistProfile();
    this.isEditingCareerInterests = false;
  }

  savePreferenceSelections(): void {
    this.profile.preferences = [...this.selectedInterestOptions];
    this.profile.workEnvironment = [...this.selectedWorkEnvironment];
    this.persistProfile();
    this.isEditingPreferences = false;
    this.showInterestOptions = false;
    this.showWorkEnvironmentOptions = false;
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  openSettings(): void {
    this.isProfileMenuOpen = false;
    document.getElementById('settings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  logout(): void {
    this.authService.clearCurrentUser();
    this.isProfileMenuOpen = false;
    this.router.navigateByUrl('/auth/login');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.profile.avatar = String(reader.result ?? '');
      this.authService.setProfile({
        ...this.authService.getProfile(),
        avatar: this.profile.avatar,
      });
    };
    reader.readAsDataURL(file);
  }

  addInterest(): void {
    const value = this.newInterest.trim();
    if (!value) {
      return;
    }

    if (!this.profile.interests.includes(value)) {
      this.profile.interests = [...this.profile.interests, value];
    }

    this.newInterest = '';
    this.persistProfile();
  }

  removeInterest(index: number): void {
    this.profile.interests = this.profile.interests.filter((_, itemIndex) => itemIndex !== index);
    this.persistProfile();
  }

  private persistProfile(): void {
    const currentUser = this.authService.getCurrentUser() ?? {};
    const fullNameParts = this.profile.fullName.trim().split(/\s+/).filter(Boolean);
    const nextUser = {
      ...currentUser,
      first_name: fullNameParts[0] || currentUser.first_name || '',
      last_name: fullNameParts.slice(1).join(' ') || currentUser.last_name || '',
      email: this.profile.email,
    };

    const normalizedProfile = {
      fullName: this.profile.fullName.trim(),
      email: this.profile.email.trim(),
      university: this.profile.university.trim(),
      studyLevel: this.profile.studyLevel.trim(),
      specialty: this.profile.specialty.trim(),
      quickInfo: this.profile.quickInfo.trim(),
      avatar: this.profile.avatar,
      interests: this.profile.interests.map((item) => item.trim()).filter(Boolean),
      preferences: [...this.selectedInterestOptions],
      workEnvironment: [...this.selectedWorkEnvironment],
    };

    this.authService.setCurrentUser(nextUser);
    this.authService.setProfile(normalizedProfile);
  }

  toggleInterestOption(option: string): void {
    if (this.selectedInterestOptions.includes(option)) {
      this.selectedInterestOptions = this.selectedInterestOptions.filter((item) => item !== option);
      return;
    }

    this.selectedInterestOptions = [...this.selectedInterestOptions, option];
  }

  toggleWorkEnvironment(option: string): void {
    if (this.selectedWorkEnvironment.includes(option)) {
      this.selectedWorkEnvironment = this.selectedWorkEnvironment.filter((item) => item !== option);
      return;
    }

    this.selectedWorkEnvironment = [...this.selectedWorkEnvironment, option];
  }

  getInterestClass(index: number): string {
    const classes = ['green', 'white', 'mint', 'peach'];
    return classes[index % classes.length];
  }

  getInterestIcon(index: number): string {
    const icons = ['☁', '⌁', '</>', '◈'];
    return icons[index % icons.length];
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId) as HTMLElement | null;
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollBy({ top: -90, behavior: 'smooth' });

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab) => tab.classList.remove('active'));

    const activeTab = Array.from(tabs).find((tab) => (tab as HTMLElement).textContent?.trim() === this.getTabLabel(sectionId));
    if (activeTab) {
      activeTab.classList.add('active');
    }
  }

  private getTabLabel(sectionId: string): string {
    const map: Record<string, string> = {
      overview: 'Overview',
      skills: 'Skills',
      interests: 'Interests',
      experience: 'Experience',
      settings: 'Settings',
    };

    return map[sectionId] ?? 'Overview';
  }

  private getInitials(firstName: string, lastName: string): string {
    return `${(firstName || '').charAt(0) || 'C'}${(lastName || '').charAt(0) || 'F'}`.toUpperCase();
  }
}
