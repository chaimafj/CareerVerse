import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  template: `
    <ion-content class="auth-shell">
      <div class="auth-page">
        <div class="auth-panel visual-panel">
          <div class="brand-wrap">
            <div class="brand-logo">
              <span>C</span>
            </div>
            <div class="brand-text">
              <span>Career</span>
              <strong>Verse</strong>
            </div>
          </div>

          <div class="hero-copy">
            <p class="eyebrow">Explore • Learn • Build Your Future</p>
            <h2>Your career journey<br />starts here</h2>
            <p class="subtext">
              Discover tomorrow's careers through realistic simulations and AI guidance designed to support your growth every step of the way.
            </p>
          </div>

          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">
                <span>◌</span>
              </div>
              <div class="feature-copy">
                <strong>Smart Profile</strong>
                <p>Understand your strengths, interests, and performance with clarity.</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <span>✦</span>
              </div>
              <div class="feature-copy">
                <strong>Career Labs</strong>
                <p>Practice in realistic, interactive scenarios across multiple professions.</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <span>◎</span>
              </div>
              <div class="feature-copy">
                <strong>AI Recommendations</strong>
                <p>Receive personalized suggestions to guide your next move.</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <span>▣</span>
              </div>
              <div class="feature-copy">
                <strong>Learning Path</strong>
                <p>Develop your skills and move confidently toward your goals.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="auth-panel form-panel">
          <div class="top-link">
            <span>Not enrolled yet?</span>
            <a routerLink="/auth/register">Create an account</a>
          </div>

          <div class="form-card">
            <h3>Welcome back!</h3>
            <p class="welcome-line">Log in to continue your journey.</p>

            <form class="auth-form" (ngSubmit)="submitLogin()" #loginForm="ngForm">
              <ion-item lines="none" class="input-item">
                <ion-label position="stacked">Email</ion-label>
                <ion-input
                  type="email"
                  name="email"
                  [(ngModel)]="credentials.email"
                  required
                  placeholder="you@example.com"
                ></ion-input>
              </ion-item>

              <ion-item lines="none" class="input-item">
                <ion-label position="stacked">Password</ion-label>
                <ion-input
                  type="password"
                  name="password"
                  [(ngModel)]="credentials.password"
                  required
                  placeholder="••••••••"
                ></ion-input>
              </ion-item>

              <div class="remember-row">
                <label class="checkbox-line">
                  <input type="checkbox" checked />
                  <span>Remember me</span>
                </label>
                <a href="#" (click)="forgotPassword($event)">Forgot password?</a>
              </div>

              <ion-button expand="block" class="submit-btn" type="submit" [disabled]="isSubmitting || !loginForm.valid">
                {{ isSubmitting ? 'Logging in...' : 'LOG IN' }}
              </ion-button>

              <div class="separator">or</div>

              <ion-button expand="block" fill="outline" class="google-btn" type="button" routerLink="/auth/google">
                <span class="google-mark">G</span>
                Continue with Google
              </ion-button>
            </form>
          </div>

          <div class="info-box">
            <div class="info-icon">✦</div>
            <div class="info-copy">
              <strong>Your smart career path</strong>
              <p>Discover the jobs that match your skills, interests and personality.</p>
            </div>
            <button type="button" class="arrow-btn" (click)="goToCreateAccount()">→</button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      :host {
        display: block;
        --bg-soft: #f4f1ff;
        --primary: #6d5ef6;
        --primary-2: #8b5cf6;
        --accent: #ff7ecb;
        --accent-blue: #63a4ff;
        --dark: #17162b;
        --muted: #5e6477;
        --panel: #f8f4ff;
      }

      .auth-shell {
        --background: var(--bg-soft);
        background: linear-gradient(135deg, #f5f0ff 0%, #edf5ff 100%);
      }

      .auth-page {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        max-width: 1460px;
        margin: 0 auto;
        padding: 36px;
        gap: 0;
      }

      .auth-panel {
        min-height: 860px;
      }

      .visual-panel {
        padding: 28px 38px 30px;
        background: linear-gradient(135deg, #1b1237 0%, #2d1a69 28%, #4b63d8 62%, #e26dd8 100%);
        color: white;
        border-radius: 30px 0 0 30px;
        position: relative;
        overflow: hidden;
      }

      .visual-panel::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top left, rgba(80, 164, 255, 0.22), transparent 30%);
        pointer-events: none;
      }

      .brand-wrap,
      .hero-copy,
      .feature-list {
        position: relative;
        z-index: 1;
      }

      .brand-wrap {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .brand-logo {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: rgba(255,255,255,0.12);
        display: grid;
        place-items: center;
        border: 3px solid rgba(255,255,255,0.76);
        box-shadow: 0 0 0 5px rgba(110, 223, 255, 0.18);
        font-size: 2.1rem;
        font-weight: 800;
        color: #f0f8ff;
      }

      .brand-text {
        display: flex;
        align-items: baseline;
        gap: 6px;
        font-size: clamp(2.2rem, 2.1vw, 3rem);
        letter-spacing: -0.06em;
        font-weight: 700;
      }

      .brand-text span {
        opacity: 0.9;
      }

      .brand-text strong {
        font-weight: 800;
      }

      .hero-copy {
        margin-top: 44px;
      }

      .eyebrow {
        margin: 0 0 18px;
        color: #a9d6ff;
        font-size: 0.8rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 700;
      }

      .hero-copy h2 {
        margin: 0;
        max-width: 560px;
        font-size: clamp(3.2rem, 4vw, 5.3rem);
        line-height: 0.9;
        letter-spacing: -0.06em;
        color: white;
      }

      .subtext {
        margin-top: 18px;
        max-width: 670px;
        color: rgba(226, 232, 240, 0.9);
        font-size: 1.1rem;
        line-height: 1.6;
      }

      .feature-list {
        display: grid;
        gap: 14px;
        width: min(100%, 660px);
        margin-top: 34px;
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 18px;
        min-height: 82px;
        padding: 16px 18px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: 0 14px 28px rgba(14, 19, 48, 0.18);
        backdrop-filter: blur(4px);
      }

      .feature-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(255, 126, 203, 0.92), rgba(99, 164, 255, 0.7));
        display: grid;
        place-items: center;
        color: rgba(255,255,255,0.95);
        font-size: 1.4rem;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.25);
      }

      .feature-copy {
        flex: 1;
      }

      .feature-copy strong {
        display: block;
        font-size: clamp(1.1rem, 1.35vw, 1.5rem);
        color: #f2f8ff;
        margin-bottom: 6px;
        letter-spacing: -0.03em;
      }

      .feature-copy p {
        margin: 0;
        color: rgba(219, 231, 244, 0.82);
        font-size: 0.98rem;
        line-height: 1.45;
      }

      .form-panel {
        background: rgba(245, 247, 250, 0.92);
        border-radius: 0 30px 30px 0;
        padding: 30px 42px 26px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }

      .top-link {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        color: #4b5b73;
      }

      .top-link a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 700;
      }

      .form-card {
        width: min(100%, 560px);
        margin: 34px auto 0;
      }

      .form-card h3 {
        margin: 0;
        font-size: clamp(2.8rem, 3vw, 4rem);
        letter-spacing: -0.07em;
        color: #101c2d;
      }

      .welcome-line {
        margin: 10px 0 0;
        color: #4e5d73;
        font-size: 1.05rem;
      }

      .auth-form {
        margin-top: 28px;
        display: grid;
        gap: 18px;
      }

      .input-item {
        --background: #edf2f8;
        --border-radius: 12px;
        --padding-start: 16px;
        --padding-end: 16px;
        --inner-padding-bottom: 12px;
        --inner-padding-top: 12px;
        --highlight-color-focused: var(--primary);
        border: 1px solid rgba(130, 140, 164, 0.38);
        border-radius: 12px;
      }

      ion-label {
        color: #2b3647;
        font-weight: 700;
      }

      ion-input {
        --placeholder-color: #7d8898;
        color: #1f2840;
        font-size: 1rem;
      }

      .remember-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        color: #5e6e82;
        margin-top: 4px;
      }

      .checkbox-line {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 0.98rem;
      }

      .checkbox-line input {
        accent-color: var(--primary);
        width: 16px;
        height: 16px;
      }

      .remember-row a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 700;
        font-size: 0.9rem;
      }

      .submit-btn {
        --background: linear-gradient(90deg, #7b61ff 0%, #4d87ff 52%, #ff7cc8 100%);
        --box-shadow: 0 16px 30px rgba(120, 103, 255, 0.28);
        --border-radius: 14px;
        min-height: 58px;
        margin-top: 4px;
        font-weight: 800;
        letter-spacing: 0.02em;
      }

      .separator {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        color: #78859a;
        font-size: 0.95rem;
        padding: 6px 0;
      }

      .separator::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: rgba(126, 137, 156, 0.8);
        z-index: 0;
      }

      .separator {
        z-index: 1;
      }

      .google-btn {
        --border-color: rgba(116, 129, 147, 0.75);
        --color: #1c2737;
        --background: rgba(255,255,255,0.35);
        min-height: 58px;
        border-radius: 14px;
        font-weight: 700;
      }

      .google-mark {
        width: 24px;
        height: 24px;
        display: inline-grid;
        place-items: center;
        border-radius: 50%;
        background: linear-gradient(135deg, #f3c06a, #f7a86b);
        color: #083660;
        font-weight: 900;
        font-size: 0.8rem;
        margin-right: 8px;
      }

      .info-box {
        margin-top: 30px;
        border: 1px solid rgba(124, 142, 168, 0.7);
        background: rgba(198, 220, 255, 0.26);
        border-radius: 20px;
        padding: 18px 18px 16px;
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .info-icon {
        width: 52px;
        height: 52px;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(122, 209, 255, 0.34), rgba(161, 171, 255, 0.18));
        display: grid;
        place-items: center;
        color: #2c66eb;
        font-size: 1.6rem;
      }

      .info-copy {
        flex: 1;
      }

      .info-copy strong {
        display: block;
        color: #111d2d;
        font-size: 1.06rem;
      }

      .info-copy p {
        margin: 6px 0 0;
        color: #586d82;
        line-height: 1.55;
        font-size: 0.96rem;
      }

      .arrow-btn {
        border: 1px solid rgba(28, 36, 49, 0.7);
        border-radius: 12px;
        background: rgba(255,255,255,0.2);
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        color: #1b2637;
        font-size: 1.6rem;
      }

      @media (max-width: 980px) {
        .auth-page {
          grid-template-columns: 1fr;
          padding: 20px;
        }

        .visual-panel,
        .form-panel {
          border-radius: 28px;
        }
      }
    `,
  ],
})
export class LoginPage {
  credentials = {
    email: '',
    password: '',
  };

  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
  ) {}

  async forgotPassword(event: Event) {
    event.preventDefault();
    await this.showMessage('Password recovery is coming soon. Please contact support or create a new account.');
  }

  goToCreateAccount() {
    this.router.navigateByUrl('/auth/register');
  }

  async submitLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      await this.showMessage('Please fill in all fields.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'crescent',
    });

    await loading.present();
    this.isSubmitting = true;

    this.authService
      .login({
        email: this.credentials.email,
        password: this.credentials.password,
      })
      .pipe(finalize(() => {
        this.isSubmitting = false;
        loading.dismiss();
      }))
      .subscribe({
        next: async (response) => {
          const message = response.message ?? 'Login successful.';
          await this.showMessage(message);
          this.router.navigateByUrl('/dashboard');
        },
        error: async (error) => {
          const details = error?.error?.detail ?? error?.error?.non_field_errors ?? 'Login failed.';
          await this.showMessage(Array.isArray(details) ? details.join(' ') : details);
        },
      });
  }

  private async showMessage(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'CareerVerse',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
