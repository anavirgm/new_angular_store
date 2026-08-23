import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const validToken = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIiwiaWF0IjoxfQ.signature';
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    router = { navigate: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('logs in, persists the JWT and navigates to the catalog', () => {
    service.login('mor_2314', '83r5^_').subscribe();

    const request = httpMock.expectOne('https://fakestoreapi.com/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'mor_2314', password: '83r5^_' });

    request.flush({ token: validToken });

    expect(localStorage.getItem('token')).toBe(validToken);
    expect(service.sessionToken()).toBe(validToken);
    expect(service.isAuthenticated()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('clears the persisted session and redirects on logout', () => {
    localStorage.setItem('token', validToken);
    service.sessionToken.set(validToken);

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.sessionToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('rejects malformed and expired tokens', () => {
    const expiredToken = 'eyJhbGciOiJub25lIn0.eyJleHAiOjF9.signature';
    localStorage.setItem('token', 'not-a-jwt');
    service.sessionToken.set('not-a-jwt');
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();

    localStorage.setItem('token', expiredToken);
    service.sessionToken.set(expiredToken);
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('restores a valid session token when the service is reconstructed', () => {
    TestBed.resetTestingModule();
    localStorage.setItem('token', validToken);
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    const restoredService = TestBed.inject(AuthService);

    expect(restoredService.sessionToken()).toBe(validToken);
    expect(restoredService.isAuthenticated()).toBe(true);
  });
});
