import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  readonly sessionToken = signal<string | null>(localStorage.getItem('token'));

  isAuthenticated(): boolean {
    const token = this.sessionToken();
    if (!token || !this.hasValidJwtStructureAndExpiry(token)) {
      if (token) {
        this.logout(false);
      }
      return false;
    }
    return true;
  }

  private hasValidJwtStructureAndExpiry(token: string): boolean {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      const encodedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=');
      const payload = JSON.parse(atob(paddedPayload)) as { exp?: number };
      return !payload.exp || payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>('https://fakestoreapi.com/auth/login', {
      username,
      password
    }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.sessionToken.set(res.token);
        this.router.navigate(['/']);
      })
    );
  }

  logout(redirect = true): void {
    localStorage.removeItem('token');
    this.sessionToken.set(null);
    if (redirect) {
      void this.router.navigate(['/auth/login']);
    }
  }
}