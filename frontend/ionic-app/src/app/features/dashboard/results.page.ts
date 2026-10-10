import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AI_LABS, CAREER_INFO, CareerAiService, LabAttemptsSummary, Recommendation, StudentProfile,
} from '../../core/services/career-ai.service';

/** Résultats du modèle CareerNet : état du dossier, lancement de l'analyse, top-3 et classement complet. */
@Component({
  selector: 'app-results-page',
  template: `
    <app-shell active="results" title="AI Results">
      <section class="intro card">
        <div>
          <p class="eyebrow">Step 3 of 3</p>
          <h1>Your AI career recommendation</h1>
          <p class="lead">
            CareerNet, a deep learning model, reads your assessment and your Career Lab results
            and ranks the 9 IT careers. The more labs you complete, the more reliable the result.
          </p>
        </div>
        <button class="primary-btn" type="button" (click)="run()" [disabled]="running || !ready">
          {{ running ? 'Analysing…' : recommendation ? 'Run the analysis again' : 'Run the AI analysis' }}
        </button>
      </section>

      <div class="status error" *ngIf="error">{{ error }}</div>

      <section class="readiness" *ngIf="!loading">
        <article class="card step" [class.done]="completion === 100">
          <div class="step-head">
            <span class="badge">{{ completion === 100 ? '✓' : '1' }}</span>
            <h2>Assessment</h2>
          </div>
          <div class="meter"><div class="meter-fill" [style.width.%]="completion"></div></div>
          <p>{{ completion }}% answered. {{ completion === 100 ? 'Ready.' : 'All answers are needed before the analysis.' }}</p>
          <button class="secondary-btn" type="button" routerLink="/dashboard/assessment">
            {{ completion === 100 ? 'Review answers' : 'Complete the assessment' }}
          </button>
        </article>

        <article class="card step labs-step" [class.done]="labsDone > 0">
          <div class="step-head">
            <span class="badge">{{ labsDone > 0 ? '✓' : '2' }}</span>
            <h2>Career Labs</h2>
            <span class="count">{{ labsDone }}/9 done</span>
          </div>
          <ul class="lab-list">
            <li *ngFor="let lab of labRows" [class.done]="lab.score !== null">
              <span class="lab-name">{{ lab.career }}</span>
              <span class="lab-score" *ngIf="lab.score !== null">{{ lab.score | number:'1.0-0' }}/100</span>
              <button *ngIf="lab.score === null" class="link-btn" type="button" (click)="openLab(lab.careerId)">Start</button>
            </li>
          </ul>
          <p class="note">Optional but recommended: with 4 labs or more the model is clearly more accurate.</p>
        </article>
      </section>

      <ng-container *ngIf="recommendation as rec">
        <section class="card">
          <div class="section-head">
            <h2>Your top 3 careers</h2>
            <small>Analysed {{ rec.created_at | date:'d MMM y, HH:mm' }} · {{ rec.labs_used.length }} lab{{ rec.labs_used.length === 1 ? '' : 's' }} used</small>
          </div>
          <div class="top3">
            <article class="career" *ngFor="let c of rec.top_careers; let i = index" [class.first]="i === 0">
              <div class="career-head">
                <span class="rank">#{{ i + 1 }}</span>
                <span class="icon">{{ info(c.career).icon }}</span>
              </div>
              <h3>{{ c.career }}</h3>
              <div class="pct">{{ c.probability * 100 | number:'1.0-1' }}%</div>
              <p>{{ info(c.career).summary }}</p>
              <div class="tags"><span *ngFor="let t of info(c.career).tags">{{ t }}</span></div>
              <button class="secondary-btn small" type="button" (click)="openLab(info(c.career).careerId)">
                {{ hasLab(info(c.career).careerId) ? 'Retry its lab' : 'Try its lab' }}
              </button>
            </article>
          </div>
          <p class="note" *ngIf="rec.top_careers[0].probability > 0.9 && rec.top_careers[1].probability < 0.05">
            The model is very confident. It tends to be over-confident on profiles between two careers,
            so read the 2nd and 3rd choices too.
          </p>
        </section>

        <section class="card">
          <div class="section-head">
            <h2>All 9 careers</h2>
            <small>Probability given by the model (total = 100%)</small>
          </div>
          <div class="ranking">
            <div class="row" *ngFor="let c of rec.ranking">
              <span class="row-label">{{ c.career }}</span>
              <div class="bar"><div class="bar-fill" [style.width.%]="c.probability * 100"></div></div>
              <span class="row-value">{{ c.probability * 100 | number:'1.1-1' }}%</span>
            </div>
          </div>
        </section>
      </ng-container>

      <section class="card empty" *ngIf="!loading && !recommendation">
        <h2>No analysis yet</h2>
        <p>Complete the assessment, try a few Career Labs, then press “Run the AI analysis”.</p>
      </section>

      <p class="disclaimer">
        CareerNet was trained on 5,000 simulated students built from the O*NET occupation database
        (macro-F1 0.90, right career in the top 3 for 98.9% of test students). Use it as guidance, not as a verdict.
      </p>
    </app-shell>
  `,
  styles: [`
    .card { background: rgba(255,255,255,0.82); border: 1px solid rgba(138, 153, 210, 0.36); border-radius: 22px; padding: 22px 24px; box-shadow: 0 16px 28px rgba(76, 93, 141, 0.06); }
    .intro { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
    .eyebrow { margin: 0 0 8px; color: #5b6bc5; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; font-weight: 800; }
    h1 { margin: 0; font-size: clamp(1.8rem, 3vw, 2.6rem); letter-spacing: -0.04em; color: #1d2947; }
    h2 { margin: 0; font-size: 1.25rem; letter-spacing: -0.02em; }
    h3 { margin: 6px 0 0; font-size: 1.1rem; }
    .lead { margin: 10px 0 0; color: #4f607d; line-height: 1.6; max-width: 660px; }
    .readiness { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 18px; }
    .step { display: grid; gap: 12px; align-content: start; }
    .step-head { display: flex; align-items: center; gap: 10px; }
    .badge { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #e5e9f8; color: #4b4fd6; font-weight: 800; }
    .step.done .badge { background: #1a8f63; color: #fff; }
    .count { margin-left: auto; font-weight: 700; color: #4b4fd6; }
    .meter { height: 10px; background: #e5e9f8; border-radius: 99px; overflow: hidden; }
    .meter-fill { height: 100%; background: linear-gradient(90deg, #5b7dff, #7b61ff); border-radius: 99px; }
    .step p { margin: 0; color: #4f607d; }
    .lab-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 8px; }
    .lab-list li { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 9px 12px; border-radius: 12px; background: #f3f6fc; border: 1px solid #e3e8f4; }
    .lab-list li.done { background: #e6f5ee; border-color: #bfe5d2; }
    .lab-name { font-weight: 600; font-size: 0.93rem; }
    .lab-score { font-weight: 800; color: #1a8f63; font-variant-numeric: tabular-nums; }
    .link-btn { border: 0; background: none; color: #4b4fd6; font-weight: 700; cursor: pointer; padding: 0; }
    .note { margin: 0; color: #5d6d8d; font-size: 0.92rem; }
    .section-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
    .section-head small { color: #5d6d8d; }
    .top3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 12px; }
    .career { border: 1px solid #dfe5f3; border-radius: 18px; padding: 18px; display: grid; gap: 8px; align-content: start; background: #fff; }
    .career.first { border-color: #8a8ff7; box-shadow: 0 12px 26px rgba(107, 108, 246, 0.16); }
    .career-head { display: flex; justify-content: space-between; align-items: center; }
    .rank { font-weight: 800; color: #6a7a99; }
    .icon { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: linear-gradient(135deg, #5b7dff, #7b61ff); color: #fff; font-weight: 800; }
    .pct { font-size: 2.2rem; font-weight: 800; letter-spacing: -0.04em; color: #1d2947; font-variant-numeric: tabular-nums; }
    .career p { margin: 0; color: #4f607d; line-height: 1.5; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tags span { font-size: 0.8rem; font-weight: 600; padding: 3px 9px; border-radius: 99px; background: #eef1fb; color: #3a4f7d; }
    .ranking { display: grid; gap: 10px; }
    .row { display: grid; grid-template-columns: 200px minmax(0, 1fr) 64px; align-items: center; gap: 12px; }
    .row-label { font-weight: 600; font-size: 0.95rem; }
    .bar { height: 12px; background: #eef1fb; border-radius: 99px; overflow: hidden; }
    .bar-fill { height: 100%; min-width: 2px; background: linear-gradient(90deg, #5b7dff, #7b61ff); border-radius: 99px; }
    .row-value { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
    .empty p { color: #4f607d; margin: 8px 0 0; }
    .status.error { color: #c2412d; font-weight: 600; background: #fdecea; border: 1px solid #f5c2bb; padding: 12px 16px; border-radius: 14px; }
    .disclaimer { margin: 0; color: #6a7a99; font-size: 0.88rem; line-height: 1.5; }
    .primary-btn, .secondary-btn { border-radius: 999px; padding: 13px 22px; font-weight: 700; cursor: pointer; font: inherit; }
    .primary-btn { border: 0; color: #fff; background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 42%, #ff73c9 100%); box-shadow: 0 16px 28px rgba(109, 94, 246, 0.2); }
    .secondary-btn { border: 1px solid rgba(120, 140, 175, 0.7); background: #fff; color: #2e3f6d; justify-self: start; }
    .secondary-btn.small { padding: 8px 14px; font-size: 0.9rem; }
    button:disabled { opacity: .5; cursor: not-allowed; }
    @media (max-width: 980px) {
      .readiness, .top3 { grid-template-columns: 1fr; }
      .row { grid-template-columns: 1fr 52px; }
      .row .bar { grid-column: 1 / -1; grid-row: 2; }
    }
  `],
})
export class ResultsPage implements OnInit {
  loading = true;
  running = false;
  error = '';
  completion = 0;
  labs: LabAttemptsSummary | null = null;
  recommendation: Recommendation | null = null;

  constructor(private ai: CareerAiService, private router: Router) {}

  ngOnInit(): void {
    forkJoin({
      profile: this.ai.getProfile().pipe(catchError(() => of(null as StudentProfile | null))),
      labs: this.ai.getLabAttempts().pipe(catchError(() => of(null))),
      rec: this.ai.getLatestRecommendation().pipe(catchError(() => of(null))),
    }).subscribe(({ profile, labs, rec }) => {
      if (!profile) {
        this.error = 'Could not reach the backend. Start it with “python manage.py runserver” on port 8000.';
      }
      this.completion = profile?.completion ?? 0;
      this.labs = labs;
      this.recommendation = rec;
      this.loading = false;
    });
  }

  get ready(): boolean {
    return this.completion === 100;
  }

  get labsDone(): number {
    return this.labs?.labs_done ?? 0;
  }

  get labRows(): { careerId: string; career: string; score: number | null }[] {
    return Object.entries(AI_LABS).map(([careerId, lab]) => ({
      careerId,
      career: lab.career,
      score: this.labs?.latest[lab.labKey]?.score ?? null,
    }));
  }

  info(career: string) {
    return CAREER_INFO[career] ?? { careerId: '', icon: '★', summary: '', tags: [] };
  }

  hasLab(careerId: string): boolean {
    const lab = AI_LABS[careerId];
    return !!lab && !!this.labs?.latest[lab.labKey];
  }

  openLab(careerId: string): void {
    this.router.navigate(['/dashboard/simulation'], { queryParams: { career: careerId } });
  }

  run(): void {
    this.running = true;
    this.error = '';
    this.ai.runRecommendation().subscribe({
      next: (rec) => {
        this.recommendation = rec;
        this.running = false;
      },
      error: (err) => {
        this.running = false;
        this.error = err?.error?.detail || 'The analysis failed. Check that the backend is running.';
      },
    });
  }
}
