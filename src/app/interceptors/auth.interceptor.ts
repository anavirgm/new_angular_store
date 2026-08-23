import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const isApiRequest = req.url.startsWith('https://fakestoreapi.com/');

  const request = token && isApiRequest ? req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    }) : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isApiRequest && !req.url.includes('/auth/login')) {
        authService.logout(false);
        void router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};