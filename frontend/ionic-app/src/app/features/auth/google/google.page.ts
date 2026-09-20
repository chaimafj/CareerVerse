import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-google-page',
  template: `
    <ion-content class="google-shell">
      <div class="google-page">
        <div class="google-card">
          <div class="brand-row">
            <div class="brand-logo">C</div>
            <div class="brand-name">CareerVerse</div>
          </div>

          <div class="title-wrap">
            <p class="eyebrow">Secure access</p>
            <h1>Connect with Google</h1>
          </div>

          <p class="subtitle">
            Continue with your Google account to access your personalized career path and learning dashboard.
          </p>

          <ion-button expand="block" class="google-btn" type="button" (click)="continueWithGoogle()">
            <span class="google-mark">G</span>
            Continue with Google
          </ion-button>

          <div class="secondary-actions">
            <ion-button fill="clear" class="text-btn" routerLink="/auth/login">Back to login</ion-button>
            <ion-button fill="clear" class="text-btn" routerLink="/auth/register">Create account</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      :host {
        display: block;
        --violet: #6d5ef6;
        --blue: #4d87ff;
        --pink: #ff7cc8;
        --bg: #f4f1ff;
        --card: #f8f7ff;
        --text: #171c2b;
        --muted: #5b6475;
        --line: rgba(88, 104, 137, 0.38);
      }

      .google-shell {
        --background: linear-gradient(135deg, #f5f0ff 0%, #edf5ff 100%);
        background: var(--background);
      }

      .google-page {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .google-card {
        width: min(100%, 560px);
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid var(--line);
        border-radius: 28px;
        padding: 28px 28px 24px;
        box-shadow: 0 28px 66px rgba(107, 92, 255, 0.12);
      }

      .brand-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 26px;
      }

      .brand-logo {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--violet), var(--pink));
        color: white;
        font-weight: 800;
        font-size: 1.4rem;
      }

      .brand-name {
        font-weight: 800;
        font-size: 2rem;
        letter-spacing: -0.05em;
        color: var(--text);
      }

      .title-wrap {
        margin-bottom: 10px;
      }

      .eyebrow {
        margin: 0 0 8px;
        font-size: 0.76rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--violet);
        font-weight: 700;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.2rem, 3vw, 3rem);
        letter-spacing: -0.06em;
        color: var(--text);
      }

      .subtitle {
        margin: 0 0 24px;
        color: var(--muted);
        font-size: 1rem;
        line-height: 1.6;
      }

      .google-btn {
        --background: linear-gradient(90deg, #5b7dff 0%, #7b61ff 35%, #ff73c9 100%);
        --color: #ffffff;
        --box-shadow: 0 16px 28px rgba(107, 92, 255, 0.25);
        --border-radius: 999px;
        min-height: 58px;
        font-weight: 800;
        letter-spacing: 0.02em;
        margin-bottom: 18px;
      }

      .google-mark {
        width: 28px;
        height: 28px;
        display: inline-grid;
        place-items: center;
        border-radius: 50%;
        background: linear-gradient(135deg, #f3c06a, #f7a86b);
        color: #153a5d;
        font-weight: 900;
        margin-right: 10px;
      }

      .secondary-actions {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .text-btn {
        --color: var(--violet);
        font-weight: 700;
      }
    `,
  ],
})
export class GooglePage {
  constructor(private alertCtrl: AlertController, private router: Router) {}

  async continueWithGoogle() {
    const alert = await this.alertCtrl.create({
      header: 'Google sign-in',
      message: 'Google authentication is ready to be connected to your backend.',
      buttons: [
        {
          text: 'OK',
          handler: () => this.router.navigateByUrl('/auth/login'),
        },
      ],
    });

    await alert.present();
  }
}
