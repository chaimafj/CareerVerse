import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StudentProfile {
  university?: string;
  study_level?: string;
  specialty?: string;
  year_of_study: number | null;
  gpa_20: number | null;
  grade_math_20: number | null;
  grade_programming_20: number | null;
  grade_networks_20: number | null;
  self_ratings: Partial<Record<string, number>>;
  interest_ratings: Partial<Record<string, number>>;
  missing_fields?: string[];
  completion?: number;
  updated_at?: string;
}

export interface LabAttemptPayload {
  career_id: string;
  mission_count: number;
  missions_correct: number;
  score: number;
  duration_seconds: number;
  validations: number;
  hints_used: number;
  enjoyment: number;
}

export interface LabAttempt extends LabAttemptPayload {
  id: number;
  lab_key: string;
  created_at: string;
}

export interface LabAttemptsSummary {
  labs_done: number;
  labs_total: number;
  latest: Record<string, LabAttempt>;
  history: LabAttempt[];
}

export interface CareerScore {
  career: string;
  probability: number;
}

export interface Recommendation {
  id: number;
  top_careers: CareerScore[];
  ranking: CareerScore[];
  labs_used: string[];
  model_version: string;
  created_at: string;
}

export interface SkillGap {
  skill: string;
  label: string;
  self_rating: number;
  estimated_level: number;
  direction: 'overestimated' | 'underestimated';
}

/** Ce que dit un lab par rapport à l'auto-évaluation de l'étudiant. */
export interface LabInsight {
  lab_key: string;
  career: string;
  career_id: string;
  score: number;
  expected_score: number;
  status: 'overestimated' | 'underestimated' | 'consistent';
  skills: SkillGap[];
}

/** Les 13 compétences et 5 intérêts attendus par le modèle CareerNet (mêmes clés que le backend). */
export const SKILLS: { key: string; label: string; hint: string }[] = [
  { key: 'programming', label: 'Programming', hint: 'Writing code in any language' },
  { key: 'python', label: 'Python', hint: 'Scripts, libraries, notebooks' },
  { key: 'linux', label: 'Linux', hint: 'Terminal, shell, administration' },
  { key: 'docker_k8s', label: 'Docker / Kubernetes', hint: 'Containers and orchestration' },
  { key: 'cloud', label: 'Cloud', hint: 'AWS, Azure, Google Cloud' },
  { key: 'networking', label: 'Networking', hint: 'TCP/IP, routing, VPN, firewalls' },
  { key: 'security', label: 'Security', hint: 'Attacks, defenses, encryption' },
  { key: 'databases_sql', label: 'Databases / SQL', hint: 'Queries, modelling, administration' },
  { key: 'web_frontend', label: 'Web frontend', hint: 'HTML, CSS, JavaScript, frameworks' },
  { key: 'math_stats', label: 'Maths / statistics', hint: 'Probability, statistics, linear algebra' },
  { key: 'testing_quality', label: 'Testing / quality', hint: 'Unit tests, QA, bug tracking' },
  { key: 'problem_solving', label: 'Problem solving', hint: 'Breaking down and solving hard problems' },
  { key: 'systems_thinking', label: 'Systems thinking', hint: 'Seeing how all the parts fit together' },
];

export const INTERESTS: { key: string; label: string }[] = [
  { key: 'software_dev', label: 'Software development' },
  { key: 'web_design', label: 'Web and interface design' },
  { key: 'infrastructure', label: 'Infrastructure, cloud and networks' },
  { key: 'security', label: 'Cybersecurity' },
  { key: 'data_ai', label: 'Data and artificial intelligence' },
];

/** Les 9 Career Labs analysés par le modèle, par identifiant de métier du frontend. */
export const AI_LABS: Record<string, { labKey: string; career: string }> = {
  'backend-developer': { labKey: 'lab_backend_api', career: 'Backend Developer' },
  'frontend-developer': { labKey: 'lab_web_ui', career: 'Frontend/Web Developer' },
  'devops-engineer': { labKey: 'lab_devops_pipeline', career: 'DevOps Engineer' },
  'cloud-engineer': { labKey: 'lab_cloud_deploy', career: 'Cloud Engineer' },
  'cybersecurity-analyst': { labKey: 'lab_security_ctf', career: 'Cybersecurity Analyst' },
  'data-analyst': { labKey: 'lab_data_analysis', career: 'Data Scientist' },
  'database-administrator': { labKey: 'lab_sql_database', career: 'Database Administrator' },
  'network-admin': { labKey: 'lab_network_config', career: 'System/Network Admin' },
  'qa-engineer': { labKey: 'lab_qa_testing', career: 'QA/Test Engineer' },
};

export const CAREER_INFO: Record<string, { careerId: string; icon: string; summary: string; tags: string[] }> = {
  'Backend Developer': { careerId: 'backend-developer', icon: '</>', summary: 'Build the server side of applications: APIs, data and business logic.', tags: ['Python', 'APIs', 'SQL'] },
  'Frontend/Web Developer': { careerId: 'frontend-developer', icon: '◧', summary: 'Create the pages and interfaces people use every day.', tags: ['HTML/CSS', 'JavaScript', 'UI'] },
  'DevOps Engineer': { careerId: 'devops-engineer', icon: '⚙', summary: 'Automate how software is built, tested and deployed.', tags: ['Docker', 'Kubernetes', 'CI/CD'] },
  'Cloud Engineer': { careerId: 'cloud-engineer', icon: '☁', summary: 'Design and run scalable infrastructure in the cloud.', tags: ['AWS', 'Linux', 'Networking'] },
  'Cybersecurity Analyst': { careerId: 'cybersecurity-analyst', icon: '◈', summary: 'Protect systems and data against attacks.', tags: ['Security', 'Linux', 'Networks'] },
  'Data Scientist': { careerId: 'data-analyst', icon: '▤', summary: 'Turn data into insights and predictive models.', tags: ['Python', 'Statistics', 'ML'] },
  'Database Administrator': { careerId: 'database-administrator', icon: '▦', summary: 'Keep databases fast, safe and available.', tags: ['SQL', 'Backups', 'Performance'] },
  'System/Network Admin': { careerId: 'network-admin', icon: '⇄', summary: 'Run servers and networks that everything depends on.', tags: ['Networking', 'Linux', 'Monitoring'] },
  'QA/Test Engineer': { careerId: 'qa-engineer', icon: '✓', summary: 'Find bugs before users do and guard software quality.', tags: ['Testing', 'Automation', 'Quality'] },
};

@Injectable({ providedIn: 'root' })
export class CareerAiService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.api}/profile/`);
  }

  updateProfile(profile: Partial<StudentProfile>): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(`${this.api}/profile/`, profile);
  }

  getLabAttempts(): Observable<LabAttemptsSummary> {
    return this.http.get<LabAttemptsSummary>(`${this.api}/labs/attempts/`);
  }

  submitLabAttempt(payload: LabAttemptPayload): Observable<LabAttempt> {
    return this.http.post<LabAttempt>(`${this.api}/labs/attempts/`, payload);
  }

  getLatestRecommendation(): Observable<Recommendation | null> {
    return this.http.get<Recommendation | null>(`${this.api}/recommendations/`);
  }

  runRecommendation(): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${this.api}/recommendations/`, {});
  }

  getInsights(): Observable<LabInsight[]> {
    return this.http.get<LabInsight[]>(`${this.api}/insights/`);
  }
}
