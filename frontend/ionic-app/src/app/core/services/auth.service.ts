import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthApiResponse {
  message?: string;
  user?: any;
  detail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly userStorageKey = 'careerverse_user';
  private readonly profileStorageKey = 'careerverse_profile';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthApiResponse> {
    return this.http.post<AuthApiResponse>(`${this.apiUrl}/login/`, credentials);
  }

  register(payload: RegisterRequest): Observable<AuthApiResponse> {
    const username = payload.email.split('@')[0]?.replace(/[^a-zA-Z0-9_.-]/g, '') || 'careerverse-user';

    return this.http.post<AuthApiResponse>(`${this.apiUrl}/register/`, {
      username,
      email: payload.email,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone ?? '',
      password: payload.password,
      password_confirm: payload.password,
    });
  }

  setCurrentUser(user: any): void {
    localStorage.setItem(this.userStorageKey, JSON.stringify(user ?? {}));
  }

  getCurrentUser(): any {
    const raw = localStorage.getItem(this.userStorageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.userStorageKey);
    localStorage.removeItem(this.profileStorageKey);
  }

  setProfile(profile: any): void {
    localStorage.setItem(this.profileStorageKey, JSON.stringify(profile ?? {}));
  }

  getProfile(): any {
    const raw = localStorage.getItem(this.profileStorageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
