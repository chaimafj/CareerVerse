import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface CareerDetail {
  slug: string;
  title: string;
  subtitle: string;
  match: number;
  description: string;
  overview: string;
  skills: string[];
  salary: string;
  growth: string;
  icon: string;
  accent: string;
}

@Component({
  selector: 'app-career-detail-page',
  template: `
    <div class="career-detail-shell">
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
      </aside>

      <div class="workspace">
        <header class="appbar">
          <div class="appbar-logo">CareerVerse</div>

          <label class="search-box" aria-label="Search bar">
            <span class="search-icon">⌕</span>
            <input type="text" placeholder="Search for careers, labs, or skills..." />
          </label>

          <div class="appbar-actions">
            <button class="notify-button" type="button" aria-label="Notifications">
              <span class="bell-icon">◔</span>
              <span class="notification-dot"></span>
            </button>

            <div class="user-menu-wrap">
              <button class="user-badge" type="button" (click)="goBack()" aria-label="Back to explorer">
                <div class="user-avatar">←</div>
                <div class="user-meta">
                  <span class="user-name">Back</span>
                  <small>Explorer</small>
                </div>
                <span class="user-chevron">⌄</span>
              </button>
            </div>
          </div>
        </header>

        <main class="content-area" *ngIf="career">
          <section class="hero-panel" [style.background]="career.accent">
            <div class="hero-copy">
              <p class="eyebrow">Career match</p>
              <h1>{{ career.title }}</h1>
              <p class="subtitle">{{ career.subtitle }}</p>
              <div class="match-row">
                <span class="match-pill">{{ career.match }}% match</span>
                <span class="mini-tag">{{ career.salary }}</span>
              </div>
            </div>
            <div class="hero-icon">{{ career.icon }}</div>
          </section>

          <section class="info-grid">
            <article class="info-card">
              <h2>Overview</h2>
              <p>{{ career.overview }}</p>
            </article>

            <article class="info-card">
              <h2>Key skills</h2>
              <div class="tag-row">
                <span *ngFor="let skill of career.skills">{{ skill }}</span>
              </div>
            </article>
          </section>

          <section class="detail-grid">
            <article class="detail-card">
              <h3>Why it matches you</h3>
              <p>{{ career.description }}</p>
            </article>

            <article class="detail-card highlight">
              <h3>Opportunity outlook</h3>
              <ul>
                <li><strong>Growth:</strong> {{ career.growth }}</li>
                <li><strong>Salary:</strong> {{ career.salary }}</li>
                <li><strong>Best fit:</strong> Problem solving, collaboration, and practical execution.</li>
              </ul>
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

      button {
        font: inherit;
      }

      .career-detail-shell {
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

      .workspace {
        min-height: 100vh;
        height: 100vh;
        padding: 0 26px 30px;
        background: linear-gradient(180deg, #f4f7fd 0%, #edf2fb 100%);
        overflow-y: auto;
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
        margin-bottom: 16px;
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

      .user-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: rgba(255,255,255,0.85);
        border: 1px solid rgba(130, 143, 181, 0.12);
        border-radius: 999px;
        padding: 10px 14px;
        color: #1f2d50;
        font-weight: 700;
        cursor: pointer;
      }

      .content-area {
        display: grid;
        gap: 24px;
      }

      .hero-panel {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 28px;
        padding: 28px 26px;
        border: 1px solid rgba(128, 149, 205, 0.22);
        box-shadow: 0 18px 40px rgba(97, 111, 155, 0.08);
      }

      .hero-copy {
        max-width: 620px;
      }

      .eyebrow {
        margin: 0 0 10px;
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.2rem, 3vw, 3.5rem);
        line-height: 1.08;
        letter-spacing: -0.08em;
        color: #1d2c53;
      }

      .subtitle {
        margin: 12px 0 0;
        font-size: 1.04rem;
        line-height: 1.7;
        color: rgba(31, 45, 80, 0.8);
      }

      .match-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 18px;
        flex-wrap: wrap;
      }

      .match-pill,
      .mini-tag {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 8px 12px;
        font-weight: 700;
      }

      .match-pill {
        background: rgba(255, 255, 255, 0.5);
        color: #1f2d50;
      }

      .mini-tag {
        background: rgba(31, 45, 80, 0.08);
        color: #2e446d;
      }

      .hero-icon {
        width: 120px;
        height: 120px;
        border-radius: 26px;
        background: rgba(255,255,255,0.42);
        display: grid;
        place-items: center;
        font-size: 3.2rem;
        font-weight: 800;
        color: #1f2d50;
        box-shadow: 0 12px 24px rgba(25, 38, 72, 0.08);
      }

      .info-grid,
      .detail-grid {
        display: grid;
        gap: 20px;
      }

      .info-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .detail-grid {
        grid-template-columns: 1.1fr 0.9fr;
      }

      .info-card,
      .detail-card {
        background: rgba(255,255,255,0.8);
        border: 1px solid rgba(136, 156, 201, 0.18);
        border-radius: 24px;
        padding: 20px 20px 18px;
        box-shadow: 0 16px 28px rgba(96, 111, 150, 0.08);
      }

      h2, h3 {
        margin: 0 0 12px;
        letter-spacing: -0.05em;
      }

      .info-card p,
      .detail-card p,
      .detail-card li {
        color: #5b6f90;
        line-height: 1.75;
      }

      .tag-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
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

      .detail-card ul {
        padding-left: 18px;
        margin: 0;
      }

      .detail-card.highlight {
        background: linear-gradient(180deg, rgba(232, 240, 255, 0.8), rgba(255,255,255,0.9));
      }

      @media (max-width: 980px) {
        .career-detail-shell {
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

        .hero-panel,
        .info-grid,
        .detail-grid {
          grid-template-columns: 1fr;
          display: grid;
        }
      }
    `,
  ],
})
export class CareerDetailPage implements OnInit {
  career: CareerDetail | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const careers: CareerDetail[] = [
      {
        slug: 'cloud-engineer',
        title: 'Cloud Engineer',
        subtitle: 'Build, deploy and secure modern cloud systems.',
        match: 91,
        description: 'Your profile aligns strongly with infrastructure, automation, and scalable systems work.',
        overview: 'Cloud Engineers design, deploy, and maintain secure digital infrastructure that powers web apps and services across distributed environments.',
        skills: ['AWS', 'Docker', 'Linux', 'Security'],
        salary: '$95k - $130k',
        growth: 'Very strong demand across AI, SaaS, and enterprise tech.',
        icon: '☁',
        accent: 'linear-gradient(135deg, rgba(124, 184, 255, 0.28), rgba(90, 144, 255, 0.1))',
      },
      {
        slug: 'devops-engineer',
        title: 'DevOps Engineer',
        subtitle: 'Automate workflows to deliver software efficiently.',
        match: 87,
        description: 'You have the problem-solving mindset and systems thinking needed for DevOps work and CI/CD operations.',
        overview: 'DevOps Engineers connect development and operations through automation, monitoring, and continuous delivery processes.',
        skills: ['Kubernetes', 'CI/CD', 'Linux', 'Monitoring'],
        salary: '$90k - $125k',
        growth: 'Fast-growing across product teams and cloud platforms.',
        icon: '⟲',
        accent: 'linear-gradient(135deg, rgba(139, 227, 197, 0.28), rgba(94, 190, 170, 0.12))',
      },
      {
        slug: 'backend-developer',
        title: 'Backend Developer',
        subtitle: 'Create secure systems, APIs, and reliable data logic.',
        match: 82,
        description: 'Your strengths fit backend development, especially in architecture, logic, and data flow design.',
        overview: 'Backend developers build the heart of digital products: APIs, data models, server logic, and integration points that keep applications reliable.',
        skills: ['Python', 'API', 'PostgreSQL', 'Architecture'],
        salary: '$85k - $120k',
        growth: 'Strong long-term demand across startups and enterprise apps.',
        icon: '< />',
        accent: 'linear-gradient(135deg, rgba(168, 147, 255, 0.25), rgba(119, 110, 255, 0.1))',
      },
      {
        slug: 'ux-researcher',
        title: 'UX Researcher',
        subtitle: 'Turn user insight into better experiences.',
        match: 78,
        description: 'Your profile is well-suited for research, problem framing, and turning signals into product decisions.',
        overview: 'UX Researchers study user needs and behaviors to shape products around usability, clarity, and impact.',
        skills: ['Research', 'Testing', 'Insights', 'Strategy'],
        salary: '$80k - $110k',
        growth: 'Consistent demand in digital, SaaS, and product teams.',
        icon: '✦',
        accent: 'linear-gradient(135deg, rgba(255, 202, 124, 0.3), rgba(255, 153, 85, 0.12))',
      },
      {
        slug: 'product-manager',
        title: 'Product Manager',
        subtitle: 'Lead product strategy and execution across digital experiences.',
        match: 76,
        description: 'Your blend of strategy, communication, and problem solving fits product leadership work well.',
        overview: 'Product Managers align user needs, business goals, and engineering execution to create impactful digital products.',
        skills: ['Strategy', 'Roadmap', 'UX', 'Analytics'],
        salary: '$88k - $120k',
        growth: 'Strong growth in SaaS, fintech, and consumer products.',
        icon: '◈',
        accent: 'linear-gradient(135deg, rgba(112, 196, 255, 0.27), rgba(86, 118, 255, 0.12))',
      },
      {
        slug: 'data-analyst',
        title: 'Data Analyst',
        subtitle: 'Turn numbers into decisions with clear, actionable insight.',
        match: 74,
        description: 'You connect analytical thinking and business context in a way that supports strong data-driven decisions.',
        overview: 'Data Analysts transform raw information into dashboards, trends, and recommendations that help teams act wisely.',
        skills: ['SQL', 'Power BI', 'Insights', 'Modeling'],
        salary: '$78k - $105k',
        growth: 'Consistent demand across healthcare, finance, and product organizations.',
        icon: '◫',
        accent: 'linear-gradient(135deg, rgba(116, 222, 195, 0.28), rgba(63, 179, 158, 0.12))',
      },
      {
        slug: 'cybersecurity-analyst',
        title: 'Cybersecurity Analyst',
        subtitle: 'Protect systems, data, and digital trust with proactive defense.',
        match: 79,
        description: 'Your careful thinking and attention to detail align closely with threat detection and risk management.',
        overview: 'Cybersecurity Analysts monitor environments, investigate issues, and reduce risk before vulnerabilities become incidents.',
        skills: ['Security', 'SIEM', 'Cloud', 'Monitoring'],
        salary: '$82k - $118k',
        growth: 'High demand as digital platforms face increasing security pressure.',
        icon: '◌',
        accent: 'linear-gradient(135deg, rgba(166, 136, 255, 0.26), rgba(108, 98, 220, 0.12))',
      },
      {
        slug: 'ai-engineer',
        title: 'AI Engineer',
        subtitle: 'Build intelligent systems that create measurable business value.',
        match: 81,
        description: 'Your curiosity and engineering mindset make AI product work and model deployment a strong match.',
        overview: 'AI Engineers design, train, and operationalize machine learning systems that help products solve real-world problems.',
        skills: ['Machine Learning', 'Python', 'AI', 'Data'],
        salary: '$100k - $145k',
        growth: 'Explosive growth across enterprise software, automation, and research.',
        icon: '✧',
        accent: 'linear-gradient(135deg, rgba(255, 178, 122, 0.3), rgba(255, 128, 89, 0.12))',
      },
      {
        slug: 'mobile-developer',
        title: 'Mobile Developer',
        subtitle: 'Craft intuitive mobile experiences that feel fast and polished.',
        match: 75,
        description: 'You are well matched to mobile work that balances design, product thinking, and technical execution.',
        overview: 'Mobile Developers design and ship user-friendly app experiences across iOS, Android, and cross-platform environments.',
        skills: ['Flutter', 'iOS', 'Android', 'UX'],
        salary: '$80k - $115k',
        growth: 'Strong demand in consumer products and startup ecosystems.',
        icon: '▣',
        accent: 'linear-gradient(135deg, rgba(124, 202, 255, 0.28), rgba(80, 154, 227, 0.12))',
      },
      {
        slug: 'healthcare-analyst',
        title: 'Healthcare Analyst',
        subtitle: 'Use data and research to improve care and operations.',
        match: 73,
        description: 'Your analytical strengths and empathy align with healthcare strategy and improvement initiatives.',
        overview: 'Healthcare Analysts help organizations improve patient outcomes, streamline operations, and support evidence-based decisions.',
        skills: ['Health', 'Data', 'Research', 'Operations'],
        salary: '$76k - $102k',
        growth: 'Steady demand in hospitals, insurers, and digital health teams.',
        icon: '✚',
        accent: 'linear-gradient(135deg, rgba(148, 220, 186, 0.28), rgba(75, 180, 145, 0.12))',
      },
      {
        slug: 'graphic-designer',
        title: 'Graphic Designer',
        subtitle: 'Create visuals that communicate clearly and leave a strong impression.',
        match: 71,
        description: 'Your creativity and clarity fit a design role focused on branding, storytelling, and digital craft.',
        overview: 'Graphic Designers shape visual identity and communication through layouts, campaigns, interfaces, and brand materials.',
        skills: ['Brand', 'Figma', 'UI', 'Storytelling'],
        salary: '$70k - $95k',
        growth: 'Stable demand in digital marketing, startups, and creative agencies.',
        icon: '◐',
        accent: 'linear-gradient(135deg, rgba(255, 185, 145, 0.28), rgba(255, 126, 97, 0.12))',
      },
      {
        slug: 'business-analyst',
        title: 'Business Analyst',
        subtitle: 'Bridge strategy, process, and technical execution for better business outcomes.',
        match: 77,
        description: 'You are strong in clarity, process thinking, and translating goals into practical actions.',
        overview: 'Business Analysts connect departments, define needs, and help organizations improve workflows and decision-making.',
        skills: ['Strategy', 'Planning', 'Analysis', 'Process'],
        salary: '$82k - $116k',
        growth: 'Strong demand across digital transformation and operations teams.',
        icon: '◍',
        accent: 'linear-gradient(135deg, rgba(180, 170, 255, 0.25), rgba(132, 118, 255, 0.1))',
      },
    ];

    this.career = careers.find((item) => item.slug === slug) ?? careers[0];
  }

  goBack(): void {
    this.router.navigateByUrl('/dashboard/career-explorer');
  }
}
