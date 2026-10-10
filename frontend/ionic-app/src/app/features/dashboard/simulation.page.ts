import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AI_LABS, CareerAiService } from '../../core/services/career-ai.service';

interface MissionSpec {
  id: string;
  title: string;
  description: string;
  instruction: string;
  simulationType?: 'architecture' | 'scenario' | 'problem' | 'quiz';
  availableServices: string[];
  expectedServices: string[];
  solutionOptions?: string[];
  result: string;
}

interface CareerSpec {
  id: string;
  title: string;
  accent: string;
  missions: MissionSpec[];
}

@Component({
  selector: 'app-simulation-page',
  template: `
    <div class="simulation-shell">
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
          <button class="nav-item" type="button" routerLink="/dashboard/assessment">
            <span class="nav-icon">☰</span>
            <span>Assessment</span>
          </button>
          <button class="nav-item" type="button" routerLink="/dashboard/results">
            <span class="nav-icon">✦</span>
            <span>AI Results</span>
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
            <input type="text" placeholder="Search careers or missions..." />
          </label>

          <div class="appbar-actions">
            <button class="notify-button" type="button" aria-label="Notifications">
              <span class="bell-icon">◔</span>
              <span class="notification-dot"></span>
            </button>

            <div class="user-menu-wrap">
              <button class="user-badge" type="button" (click)="goBack()" aria-label="Profile menu">
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

        <main class="mission-shell">
          <section class="instruction-panel">
            <div class="panel-title-row">
              <h2>{{ currentCareer.title }} — Mission {{ currentMissionIndex + 1 }}/{{ currentCareer.missions.length }}</h2>
              <span class="tiny-badge">{{ currentMission.title }}</span>
              <span class="tiny-badge ai-badge" *ngIf="isAiLab">Analysed by AI</span>
            </div>

            <div class="instruction-copy">
              <h3>Instructions</h3>
              <p>{{ currentMission.instruction }}</p>
            </div>

            <div class="services-block">
              <h3>{{ getSelectionLabel() }}</h3>
              <div class="service-grid">
                <button
                  *ngFor="let service of currentMissionOptions()"
                  type="button"
                  class="service-chip"
                  [class.active]="selectedServices.includes(service)"
                  (click)="toggleService(service)"
                >
                  <span class="chip-dot" [style.background]="getServiceColor(service)"></span>
                  {{ service }}
                </button>
              </div>
            </div>

            <div class="validate-wrap">
              <button class="validate-btn" type="button" (click)="validateArchitecture()">Valider</button>
            </div>

            <div class="feedback-box" *ngIf="feedbackText">
              <strong>{{ isValid ? 'Bonne réponse !' : 'À corriger' }} · {{ missionScores[currentMissionIndex] | number:'1.0-0' }}/100</strong>
              <p>{{ feedbackText }}</p>
            </div>

            <div class="feedback-box hint-box" *ngIf="hintShown[currentMissionIndex]">
              <strong>Indice</strong>
              <p>{{ currentHint() }}</p>
            </div>
          </section>

          <section class="architecture-panel">
            <div class="panel-header">
              <h2>{{ getSimulationTitle() }}</h2>
              <button class="help-btn" type="button" aria-label="Afficher un indice" title="Afficher un indice (compte comme indice utilisé)" (click)="showHint()">?</button>
            </div>

            <ng-container *ngIf="currentMission.simulationType === 'architecture'; else alternateSimulation">
              <div class="diagram">
                <div class="diagram-node internet-node">Internet</div>
                <div class="diagram-arrow">→</div>
                <div class="diagram-node lb-node">Load Balancer</div>

                <div class="resource-row">
                  <div class="resource-card" [class.selected]="selectedServices.includes('EC2')" [style.borderColor]="selectedServices.includes('EC2') ? '#ffb454' : '#8ca3d6'">
                    <div class="resource-icon ec2">EC2</div>
                  </div>
                  <div class="resource-card" [class.selected]="selectedServices.includes('RDS')" [style.borderColor]="selectedServices.includes('RDS') ? '#4ec7ff' : '#8ca3d6'">
                    <div class="resource-icon rds">RDS</div>
                  </div>
                </div>

                <div class="resource-row lower-row">
                  <div class="resource-card" [class.selected]="selectedServices.includes('S3')" [style.borderColor]="selectedServices.includes('S3') ? '#4fe3a5' : '#8ca3d6'">
                    <div class="resource-icon s3">S3</div>
                  </div>
                  <div class="resource-card" [class.selected]="selectedServices.includes('Lambda')" [style.borderColor]="selectedServices.includes('Lambda') ? '#ff7cc8' : '#8ca3d6'">
                    <div class="resource-icon lambda">Lambda</div>
                  </div>
                </div>
              </div>
            </ng-container>

            <ng-template #alternateSimulation>
              <div class="scenario-surface">
                <div class="scenario-card">
                  <h3>{{ currentMission.description }}</h3>
                  <p>{{ currentMission.instruction }}</p>
                </div>
                <div class="scenario-note">
                  <span>Choix retenu</span>
                  <div class="selected-summary">
                    <span *ngIf="selectedServices.length; else noChoice">{{ selectedServices.join(' • ') }}</span>
                    <ng-template #noChoice>Pas de sélection pour l’instant</ng-template>
                  </div>
                </div>
              </div>
            </ng-template>

            <div class="bottom-actions">
              <button class="secondary-btn" type="button" (click)="goBack()">Retour</button>
              <button class="next-btn" type="button" (click)="nextMission()">
                {{ isLastMission ? 'Terminer' : 'Mission suivante' }}
              </button>
            </div>
          </section>
        </main>

        <div class="finish-overlay" *ngIf="finishing" role="dialog" aria-modal="true" aria-labelledby="finish-title">
          <div class="finish-card">
            <h2 id="finish-title">Lab terminé : {{ currentCareer.title }}</h2>
            <div class="finish-stats">
              <div><span>Score</span><strong>{{ labScore | number:'1.0-0' }}/100</strong></div>
              <div><span>Missions réussies</span><strong>{{ missionsCorrect }}/{{ currentCareer.missions.length }}</strong></div>
              <div><span>Temps</span><strong>{{ elapsedLabel }}</strong></div>
              <div><span>Validations</span><strong>{{ totalValidations }}</strong></div>
              <div><span>Indices</span><strong>{{ hintsUsed }}</strong></div>
            </div>
            <p class="finish-question">Avez-vous aimé ce lab ?</p>
            <div class="stars" role="radiogroup" aria-label="Plaisir de 1 à 5">
              <button *ngFor="let v of [1,2,3,4,5]" type="button" role="radio" [attr.aria-checked]="enjoyment === v"
                      [class.on]="enjoyment >= v" (click)="enjoyment = v">★</button>
            </div>
            <p class="finish-hint" *ngIf="!enjoyment">Choisissez une note de 1 à 5 étoiles pour enregistrer le lab : le modèle en a besoin.</p>
            <p class="finish-error" *ngIf="submitError">{{ submitError }}</p>
            <div class="finish-actions">
              <button class="secondary-btn" type="button" (click)="finishing = false; labFinishedAt = 0">Revenir aux missions</button>
              <button class="next-btn" type="button" [disabled]="!enjoyment || submitting" (click)="submitLab()">
                {{ submitting ? 'Envoi…' : 'Enregistrer et voir mes résultats' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; min-height: 100vh; background: linear-gradient(180deg, #071a39 0%, #0b2247 100%); font-family: Inter, 'Segoe UI', sans-serif; }
      * { box-sizing: border-box; }
      button { font: inherit; }

      .simulation-shell {
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
      .nav-arrow { font-size: 1.4rem; color: rgba(255,255,255,0.7); margin-left: auto; }

      .workspace {
        min-height: 100vh;
        padding: 0 26px 30px;
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
        margin: 16px 0 20px;
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

      .mission-shell {
        display: grid;
        grid-template-columns: minmax(300px, 0.95fr) minmax(420px, 1.4fr);
        gap: 18px;
        min-height: calc(100vh - 120px);
      }

      .instruction-panel, .architecture-panel {
        background: linear-gradient(180deg, rgba(26, 42, 78, 0.88), rgba(15, 28, 59, 0.92));
        border: 1px solid rgba(131, 151, 218, 0.2);
        border-radius: 22px; padding: 18px 18px 16px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
      }

      .panel-title-row {
        display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 16px;
      }
      .panel-title-row h2 {
        margin: 0; color: #edf5ff; font-size: 2rem; letter-spacing: -0.06em;
      }
      .tiny-badge {
        display: inline-flex; align-items: center; justify-content: center; min-width: 84px;
        padding: 7px 10px; border-radius: 999px; background: rgba(100, 122, 255, 0.18); color: #dfe7ff; font-weight: 700; font-size: 0.7rem;
      }

      .instruction-copy h3, .services-block h3 {
        margin: 0 0 10px; font-size: 1.08rem; color: #edf5ff;
      }
      .instruction-copy p {
        margin: 0 0 22px; color: #d5e7ff; line-height: 1.7; font-size: 1rem;
      }

      .service-grid {
        display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;
      }
      .service-chip {
        display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(138, 160, 220, 0.34); border-radius: 12px;
        background: rgba(255,255,255,0.06); color: #edf5ff; padding: 10px 12px; font-weight: 700; cursor: pointer;
      }
      .service-chip.active {
        background: rgba(118, 105, 255, 0.22); border-color: rgba(164, 153, 255, 0.8);
      }
      .chip-dot {
        display: inline-block; width: 18px; height: 18px; border-radius: 6px; background: #7ab8ff;
        box-shadow: inset 0 0 0 2px rgba(255,255,255,0.3);
      }

      .validate-wrap { margin-top: 18px; }
      .validate-btn {
        width: 100%; border: 0; border-radius: 12px; padding: 14px 18px; background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 35%, #ff73c9 100%);
        color: #fff; font-weight: 800; cursor: pointer; box-shadow: 0 18px 30px rgba(94, 110, 255, 0.2);
      }

      .feedback-box {
        margin-top: 18px; padding: 14px 14px 12px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(147, 170, 235, 0.2);
      }
      .feedback-box strong { display: block; margin-bottom: 8px; color: #edf5ff; }
      .feedback-box p { margin: 0; color: #d7e3ff; line-height: 1.6; }

      .architecture-panel { display: flex; flex-direction: column; }
      .panel-header {
        display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px;
      }
      .panel-header h2 {
        margin: 0; color: #edf5ff; font-size: 1.1rem; letter-spacing: -0.02em;
      }
      .help-btn {
        width: 28px; height: 28px; border-radius: 50%; border: 0; background: rgba(147, 170, 235, 0.18); color: #edf5ff; font-weight: 800; cursor: pointer;
      }
      .diagram {
        position: relative; display: grid; gap: 18px; min-height: 360px; padding: 18px 14px 0; border-radius: 18px;
        background: linear-gradient(180deg, rgba(10, 27, 53, 0.78), rgba(18, 31, 66, 0.96)); border: 1px solid rgba(131, 151, 218, 0.14);
      }
      .scenario-surface {
        display: grid; gap: 16px; min-height: 360px; padding: 16px; border-radius: 18px;
        background: linear-gradient(180deg, rgba(10, 27, 53, 0.78), rgba(18, 31, 66, 0.96)); border: 1px solid rgba(131, 151, 218, 0.14);
      }
      .scenario-card {
        padding: 18px; border-radius: 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(147, 170, 235, 0.22);
      }
      .scenario-card h3 { margin: 0 0 10px; color: #edf5ff; font-size: 1.4rem; }
      .scenario-card p { margin: 0; color: #d5e7ff; line-height: 1.7; }
      .scenario-note {
        display: grid; gap: 8px; padding: 14px 16px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(147, 170, 235, 0.2);
        color: #edf5ff; font-weight: 700;
      }
      .selected-summary { color: #dfe7ff; font-weight: 500; line-height: 1.6; }
      .diagram-node {
        display: inline-flex; align-items: center; justify-content: center; margin: 0 auto; min-width: 120px; height: 44px; border-radius: 12px;
        background: rgba(137, 162, 245, 0.12); border: 1px solid rgba(139, 168, 244, 0.26); color: #edf5ff; font-weight: 700;
      }
      .diagram-arrow { text-align: center; color: #bcd2ff; font-size: 1.4rem; }
      .resource-row {
        display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 10px;
      }
      .lower-row { margin-top: 10px; }
      .resource-card {
        width: 150px; height: 110px; border-radius: 18px; border: 2px solid rgba(140, 163, 214, 0.7); background: rgba(255,255,255,0.04);
        display: grid; place-items: center; transition: all 0.2s ease; box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
      }
      .resource-card.selected {
        box-shadow: 0 0 0 2px rgba(255,255,255,0.08), 0 18px 25px rgba(94, 122, 255, 0.12);
      }
      .resource-icon {
        width: 72px; height: 72px; border-radius: 16px; display: grid; place-items: center; font-size: 1.2rem; font-weight: 800; color: #fff;
      }
      .ec2 { background: linear-gradient(135deg, #f5b25d, #e88f39); }
      .rds { background: linear-gradient(135deg, #5ba1ff, #3d6fe8); }
      .s3 { background: linear-gradient(135deg, #55d7a3, #33b67f); }
      .lambda { background: linear-gradient(135deg, #ff7cc8, #ef5caf); }

      .bottom-actions {
        display: flex; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 18px;
      }
      .secondary-btn, .next-btn {
        border: 0; border-radius: 12px; padding: 12px 18px; font-weight: 700; cursor: pointer;
      }
      .secondary-btn { background: rgba(255,255,255,0.08); color: #edf5ff; border: 1px solid rgba(143, 168, 230, 0.24); }
      .next-btn { background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 35%, #ff73c9 100%); color: #fff; }
      .next-btn:disabled { opacity: .5; cursor: not-allowed; }
      .ai-badge { background: rgba(89, 212, 169, 0.18); color: #9df0cf; border: 1px solid rgba(89, 212, 169, 0.4); }
      .hint-box { border-color: rgba(255, 200, 110, 0.45); background: rgba(255, 190, 90, 0.08); }
      .finish-overlay { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 16px; background: rgba(7, 18, 40, 0.72); }
      .finish-card { width: min(560px, 100%); background: #fff; color: #1d2947; border-radius: 24px; padding: 26px; box-shadow: 0 30px 60px rgba(0,0,0,0.3); display: grid; gap: 14px; }
      .finish-card h2 { margin: 0; font-size: 1.5rem; letter-spacing: -0.03em; }
      .finish-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 8px; }
      .finish-stats div { background: #f2f5fc; border-radius: 14px; padding: 10px 12px; display: grid; gap: 2px; }
      .finish-stats span { font-size: 0.75rem; color: #5d6d8d; }
      .finish-stats strong { font-size: 1.15rem; font-variant-numeric: tabular-nums; }
      .finish-question { margin: 6px 0 0; font-weight: 700; }
      .stars { display: flex; gap: 6px; }
      .stars button { border: 0; background: none; font-size: 2rem; line-height: 1; color: #cfd6e6; cursor: pointer; padding: 2px; }
      .stars button.on { color: #ffb400; }
      .stars button:focus-visible { outline: 2px solid #7b61ff; border-radius: 6px; }
      .finish-error { margin: 0; color: #c2412d; font-weight: 600; }
      .finish-hint { margin: 0; color: #b46a00; font-size: 0.9rem; }
      .finish-actions { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
      .finish-actions .secondary-btn { color: #2e3f6d; border: 1px solid rgba(120, 140, 175, 0.7); background: #fff; }

      @media (max-width: 980px) {
        .simulation-shell { grid-template-columns: 1fr; }
        .mission-shell { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class SimulationPage implements OnInit {
  careers: CareerSpec[] = [
    {
      id: 'cloud-engineer',
      title: 'Cloud Engineer',
      accent: '#7a88ff',
      missions: [
        { id: 'cloud-engineer-lab-1', title: 'Lab 1', description: 'Cloud architecture', instruction: 'Your team needs to deploy a web application on AWS. Choose the right services for performance, security and reliability.', simulationType: 'architecture', availableServices: ['EC2', 'S3', 'RDS', 'Lambda', 'Load Balancer'], expectedServices: ['EC2', 'RDS', 'Load Balancer'], result: 'The right choice is EC2 for the app, RDS for the database and Load Balancer for traffic distribution.' },
        { id: 'cloud-engineer-lab-2', title: 'Lab 2', description: 'Resilience plan', instruction: 'Your application must remain stable during spikes and partial failures. Prioritize availability and recovery.', simulationType: 'scenario', availableServices: ['Auto Scaling', 'Multi-AZ Deployment', 'Backup Only', 'Single Node Only', 'Manual Restart'], expectedServices: ['Auto Scaling', 'Multi-AZ Deployment'], result: 'A resilient architecture relies on redundancy, balanced traffic and database stability.' },
        { id: 'cloud-engineer-lab-3', title: 'Lab 3', description: 'Cost optimization', instruction: 'Reduce cloud costs without harming login flows, service availability and security.', simulationType: 'problem', availableServices: ['Move static files to S3', 'Use Lambda for burst jobs', 'Keep all services on EC2 forever', 'Ignore storage lifecycle'], expectedServices: ['Move static files to S3', 'Use Lambda for burst jobs'], result: 'Storage and serverless compute are useful for reducing costs while keeping the app responsive.' },
        { id: 'cloud-engineer-lab-4', title: 'Lab 4', description: 'Security baseline', instruction: 'Build a secure baseline with reliable access, segmentation and data protection rules.', simulationType: 'quiz', availableServices: ['Least privilege IAM', 'Public DB access', 'Hardcoded secrets in code', 'No logging'], expectedServices: ['Least privilege IAM'], result: 'Security is strengthened by isolating traffic, securing data and protecting the service layer.' },
      ],
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      accent: '#53b5ff',
      missions: [
        { id: 'devops-engineer-lab-1', title: 'Lab 1', description: 'CI/CD pipeline', instruction: 'Build a deployment pipeline that automates tests and releases securely while keeping visibility on production health.', simulationType: 'architecture', availableServices: ['GitHub Actions', 'Jenkins', 'Docker', 'Kubernetes', 'Prometheus'], expectedServices: ['GitHub Actions', 'Docker', 'Kubernetes'], result: 'A strong DevOps setup uses GitHub Actions for automation, Docker for packaging and Kubernetes for orchestration.' },
        { id: 'devops-engineer-lab-2', title: 'Lab 2', description: 'Container orchestration', instruction: 'Deploy a set of services with consistent scaling and rollback readiness in production.', simulationType: 'scenario', availableServices: ['Helm values file', 'Manual deployments', 'Rollback plan', 'No health checks', 'No autoscaling'], expectedServices: ['Helm values file', 'Rollback plan', 'No health checks'], result: 'Containerization plus orchestration and monitoring create a resilient deployment model.' },
        { id: 'devops-engineer-lab-3', title: 'Lab 3', description: 'Incident response', instruction: 'When the app is failing, decide what to automate first to restore stability and learn quickly.', simulationType: 'problem', availableServices: ['Alert threshold increase', 'Trace logs + rollback', 'Delete traffic logs', 'Disable monitoring'], expectedServices: ['Trace logs + rollback'], result: 'Fast recovery depends on automation, observation and the ability to roll forward or backward safely.' },
      ],
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer',
      accent: '#56b6ff',
      missions: [
        { id: 'backend-developer-lab-1', title: 'Lab 1', description: 'Reliable API', instruction: 'Implement a secure backend for web and mobile clients with strong data handling and low response times.', simulationType: 'architecture', availableServices: ['API Gateway', 'EC2', 'RDS', 'Redis', 'Lambda'], expectedServices: ['API Gateway', 'RDS', 'Redis'], result: 'API Gateway centralizes requests, RDS persists data and Redis improves speed and caching.' },
        { id: 'backend-developer-lab-2', title: 'Lab 2', description: 'Auth & access', instruction: 'Protect sensitive endpoints and design a role-based access pattern that scales.', simulationType: 'quiz', availableServices: ['JWT with short expiry', 'Plain token in URL', 'No validation on roles', 'Shared admin credentials'], expectedServices: ['JWT with short expiry'], result: 'Authentication and secure service access need a gateway and secure request flow between services.' },
        { id: 'backend-developer-lab-3', title: 'Lab 3', description: 'Scaling service', instruction: 'Improve the backend design to handle growing traffic without increasing latency or failures.', simulationType: 'problem', availableServices: ['Cache hot reads', 'Queue bursts', 'Add more DB writes blindly', 'Disable rate limits'], expectedServices: ['Cache hot reads', 'Queue bursts'], result: 'Scaling requires a combination of request handling, persistence and serverless capacity for bursts.' },
      ],
    },
    {
      id: 'ux-researcher',
      title: 'UX Researcher',
      accent: '#ff7ac6',
      missions: [
        { id: 'ux-researcher-lab-1', title: 'Lab 1', description: 'User insights', instruction: 'Identify the strongest user pain points in a product and propose research actions that improve the experience.', simulationType: 'architecture', availableServices: ['User Interviews', 'Surveys', 'Personas', 'Usability Test', 'Journey Map'], expectedServices: ['User Interviews', 'Usability Test', 'Journey Map'], result: 'The best research flow combines interviews, usability testing and a journey map to reveal real bottlenecks.' },
        { id: 'ux-researcher-lab-2', title: 'Lab 2', description: 'Usability testing', instruction: 'Run a test to observe friction in the core user flow and convert it into design guidance.', simulationType: 'scenario', availableServices: ['Observe task completion', 'Ask leading questions during task', 'Skip testing and assume', 'Change the task during test'], expectedServices: ['Observe task completion', 'Ask leading questions during task'], result: 'A balanced UX study uses observation, user profile insight and direct survey feedback.' },
        { id: 'ux-researcher-lab-3', title: 'Lab 3', description: 'Journey improvement', instruction: 'Map the current experience to spot pain points and opportunities to simplify the journey.', simulationType: 'problem', availableServices: ['Simplify checkout steps', 'Keep all screens without insight', 'Ignore drop-off points', 'Remove help text'], expectedServices: ['Simplify checkout steps'], result: 'Mapping the journey exposes the moments where users hesitate, drop off or feel confused.' },
      ],
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      accent: '#8f82ff',
      missions: [
        { id: 'product-manager-lab-1', title: 'Lab 1', description: 'Product strategy', instruction: 'Choose the most valuable product initiative using user impact, revenue opportunity and delivery capacity.', simulationType: 'architecture', availableServices: ['Roadmap', 'Prioritization', 'Metrics', 'Feature Brief', 'Customer Feedback'], expectedServices: ['Roadmap', 'Metrics', 'Customer Feedback'], result: 'A good product decision balances roadmap clarity, measurable metrics and real customer insights.' },
        { id: 'product-manager-lab-2', title: 'Lab 2', description: 'Prioritization', instruction: 'Select the feature set that creates value with the least delivery risk and strongest user demand.', simulationType: 'quiz', availableServices: ['Attack only the biggest feature', 'Use impact, effort and user value', 'Build everything at once', 'Ignore customer research'], expectedServices: ['Use impact, effort and user value'], result: 'Strong prioritization uses impact, effort and clear feature framing to turn strategy into action.' },
        { id: 'product-manager-lab-3', title: 'Lab 3', description: 'Feature validation', instruction: 'Validate whether the product decision is solving the right problem for users and the business.', simulationType: 'problem', availableServices: ['Pilot with users and adjust', 'Ship without testing', 'Skip metrics', 'Ignore feedback'], expectedServices: ['Pilot with users and adjust'], result: 'Validation depends on customer signals, measurable outcomes and a coherent roadmap.' },
      ],
    },
    {
      id: 'data-analyst',
      title: 'Data Scientist',
      accent: '#ffb454',
      missions: [
        { id: 'data-analyst-lab-1', title: 'Lab 1', description: 'KPI dashboard', simulationType: 'problem', instruction: 'Turn raw business data into a dashboard that supports growth decisions and identifies priorities.', availableServices: ['Power BI', 'SQL', 'Looker', 'Metrics', 'Dashboard'], expectedServices: ['Power BI', 'SQL', 'Metrics'], result: 'SQL extracts the data, Power BI turns it into insights and the KPI list supports faster business decisions.' },
        { id: 'data-analyst-lab-2', title: 'Lab 2', description: 'Trend analysis', simulationType: 'problem', instruction: 'Identify which product or user trends matter most and explain the likely drivers behind them.', availableServices: ['Power BI', 'SQL', 'Looker', 'Metrics', 'Dashboard'], expectedServices: ['SQL', 'Dashboard', 'Metrics'], result: 'Trend analysis becomes clear when you combine time-based trends, metrics and visual storytelling.' },
        { id: 'data-analyst-lab-3', title: 'Lab 3', description: 'Insight report', simulationType: 'problem', instruction: 'Draft a short, decision-ready report that explains findings and recommended action.', availableServices: ['Power BI', 'SQL', 'Looker', 'Metrics', 'Dashboard'], expectedServices: ['Dashboard', 'Metrics', 'Looker'], result: 'The clearest insight reports condense the story into key numbers, context and direction.' },
      ],
    },
    {
      id: 'cybersecurity-analyst',
      title: 'Cybersecurity Analyst',
      accent: '#59d4a9',
      missions: [
        { id: 'cybersecurity-analyst-lab-1', title: 'Lab 1', description: 'Threat protection', instruction: 'Protect a system from common attack patterns and select the controls that reduce the most risk.', availableServices: ['IAM', 'Firewall', 'WAF', 'SIEM', 'Zero Trust'], expectedServices: ['IAM', 'Firewall', 'SIEM'], result: 'Identity controls, firewall rules and SIEM monitoring create the first layers of effective protection.' },
        { id: 'cybersecurity-analyst-lab-2', title: 'Lab 2', description: 'Access control', instruction: 'Reduce exposure by managing permissions, privileged access and user segmentation correctly.', availableServices: ['IAM', 'Firewall', 'WAF', 'SIEM', 'Zero Trust'], expectedServices: ['IAM', 'Zero Trust', 'SIEM'], result: 'Strong access control reduces risk and keeps sensitive assets protected even during compromise attempts.' },
        { id: 'cybersecurity-analyst-lab-3', title: 'Lab 3', description: 'Detection setup', instruction: 'Enable detection and escalation choices that catch suspicious behavior before it spreads.', availableServices: ['IAM', 'Firewall', 'WAF', 'SIEM', 'Zero Trust'], expectedServices: ['WAF', 'SIEM', 'Zero Trust'], result: 'WAF rules, SIEM alerts and zero-trust enforcement create a defense-in-depth model.' },
      ],
    },
    {
      id: 'ai-engineer',
      title: 'AI Engineer',
      accent: '#7a6bff',
      missions: [
        { id: 'ai-engineer-lab-1', title: 'Lab 1', description: 'Model workflow', instruction: 'Design an AI pipeline that uses data, training and validation to improve prediction quality.', availableServices: ['TensorFlow', 'OpenAI API', 'Data Pipeline', 'Model Monitor', 'NLP'], expectedServices: ['Data Pipeline', 'Model Monitor', 'OpenAI API'], result: 'A workable AI workflow needs clean data flow, model monitoring and a reliable inference layer.' },
        { id: 'ai-engineer-lab-2', title: 'Lab 2', description: 'Prompt design', instruction: 'Craft prompts and response constraints that improve quality, reliability and consistency.', availableServices: ['TensorFlow', 'OpenAI API', 'Data Pipeline', 'Model Monitor', 'NLP'], expectedServices: ['OpenAI API', 'NLP', 'Model Monitor'], result: 'Strong prompt design improves output relevance while monitoring helps keep it reliable.' },
        { id: 'ai-engineer-lab-3', title: 'Lab 3', description: 'Monitoring model', instruction: 'Track drift, quality and production changes to preserve trust in model output.', availableServices: ['TensorFlow', 'OpenAI API', 'Data Pipeline', 'Model Monitor', 'NLP'], expectedServices: ['Model Monitor', 'Data Pipeline', 'OpenAI API'], result: 'Monitoring production output requires both measurement and continuous feedback from the data pipeline.' },
      ],
    },
    {
      id: 'mobile-developer',
      title: 'Mobile Developer',
      accent: '#ff8a8a',
      missions: [
        { id: 'mobile-developer-lab-1', title: 'Lab 1', description: 'Mobile app flow', instruction: 'Design a mobile app flow that keeps navigation easy, fast and functional on customer journeys.', availableServices: ['Flutter', 'React Native', 'Firebase', 'Push Notifications', 'Analytics'], expectedServices: ['Flutter', 'Firebase', 'Analytics'], result: 'The right setup combines a cross-platform UI stack, Firebase backend services and analytics for improvement.' },
        { id: 'mobile-developer-lab-2', title: 'Lab 2', description: 'Offline support', instruction: 'Improve user trust by making the app resilient to connectivity loss or slow networks.', availableServices: ['Flutter', 'React Native', 'Firebase', 'Push Notifications', 'Analytics'], expectedServices: ['Firebase', 'Analytics', 'Push Notifications'], result: 'Offline support and good sync patterns preserve trust while notifications keep engagement alive.' },
        { id: 'mobile-developer-lab-3', title: 'Lab 3', description: 'App performance', instruction: 'Improve responsiveness and reduce friction for a smooth mobile experience.', availableServices: ['Flutter', 'React Native', 'Firebase', 'Push Notifications', 'Analytics'], expectedServices: ['React Native', 'Analytics', 'Firebase'], result: 'Mobile performance is best improved with a strong UI stack, clear analytics and optimized backend calls.' },
      ],
    },
    {
      id: 'healthcare-analyst',
      title: 'Healthcare Analyst',
      accent: '#64d5c6',
      missions: [
        { id: 'healthcare-analyst-lab-1', title: 'Lab 1', description: 'Care outcome analysis', instruction: 'Analyze healthcare data to identify trends in patient outcomes and operational efficiency.', availableServices: ['Clinical Data', 'Claims', 'KPI Scorecard', 'Dashboard', 'Patient Insights'], expectedServices: ['Clinical Data', 'KPI Scorecard', 'Dashboard'], result: 'Healthcare analysis becomes actionable when it combines clinical data, KPI tracking and performance dashboards.' },
        { id: 'healthcare-analyst-lab-2', title: 'Lab 2', description: 'Patient flow', instruction: 'Analyze bottlenecks in patient journeys and identify decisions that improve care experiences.', availableServices: ['Clinical Data', 'Claims', 'KPI Scorecard', 'Dashboard', 'Patient Insights'], expectedServices: ['Patient Insights', 'Dashboard', 'Clinical Data'], result: 'Patient flow analysis needs a view of service timing, outcomes and patient experience.' },
        { id: 'healthcare-analyst-lab-3', title: 'Lab 3', description: 'Resource planning', instruction: 'Match staff and equipment availability to patient load and service demand across the week.', availableServices: ['Clinical Data', 'Claims', 'KPI Scorecard', 'Dashboard', 'Patient Insights'], expectedServices: ['Dashboard', 'KPI Scorecard', 'Claims'], result: 'Resource planning becomes practical when demand, cost and capacity are aligned in one logic model.' },
      ],
    },
    {
      id: 'graphic-designer',
      title: 'Graphic Designer',
      accent: '#ff9ed1',
      missions: [
        { id: 'graphic-designer-lab-1', title: 'Lab 1', description: 'Brand design', instruction: 'Create clean visual direction for a product or campaign using hierarchy, branding and strong aesthetics.', availableServices: ['Figma', 'Brand Kit', 'Layout Grid', 'Typography', 'Color Palette'], expectedServices: ['Figma', 'Brand Kit', 'Color Palette'], result: 'A strong design system balances a clear brand kit, cohesive colors and strong visual structure.' },
        { id: 'graphic-designer-lab-2', title: 'Lab 2', description: 'Visual hierarchy', instruction: 'Organize content to help the user read quickly and focus on the most important message first.', availableServices: ['Figma', 'Brand Kit', 'Layout Grid', 'Typography', 'Color Palette'], expectedServices: ['Typography', 'Layout Grid', 'Color Palette'], result: 'Visual hierarchy gives the design clarity and makes the main message easier to understand.' },
        { id: 'graphic-designer-lab-3', title: 'Lab 3', description: 'Campaign concept', instruction: 'Create a clear creative concept that tells a story with a strong emotional and visual direction.', availableServices: ['Figma', 'Brand Kit', 'Layout Grid', 'Typography', 'Color Palette'], expectedServices: ['Brand Kit', 'Typography', 'Layout Grid'], result: 'A campaign becomes memorable when the visual language supports a clear, consistent story.' },
      ],
    },
    {
      id: 'business-analyst',
      title: 'Business Analyst',
      accent: '#77c2ff',
      missions: [
        { id: 'business-analyst-lab-1', title: 'Lab 1', description: 'Process optimization', instruction: 'Identify bottlenecks in a process and propose a solution that creates value for the teams and clients.', availableServices: ['Process Map', 'Requirements', 'Gap Analysis', 'KPIs', 'Stakeholder Notes'], expectedServices: ['Process Map', 'Gap Analysis', 'KPIs'], result: 'The best business analysis starts by mapping the process, identifying gaps and measuring the improvement with KPIs.' },
        { id: 'business-analyst-lab-2', title: 'Lab 2', description: 'Requirements mapping', instruction: 'Translate business needs into exact requirements and clear acceptance criteria.', availableServices: ['Process Map', 'Requirements', 'Gap Analysis', 'KPIs', 'Stakeholder Notes'], expectedServices: ['Requirements', 'Stakeholder Notes', 'Gap Analysis'], result: 'Requirements become actionable when they reflect stakeholder intent, gaps and measurable outcomes.' },
        { id: 'business-analyst-lab-3', title: 'Lab 3', description: 'Decision support', instruction: 'Support a strategic decision using evidence, priorities and the right business metrics.', availableServices: ['Process Map', 'Requirements', 'Gap Analysis', 'KPIs', 'Stakeholder Notes'], expectedServices: ['KPIs', 'Gap Analysis', 'Stakeholder Notes'], result: 'Decision support is strongest when metrics, gaps and stakeholder insight are aligned.' },
      ],
    },
    {
      id: 'frontend-developer',
      title: 'Frontend/Web Developer',
      accent: '#ff9f6b',
      missions: [
        { id: 'frontend-developer-lab-1', title: 'Lab 1', description: 'Responsive landing page', simulationType: 'scenario', instruction: 'Build a landing page that looks right on phones, tablets and large screens.', availableServices: ['Semantic HTML', 'CSS Grid / Flexbox', 'Media queries', 'Fixed pixel widths everywhere', 'Tables for layout'], expectedServices: ['Semantic HTML', 'CSS Grid / Flexbox', 'Media queries'], result: 'Semantic HTML gives structure, Grid and Flexbox handle the layout, and media queries adapt it to each screen.' },
        { id: 'frontend-developer-lab-2', title: 'Lab 2', description: 'Accessible form', simulationType: 'quiz', instruction: 'A sign-up form must be usable with a keyboard and a screen reader. Pick the right practices.', availableServices: ['Labels linked to inputs', 'Visible focus states', 'Placeholder instead of label', 'Error message next to the field', 'Color-only error signal'], expectedServices: ['Labels linked to inputs', 'Visible focus states', 'Error message next to the field'], result: 'Linked labels, visible focus and clear error text make the form usable by everyone.' },
        { id: 'frontend-developer-lab-3', title: 'Lab 3', description: 'Page performance', simulationType: 'problem', instruction: 'The home page takes 6 seconds to load on mobile. Choose the fixes with the biggest effect.', availableServices: ['Lazy-load images', 'Minify and bundle assets', 'Load every script in the head', 'Compress images', 'Add more web fonts'], expectedServices: ['Lazy-load images', 'Minify and bundle assets', 'Compress images'], result: 'Lighter images loaded only when needed and smaller bundles cut most of the loading time.' },
      ],
    },
    {
      id: 'database-administrator',
      title: 'Database Administrator',
      accent: '#5ba1ff',
      missions: [
        { id: 'database-administrator-lab-1', title: 'Lab 1', description: 'Slow query', simulationType: 'problem', instruction: 'A report query now takes 40 seconds. Find what to do first.', availableServices: ['Add an index on the filtered column', 'Read the EXPLAIN plan', 'SELECT * everywhere', 'Add more RAM blindly', 'Avoid functions on indexed columns'], expectedServices: ['Add an index on the filtered column', 'Read the EXPLAIN plan', 'Avoid functions on indexed columns'], result: 'The execution plan shows the full scan; the right index, used without wrapping functions, removes it.' },
        { id: 'database-administrator-lab-2', title: 'Lab 2', description: 'Backup strategy', simulationType: 'scenario', instruction: 'Design a backup plan so that no more than 5 minutes of data can ever be lost.', availableServices: ['Daily full backup', 'Point-in-time recovery logs', 'Test restores regularly', 'Keep backups on the same disk', 'Back up once a year'], expectedServices: ['Daily full backup', 'Point-in-time recovery logs', 'Test restores regularly'], result: 'Full backups plus transaction logs allow point-in-time recovery, and only tested restores prove it works.' },
        { id: 'database-administrator-lab-3', title: 'Lab 3', description: 'Access control', simulationType: 'quiz', instruction: 'Three applications share one database server. Secure who can access what.', availableServices: ['One role per application', 'Least privilege grants', 'Shared root password', 'Audit logging', 'Public database port'], expectedServices: ['One role per application', 'Least privilege grants', 'Audit logging'], result: 'Separate roles with minimal rights and an audit trail limit the damage of any leak.' },
      ],
    },
    {
      id: 'network-admin',
      title: 'System/Network Admin',
      accent: '#59d4a9',
      missions: [
        { id: 'network-admin-lab-1', title: 'Lab 1', description: 'Office network', simulationType: 'scenario', instruction: 'Set up the network of a 60-person office with separate teams.', availableServices: ['VLAN per department', 'DHCP server', 'Flat network for everyone', 'Firewall between VLANs', 'Static IP typed by each user'], expectedServices: ['VLAN per department', 'DHCP server', 'Firewall between VLANs'], result: 'VLANs separate the teams, DHCP assigns addresses automatically, and the firewall controls traffic between them.' },
        { id: 'network-admin-lab-2', title: 'Lab 2', description: 'Connectivity incident', simulationType: 'problem', instruction: 'Users cannot reach the intranet server. Choose your first diagnostic steps.', availableServices: ['Ping the gateway', 'Traceroute to the server', 'Check DNS resolution', 'Reboot every switch', 'Disable the firewall'], expectedServices: ['Ping the gateway', 'Traceroute to the server', 'Check DNS resolution'], result: 'Testing layer by layer (gateway, route, name resolution) locates the fault without breaking anything else.' },
        { id: 'network-admin-lab-3', title: 'Lab 3', description: 'Remote access', simulationType: 'quiz', instruction: 'Staff must reach internal servers from home safely.', availableServices: ['VPN for remote staff', 'MFA for VPN users', 'Open RDP to the internet', 'Telnet for administration', 'SSH with keys'], expectedServices: ['VPN for remote staff', 'MFA for VPN users', 'SSH with keys'], result: 'An MFA-protected VPN and key-based SSH keep remote access encrypted and hard to abuse.' },
      ],
    },
    {
      id: 'qa-engineer',
      title: 'QA/Test Engineer',
      accent: '#a78bff',
      missions: [
        { id: 'qa-engineer-lab-1', title: 'Lab 1', description: 'Test plan', simulationType: 'scenario', instruction: 'A payment feature ships next week. Choose the test levels to plan.', availableServices: ['Unit tests', 'Integration tests', 'End-to-end tests', 'Test only in production', 'Skip regression tests'], expectedServices: ['Unit tests', 'Integration tests', 'End-to-end tests'], result: 'The test pyramid checks each function, how parts work together, and the full user journey.' },
        { id: 'qa-engineer-lab-2', title: 'Lab 2', description: 'Bug report', simulationType: 'quiz', instruction: 'You found a crash in checkout. Choose what your bug report must contain.', availableServices: ['Steps to reproduce', 'Expected vs actual result', 'Environment and version', '“It does not work”', 'Blame the developer'], expectedServices: ['Steps to reproduce', 'Expected vs actual result', 'Environment and version'], result: 'A good report lets anyone reproduce the bug and see exactly what went wrong, where.' },
        { id: 'qa-engineer-lab-3', title: 'Lab 3', description: 'Test automation', simulationType: 'problem', instruction: 'The automated suite fails randomly and nobody trusts it. Fix it.', availableServices: ['Run tests in CI on every commit', 'Stable test data', 'Fix flaky tests', 'Sleep 30 s in every test', 'Automate only manual clicks'], expectedServices: ['Run tests in CI on every commit', 'Stable test data', 'Fix flaky tests'], result: 'Reliable data, no flaky tests and a run on every commit make the suite trustworthy again.' },
      ],
    },
  ];

  currentCareerId = 'cloud-engineer';
  currentMissionIndex = 0;
  selectedServices: string[] = [];
  feedbackText = '';
  isValid = false;
  currentUserName = 'User';
  currentUserRole = 'Student';
  userInitials = 'U';
  userAvatar = '';

  // Mesures envoyées au modèle CareerNet à la fin d'un lab analysé par l'IA
  labStartedAt = Date.now();
  labFinishedAt = 0;
  validations: number[] = [];
  missionScores: number[] = [];
  hintShown: boolean[] = [];
  finishing = false;
  enjoyment = 0;
  submitting = false;
  submitError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private careerAi: CareerAiService,
  ) {}

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

    this.route.queryParams.subscribe((params) => {
      const career = params['career'] || 'cloud-engineer';
      const mission = params['mission'] || 'cloud-mission-1';
      this.currentCareerId = career;
      const currentCareer = this.getCareerById(career) ?? this.careers[0];
      const index = currentCareer.missions.findIndex((item) => item.id === mission);
      this.currentMissionIndex = index >= 0 ? index : 0;
      this.selectedServices = [];
      this.feedbackText = '';
      this.isValid = false;
      this.resetLabTracking();
    });
  }

  private resetLabTracking(): void {
    const n = this.currentCareer.missions.length;
    this.labStartedAt = Date.now();
    this.labFinishedAt = 0;
    this.validations = new Array(n).fill(0);
    this.missionScores = new Array(n).fill(0);
    this.hintShown = new Array(n).fill(false);
    this.finishing = false;
    this.enjoyment = 0;
    this.submitError = '';
  }

  get isAiLab(): boolean {
    return !!AI_LABS[this.currentCareerId];
  }

  get hintsUsed(): number {
    return this.hintShown.filter(Boolean).length;
  }

  get totalValidations(): number {
    return this.validations.reduce((a, b) => a + b, 0);
  }

  get missionsCorrect(): number {
    return this.missionScores.filter((s) => s === 100).length;
  }

  get labScore(): number {
    return this.missionScores.reduce((a, b) => a + b, 0) / Math.max(1, this.missionScores.length);
  }

  get elapsedSeconds(): number {
    return Math.max(1, Math.round(((this.labFinishedAt || Date.now()) - this.labStartedAt) / 1000));
  }

  get elapsedLabel(): string {
    const s = this.elapsedSeconds;
    return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`;
  }

  showHint(): void {
    this.hintShown[this.currentMissionIndex] = true;
  }

  currentHint(): string {
    const expected = this.currentMission.expectedServices;
    return `${expected.length} réponses sont attendues. L’une d’elles est « ${expected[0]} ».`;
  }

  submitLab(): void {
    this.submitting = true;
    this.submitError = '';
    this.careerAi.submitLabAttempt({
      career_id: this.currentCareerId,
      mission_count: this.currentCareer.missions.length,
      missions_correct: this.missionsCorrect,
      score: Math.round(this.labScore * 10) / 10,
      duration_seconds: this.elapsedSeconds,
      validations: Math.max(this.totalValidations, this.currentCareer.missions.length),
      hints_used: this.hintsUsed,
      enjoyment: this.enjoyment,
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl('/dashboard/results');
      },
      error: (err) => {
        this.submitting = false;
        const detail = err?.error;
        this.submitError = detail && typeof detail === 'object'
          ? Object.values(detail).flat().join(' ')
          : 'Could not save the lab. Check that the backend is running.';
      },
    });
  }

  get currentCareer(): CareerSpec {
    return this.getCareerById(this.currentCareerId) ?? this.careers[0];
  }

  get currentMission(): MissionSpec {
    return this.currentCareer.missions[this.currentMissionIndex];
  }

  private getInitials(firstName: string, lastName: string): string {
    return `${(firstName || '').charAt(0) || 'U'}${(lastName || '').charAt(0) || ''}`.toUpperCase();
  }

  get isLastMission(): boolean {
    return this.currentMissionIndex === this.currentCareer.missions.length - 1;
  }

  getCareerById(id: string): CareerSpec | undefined {
    return this.careers.find((career) => career.id === id);
  }

  toggleService(service: string): void {
    if (this.selectedServices.includes(service)) {
      this.selectedServices = this.selectedServices.filter((item) => item !== service);
      return;
    }

    this.selectedServices = [...this.selectedServices, service];
  }

  getSimulationTitle(): string {
    const type = this.currentMission.simulationType ?? 'architecture';
    const map: Record<string, string> = {
      architecture: 'Votre architecture',
      scenario: 'Scénario à résoudre',
      problem: 'Résolution de problème',
      quiz: 'Question à choix unique',
    };
    return map[type] ?? 'Votre architecture';
  }

  getSelectionLabel(): string {
    const type = this.currentMission.simulationType ?? 'architecture';
    const map: Record<string, string> = {
      architecture: 'Services disponibles',
      scenario: 'Actions à choisir',
      problem: 'Solutions possibles',
      quiz: 'Choix possibles',
    };
    return map[type] ?? 'Services disponibles';
  }

  currentMissionOptions(): string[] {
    return this.currentMission.solutionOptions ?? this.currentMission.availableServices;
  }

  getServiceColor(service: string): string {
    const mapping: Record<string, string> = {
      EC2: '#f5b25d',
      RDS: '#5ba1ff',
      S3: '#55d7a3',
      Lambda: '#ff7cc8',
      'Load Balancer': '#8ea8ff',
      'API Gateway': '#7aa3ff',
      Redis: '#3ec7c1',
      'GitHub Actions': '#6bcbff',
      Jenkins: '#d08cff',
      Docker: '#4ad8d8',
      Kubernetes: '#69a7ff',
      Prometheus: '#ffb157',
      'User Interviews': '#7dd0ff',
      Surveys: '#ff93d3',
      Personas: '#9aa3ff',
      'Usability Test': '#59d4a9',
      'Journey Map': '#8ac5ff',
      Roadmap: '#a77dff',
      Prioritization: '#ffb470',
      Metrics: '#6edeae',
      'Feature Brief': '#8daeff',
      'Customer Feedback': '#f88ec3',
      'Power BI': '#ffb157',
      SQL: '#63b7ff',
      Looker: '#6ed7c9',
      Dashboard: '#72a8ff',
      IAM: '#8ad5ff',
      Firewall: '#5cd4ae',
      WAF: '#ff8aaa',
      SIEM: '#a78bff',
      'Zero Trust': '#7cc8ff',
      TensorFlow: '#ff9d66',
      'OpenAI API': '#7cb6ff',
      'Data Pipeline': '#65d7cf',
      'Model Monitor': '#ffb56b',
      NLP: '#9fe1ff',
      Flutter: '#63c4ff',
      'React Native': '#88a3ff',
      Firebase: '#f0b35b',
      'Push Notifications': '#ff86c4',
      Analytics: '#66d5b5',
      'Clinical Data': '#5ec7ff',
      Claims: '#ffb56b',
      'KPI Scorecard': '#7f8cff',
      'Patient Insights': '#64d9b7',
      Figma: '#f6a9d9',
      'Brand Kit': '#7cc5ff',
      'Layout Grid': '#8bc3ff',
      Typography: '#ffb26e',
      'Color Palette': '#7bd9c3',
      'Process Map': '#7cbaff',
      Requirements: '#ff9bb1',
      'Gap Analysis': '#a892ff',
      KPIs: '#79d9b8',
      'Stakeholder Notes': '#8bb0ff',
      'Auto Scaling': '#74d3ff',
      'Multi-AZ Deployment': '#7fbbff',
      'Backup Only': '#ff9f8f',
      'Single Node Only': '#ff82ad',
      'Manual Restart': '#f7bb65',
      'Helm values file': '#8ab4ff',
      'Rollback plan': '#86d8b3',
      'No health checks': '#ff8a7d',
      'Alert threshold increase': '#ffb57d',
      'Trace logs + rollback': '#7dc9ff',
      'Disable monitoring': '#ff7ab2',
      'Move static files to S3': '#7bd9b5',
      'Use Lambda for burst jobs': '#8db6ff',
      'Keep all services on EC2 forever': '#ff9b9b',
      'Ignore storage lifecycle': '#ffbb78',
      'Least privilege IAM': '#6ee0b7',
      'Public DB access': '#ff8f9d',
      'Hardcoded secrets in code': '#ffb4c6',
      'No logging': '#f7b979',
      'JWT with short expiry': '#84d6ff',
      'Plain token in URL': '#ff8dc7',
      'No validation on roles': '#ffa072',
      'Shared admin credentials': '#ff7d71',
      'Cache hot reads': '#89d5ff',
      'Queue bursts': '#8ee6c7',
      'Add more DB writes blindly': '#ffb268',
      'Disable rate limits': '#ff7bb9',
      'Observe task completion': '#75d7ff',
      'Ask leading questions during task': '#85a6ff',
      'Skip testing and assume': '#ff8f8a',
      'Change the task during test': '#f8c06b',
      'Simplify checkout steps': '#7fd4c1',
      'Keep all screens without insight': '#ff9fa8',
      'Ignore drop-off points': '#ffb67b',
      'Remove help text': '#ff7fb8',
      'Use impact, effort and user value': '#7ac9ff',
      'Attack only the biggest feature': '#ffb679',
      'Build everything at once': '#ff8a8a',
      'Ignore customer research': '#f6a7d5',
      'Pilot with users and adjust': '#8ed6bb',
      'Ship without testing': '#ff8f9e',
      'Skip metrics': '#ffbe7d',
      'Ignore feedback': '#f0a0d8',
    };
    return mapping[service] || '#96b2ff';
  }

  validateArchitecture(): void {
    const expected = new Set(this.currentMission.expectedServices);
    const chosen = new Set(this.selectedServices);
    if (!chosen.size) {
      this.isValid = false;
      this.feedbackText = 'Sélectionnez au moins un élément avant de valider.';
      return;
    }
    // Score de la mission = recouvrement entre la sélection et la bonne réponse (indice de Jaccard)
    const common = [...chosen].filter((service) => expected.has(service)).length;
    const score = (100 * common) / new Set([...expected, ...chosen]).size;
    const valid = score === 100;

    this.validations[this.currentMissionIndex] += 1;
    this.missionScores[this.currentMissionIndex] = score;
    this.isValid = valid;
    this.feedbackText = valid
      ? this.currentMission.result
      : common === expected.size
        ? 'Les bons éléments sont là, mais certains choix en trop sont inutiles ou risqués.'
        : 'Votre choix est incomplet. Sélectionnez les éléments les plus pertinents pour cette simulation.';
  }

  nextMission(): void {
    if (!this.validations[this.currentMissionIndex]) {
      this.isValid = false;
      this.feedbackText = 'Validez votre réponse avant de passer à la suite.';
      return;
    }

    if (this.currentMissionIndex < this.currentCareer.missions.length - 1) {
      this.currentMissionIndex += 1;
      this.selectedServices = [];
      this.feedbackText = '';
      this.isValid = false;
      return;
    }

    if (this.isAiLab) {
      this.labFinishedAt = Date.now();
      this.finishing = true;
      return;
    }

    this.router.navigateByUrl('/dashboard/career-lab');
  }

  goBack(): void {
    this.router.navigateByUrl('/dashboard/career-lab');
  }
}

