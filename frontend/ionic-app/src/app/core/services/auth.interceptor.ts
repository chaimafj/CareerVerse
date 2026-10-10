import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/** Ajoute le jeton de l'utilisateur aux appels de l'API et renvoie vers la connexion s'il a expiré. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const isApiCall = req.url.startsWith(environment.apiUrl);
    const request = token && isApiCall ? req.clone({ setHeaders: { Authorization: `Token ${token}` } }) : req;

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && isApiCall && !req.url.includes('/auth/')) {
          this.authService.clearCurrentUser();
          this.router.navigateByUrl('/auth/login');
        }
        return throwError(() => error);
      }),
    );
  }
}
