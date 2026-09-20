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
  user?: unknown;
  detail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthApiResponse> {
    return this.http.post<AuthApiResponse>(`${this.apiUrl}/login/`, credentials);
  }

  register(payload: RegisterRequest): Observable<AuthApiResponse> {
    const username = payload.email.split('@')[0] || 'careerverse-user';

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
}
