import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CareerAiService, INTERESTS, SKILLS, StudentProfile } from '../../core/services/career-ai.service';

/** Questionnaire : les informations du profil dont le modèle CareerNet a besoin. */
@Component({
  selector: 'app-assessment-page',
  template: `
    <app-shell active="assessment" title="Assessment">
      <section class="intro card">
        <div>
          <p class="eyebrow">Step 1 of 3</p>
          <h1>Tell us about your studies and skills</h1>
          <p class="lead">
            The recommendation model reads these answers together with your Career Lab results.
            Be honest: a realistic self-assessment gives a better recommendation.
          </p>
        </div>
        <div class="completion" [attr.aria-label]="'Completion ' + completion + '%'">
          <svg viewBox="0 0 36 36" class="ring">
            <circle cx="18" cy="18" r="15.9" class="ring-bg"></circle>
            <circle cx="18" cy="18" r="15.9" class="ring-fg" [attr.stroke-dasharray]="completion + ' 100'"></circle>
          </svg>
          <div class="completion-text"><strong>{{ completion }}%</strong><small>complete</small></div>
        </div>
      </section>

      <div class="status error" *ngIf="loadError">{{ loadError }}</div>

      <form *ngIf="!loading" class="grid" (ngSubmit)="save()">
        <section class="card">
          <h2>Studies</h2>
          <p class="hint">Grades are out of 20.</p>
          <div class="fields">
            <label class="field">
              <span>Year of study</span>
              <select id="year_of_study" name="year_of_study" [(ngModel)]="form.year_of_study" required>
                <option [ngValue]="null" disabled>Choose</option>
                <option *ngFor="let y of years" [ngValue]="y">Year {{ y }}</option>
              </select>
            </label>
            <label class="field" *ngFor="let g of grades">
              <span>{{ g.label }}</span>
              <input [id]="g.key" [name]="g.key" type="number" min="0" max="20" step="0.25"
                     [(ngModel)]="$any(form)[g.key]" placeholder="e.g. 13.5" required />
            </label>
          </div>
        </section>

        <section class="card">
          <h2>Self-assessment</h2>
          <p class="hint">0 = I have never done it · 5 = I can manage · 10 = I am very comfortable.</p>
          <div class="skills">
            <div class="skill" *ngFor="let s of skills">
              <div class="skill-head">
                <label [for]="'skill-' + s.key"><strong>{{ s.label }}</strong> <small>{{ s.hint }}</small></label>
                <output [class.unset]="form.self_ratings[s.key] === undefined">
                  {{ form.self_ratings[s.key] ?? '–' }}
                </output>
              </div>
              <input [id]="'skill-' + s.key" type="range" min="0" max="10" step="1"
                     [class.unset]="form.self_ratings[s.key] === undefined"
                     [value]="form.self_ratings[s.key] ?? 5"
                     (input)="rateSkill(s.key, $event)" (click)="rateSkill(s.key, $event)" />
            </div>
          </div>
        </section>

        <section class="card">
          <h2>Interests</h2>
          <p class="hint">How much does each field attract you? 1 = not at all · 5 = a lot.</p>
          <div class="interests">
            <div class="interest" *ngFor="let i of interests">
              <span>{{ i.label }}</span>
              <div class="scale" role="radiogroup" [attr.aria-label]="i.label">
                <button *ngFor="let v of [1,2,3,4,5]" type="button" role="radio"
                        [attr.aria-checked]="form.interest_ratings[i.key] === v"
                        [class.on]="form.interest_ratings[i.key] === v"
                        (click)="form.interest_ratings[i.key] = v">{{ v }}</button>
              </div>
            </div>
          </div>
        </section>

        <div class="actions card">
          <div class="status" [class.error]="!!saveError" [class.ok]="saved && !saveError">
            <ng-container *ngIf="saveError">{{ saveError }}</ng-container>
            <ng-container *ngIf="!saveError && saved">Saved. {{ completion === 100 ? 'Your profile is ready for the AI analysis.' : 'Some answers are still missing.' }}</ng-container>
            <ng-container *ngIf="!saveError && !saved">A skill shows “–” until you click or move its slider.</ng-container>
          </div>
          <div class="buttons">
            <button class="secondary-btn" type="button" routerLink="/dashboard/career-lab" [disabled]="completion < 100">Go to Career Labs</button>
            <button class="primary-btn" type="submit" [disabled]="saving">{{ saving ? 'Saving…' : 'Save answers' }}</button>
          </div>
        </div>
      </form>
    </app-shell>
  `,
  styles: [`
    .card { background: rgba(255,255,255,0.8); border: 1px solid rgba(138, 153, 210, 0.36); border-radius: 22px; padding: 22px 24px; box-shadow: 0 16px 28px rgba(76, 93, 141, 0.06); }
    .intro { display: flex; gap: 24px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
    .eyebrow { margin: 0 0 8px; color: #5b6bc5; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; font-weight: 800; }
    h1 { margin: 0; font-size: clamp(1.8rem, 3vw, 2.6rem); letter-spacing: -0.04em; color: #1d2947; }
    h2 { margin: 0 0 4px; font-size: 1.3rem; letter-spacing: -0.02em; }
    .lead { margin: 10px 0 0; color: #4f607d; line-height: 1.6; max-width: 640px; }
    .hint { margin: 0 0 16px; color: #5d6d8d; font-size: 0.95rem; }
    .completion { position: relative; width: 112px; height: 112px; flex: none; }
    .ring { width: 100%; height: 100%; transform: rotate(-90deg); }
    .ring-bg { fill: none; stroke: #e2e8f5; stroke-width: 3.2; }
    .ring-fg { fill: none; stroke: #6a6cf6; stroke-width: 3.2; stroke-linecap: round; transition: stroke-dasharray .3s; }
    .completion-text { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; }
    .completion-text strong { font-size: 1.5rem; }
    .completion-text small { color: #5d6d8d; }
    .grid { display: grid; gap: 22px; }
    .fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; }
    .field { display: grid; gap: 6px; font-weight: 600; color: #304a7c; }
    .field input, .field select { border: 1px solid #c8d3ea; border-radius: 12px; padding: 11px 12px; font: inherit; background: #fff; color: #1d2947; }
    .field input:focus, .field select:focus { outline: 2px solid #8a8ff7; outline-offset: 1px; }
    .skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px 26px; }
    .skill-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
    .skill-head small { display: block; color: #6a7a99; font-weight: 400; }
    output { font-weight: 800; font-size: 1.2rem; color: #4b4fd6; min-width: 26px; text-align: right; font-variant-numeric: tabular-nums; }
    output.unset { color: #a2acc2; }
    input[type=range] { width: 100%; accent-color: #6a6cf6; }
    input[type=range].unset { accent-color: #b7c0d6; opacity: .7; }
    .interests { display: grid; gap: 12px; }
    .interest { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 8px 0; border-bottom: 1px solid #e6ebf5; }
    .interest:last-child { border-bottom: 0; }
    .interest span { font-weight: 600; color: #304a7c; }
    .scale { display: flex; gap: 6px; }
    .scale button { width: 40px; height: 40px; border-radius: 12px; border: 1px solid #c8d3ea; background: #fff; font-weight: 700; color: #304a7c; cursor: pointer; }
    .scale button.on { background: linear-gradient(135deg, #5b7dff, #7b61ff); color: #fff; border-color: transparent; }
    .scale button:focus-visible { outline: 2px solid #8a8ff7; outline-offset: 2px; }
    .actions { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; position: sticky; bottom: 12px; }
    .buttons { display: flex; gap: 12px; flex-wrap: wrap; }
    .status { color: #5d6d8d; flex: 1; min-width: 220px; }
    .status.ok { color: #1a8f63; font-weight: 600; }
    .status.error { color: #c2412d; font-weight: 600; }
    .primary-btn, .secondary-btn { border-radius: 999px; padding: 13px 22px; font-weight: 700; cursor: pointer; font: inherit; }
    .primary-btn { border: 0; color: #fff; background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 42%, #ff73c9 100%); }
    .secondary-btn { border: 1px solid rgba(120, 140, 175, 0.7); background: #fff; color: #2e3f6d; }
    button:disabled { opacity: .5; cursor: not-allowed; }
  `],
})
export class AssessmentPage implements OnInit {
  readonly skills = SKILLS;
  readonly interests = INTERESTS;
  readonly years = [1, 2, 3, 4, 5];
  readonly grades = [
    { key: 'gpa_20', label: 'Overall average' },
    { key: 'grade_math_20', label: 'Maths grade' },
    { key: 'grade_programming_20', label: 'Programming grade' },
    { key: 'grade_networks_20', label: 'Networks grade' },
  ];

  form: StudentProfile = this.emptyProfile();
  loading = true;
  saving = false;
  saved = false;
  loadError = '';
  saveError = '';

  constructor(private ai: CareerAiService, private router: Router) {}

  ngOnInit(): void {
    this.ai.getProfile().subscribe({
      next: (profile) => {
        this.form = { ...this.emptyProfile(), ...profile,
          self_ratings: { ...(profile.self_ratings || {}) },
          interest_ratings: { ...(profile.interest_ratings || {}) } };
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Could not load your answers. Check that the backend is running on port 8000.';
        this.loading = false;
      },
    });
  }

  get completion(): number {
    const total = 5 + SKILLS.length + INTERESTS.length;
    let done = ['year_of_study', 'gpa_20', 'grade_math_20', 'grade_programming_20', 'grade_networks_20']
      .filter((k) => (this.form as any)[k] !== null && (this.form as any)[k] !== '' && (this.form as any)[k] !== undefined).length;
    done += SKILLS.filter((s) => this.form.self_ratings[s.key] !== undefined).length;
    done += INTERESTS.filter((i) => this.form.interest_ratings[i.key] !== undefined).length;
    return Math.round((100 * done) / total);
  }

  rateSkill(key: string, event: Event): void {
    this.form.self_ratings[key] = Number((event.target as HTMLInputElement).value);
    this.saved = false;
  }

  save(): void {
    this.saving = true;
    this.saveError = '';
    const num = (v: any) => (v === '' || v === null || v === undefined ? null : Number(v));
    this.ai.updateProfile({
      year_of_study: num(this.form.year_of_study),
      gpa_20: num(this.form.gpa_20),
      grade_math_20: num(this.form.grade_math_20),
      grade_programming_20: num(this.form.grade_programming_20),
      grade_networks_20: num(this.form.grade_networks_20),
      self_ratings: this.form.self_ratings,
      interest_ratings: this.form.interest_ratings,
    }).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
      },
      error: (err) => {
        this.saving = false;
        const detail = err?.error;
        this.saveError = detail && typeof detail === 'object'
          ? Object.values(detail).flat().join(' ')
          : 'Saving failed. Check that the backend is running.';
      },
    });
  }

  private emptyProfile(): StudentProfile {
    return {
      year_of_study: null, gpa_20: null, grade_math_20: null, grade_programming_20: null, grade_networks_20: null,
      self_ratings: {}, interest_ratings: {},
    };
  }
}
