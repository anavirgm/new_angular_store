import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

@Component({ template: 'Private content' })
class PrivateComponent {}

describe('authGuard router integration', () => {
  it('redirects a navigation to a protected route to login', async () => {
    const authService = { isAuthenticated: vi.fn().mockReturnValue(false), logout: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'auth/login', component: PrivateComponent },
          { path: 'private', canActivate: [authGuard], component: PrivateComponent }
        ]),
        { provide: AuthService, useValue: authService }
      ]
    });
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/private');

    expect(router.url).toBe('/auth/login');
    expect(authService.logout).toHaveBeenCalledWith(false);
  });
});
