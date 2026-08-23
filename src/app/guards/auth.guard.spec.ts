import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  it('allows authenticated users', () => {
    const authService = { isAuthenticated: vi.fn().mockReturnValue(true), logout: vi.fn() };
    const router = { createUrlTree: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(true);
    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('clears the session and returns the login UrlTree for guests', () => {
    const loginTree = { toString: () => '/auth/login' };
    const authService = { isAuthenticated: vi.fn().mockReturnValue(false), logout: vi.fn() };
    const router = { createUrlTree: vi.fn().mockReturnValue(loginTree) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(authService.logout).toHaveBeenCalledWith(false);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
    expect(result).toBe(loginTree);
  });
});
