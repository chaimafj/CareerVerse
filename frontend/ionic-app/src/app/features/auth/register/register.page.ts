import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
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
            <p class="eyebrow">EXPLORE • LEARN • BUILD YOUR FUTURE</p>
            <h2>Your career journey<br />starts here.</h2>
            <p class="subtext">
              Discover the jobs of tomorrow through realistic simulations and AI-powered guidance that supports you through every step of your career path.
            </p>
          </div>

          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">✦</div>
              <div>
                <strong>AI profile</strong>
                <p>Understand your strengths, ambitions, and career potential.</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">✦</div>
              <div>
                <strong>Career Labs</strong>
                <p>Explore real-world scenarios and hands-on simulations.</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">✦</div>
              <div>
                <strong>AI recommendations</strong>
                <p>Get tailored opportunities and guidance for your next move.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="auth-panel form-panel">
          <div class="top-link">
            <span>Already have an account?</span>
            <a routerLink="/auth/login">Log in</a>
          </div>

          <div class="form-card">
            <h3>Create an account</h3>
            <p class="welcome-line">Welcome to CareerVerse.</p>

            <form class="auth-form" (ngSubmit)="submitRegister()" #registerForm="ngForm">
              <div class="inline-fields">
                <ion-item lines="none" class="input-item half">
                  <ion-label position="stacked">First name</ion-label>
                  <ion-input name="firstName" [(ngModel)]="form.firstName" required placeholder="Your first name"></ion-input>
                </ion-item>

                <ion-item lines="none" class="input-item half">
                  <ion-label position="stacked">Last name</ion-label>
                  <ion-input name="lastName" [(ngModel)]="form.lastName" required placeholder="Your last name"></ion-input>
                </ion-item>
              </div>

              <ion-item lines="none" class="input-item">
                <ion-label position="stacked">Email</ion-label>
                <ion-input type="email" name="email" [(ngModel)]="form.email" required placeholder="you@example.com"></ion-input>
              </ion-item>

              <ion-item lines="none" class="input-item">
                <ion-label position="stacked">Password</ion-label>
                <ion-input type="password" name="password" [(ngModel)]="form.password" required placeholder="Create a password"></ion-input>
              </ion-item>

              <div class="remember-row">
                <label class="checkbox-line">
                  <input type="checkbox" checked />
                  <span>I accept the terms</span>
                </label>
              </div>

              <ion-button expand="block" class="submit-btn" type="submit" [disabled]="isSubmitting || !registerForm.valid">
                {{ isSubmitting ? 'Creating...' : 'CREATE ACCOUNT' }}
              </ion-button>

              <div class="separator">or</div>

              <ion-button expand="block" fill="outline" class="google-btn" type="button" (click)="goToGoogle()">
                <span class="google-mark">G</span>
                Continue with Google
              </ion-button>
            </form>
          </div>

          <div class="info-box">
            <div class="info-icon">✦</div>
            <div class="info-copy">
              <strong>Start your future now</strong>
              <p>Build your profile to unlock suggestions tailored to your goals and strengths.</p>
            </div>
            <button type="button" class="arrow-btn" (click)="goToFuture()">→</button>
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
        --muted: #5a6477;
      }

      .auth-shell {
        background: linear-gradient(135deg, #f5f0ff 0%, #edf5ff 100%);
      }

      .auth-page {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1.08fr 0.92fr;
        max-width: 1460px;
        margin: 0 auto;
        padding: 36px;
      }

      .auth-panel {
        min-height: 860px;
      }

      .visual-panel {
        padding: 28px 38px 30px;
        background: linear-gradient(135deg, #1a1238 0%, #2f1d6e 28%, #465ce8 64%, #e26bd6 100%);
        color: white;
        border-radius: 30px 0 0 30px;
        position: relative;
        overflow: hidden;
      }

      .visual-panel::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top left, rgba(69, 154, 255, 0.2), transparent 30%);
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
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255,255,255,0.12);
        display: grid;
        place-items: center;
        border: 2px solid rgba(255,255,255,0.8);
        box-shadow: 0 0 0 4px rgba(110, 223, 255, 0.12);
        font-size: 2rem;
        font-weight: 800;
      }

      .brand-text {
        display: flex;
        align-items: baseline;
        gap: 4px;
        font-size: clamp(2.3rem, 2.2vw, 3.1rem);
        letter-spacing: -0.06em;
        font-weight: 700;
      }

      .brand-text strong {
        font-weight: 800;
      }

      .hero-copy {
        margin-top: 52px;
      }

      .eyebrow {
        color: #b8d9ff;
        font-size: 0.78rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin: 0 0 18px;
      }

      .hero-copy h2 {
        margin: 0;
        font-size: clamp(3.2rem, 3.5vw, 5.2rem);
        line-height: 0.96;
        letter-spacing: -0.07em;
      }

      .subtext {
        margin-top: 20px;
        max-width: 620px;
        color: rgba(226, 232, 240, 0.84);
        font-size: 1.08rem;
        line-height: 1.6;
      }

      .feature-list {
        margin-top: 36px;
        display: grid;
        gap: 16px;
        width: min(100%, 520px);
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 16px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 16px;
        padding: 14px 16px;
        box-shadow: 0 14px 28px rgba(14, 19, 48, 0.18);
      }

      .feature-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(255, 126, 203, 0.92), rgba(99, 164, 255, 0.7));
        display: grid;
        place-items: center;
        color: #fff;
      }

      .feature-item strong {
        display: block;
        font-size: 1.05rem;
        margin-bottom: 5px;
      }

      .feature-item p {
        margin: 0;
        color: rgba(231, 239, 250, 0.82);
        font-size: 0.92rem;
      }

      .form-panel {
        background: rgba(246, 247, 249, 0.94);
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
        color: #4d5d76;
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
        font-size: clamp(2.8rem, 2.8vw, 3.8rem);
        letter-spacing: -0.07em;
        color: #101c2d;
      }

      .welcome-line {
        margin: 12px 0 0;
        color: #4d5d76;
        font-size: 1.05rem;
      }

      .auth-form {
        margin-top: 28px;
        display: grid;
        gap: 18px;
      }

      .inline-fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
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

      .submit-btn {
        --background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 35%, #ff73c9 100%);
        --background-activated: linear-gradient(90deg, #4d73f4 0%, #6d5ef6 35%, #f76bc5 100%);
        --background-hover: linear-gradient(90deg, #4d73f4 0%, #6d5ef6 35%, #f76bc5 100%);
        --color: #ffffff;
        --box-shadow: 0 14px 28px rgb(111, 95, 255);
        --border-radius: 999px;
        min-height: 58px;
        margin-top: 4px;
        font-weight: 800;
        letter-spacing: 0.02em;
        font-size: 1.02rem;
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

        .inline-fields {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class RegisterPage {
  form = {
    firstName: '',
    lastName: '',
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

  goToGoogle() {
    this.router.navigateByUrl('/auth/google');
  }

  async goToFuture() {
    if (!this.form.firstName || !this.form.lastName || !this.form.email || !this.form.password) {
      await this.showMessage('Please fill in all fields before continuing.');
      return;
    }

    await this.submitRegister();
  }

  async submitRegister() {
    if (!this.form.firstName || !this.form.lastName || !this.form.email || !this.form.password) {
      await this.showMessage('Please fill in all fields.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating account...',
      spinner: 'crescent',
    });

    await loading.present();
    this.isSubmitting = true;

    this.authService
      .register({
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        password: this.form.password,
      })
      .pipe(finalize(() => {
        this.isSubmitting = false;
        loading.dismiss();
      }))
      .subscribe({
        next: async (response) => {
          const user = response?.user ?? {
            first_name: this.form.firstName,
            last_name: this.form.lastName,
            email: this.form.email,
            username: this.form.email.split('@')[0],
          };

          this.authService.setCurrentUser(user);

          const message = response.message ?? 'Account created successfully.';
          await this.showMessage(message);

          this.authService
            .login({
              email: this.form.email,
              password: this.form.password,
            })
            .subscribe({
              next: (loginResponse) => {
                const loggedUser = loginResponse?.user ?? user;
                this.authService.setCurrentUser(loggedUser);
                this.router.navigateByUrl('/dashboard');
              },
              error: () => this.router.navigateByUrl('/dashboard'),
            });
        },
        error: async (error) => {
          const details = error?.error ?? 'An error occurred while creating the account.';
          const message = typeof details === 'string'
            ? details
            : Object.values(details).flat().join(' ');
          await this.showMessage(message);
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
