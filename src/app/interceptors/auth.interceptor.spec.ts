import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  const apiUrl = 'https://fakestoreapi.com/products';
  let httpMock: HttpTestingController;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let authService: { logout: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    router = { navigate: vi.fn() };
    authService = { logout: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('adds the bearer token to API requests', () => {
    localStorage.setItem('token', 'test-token');
    const http = TestBed.inject(HttpClient);
    http.get(apiUrl).subscribe();

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush([]);
  });

  it('does not add an authorization header without a session', () => {
    const http = TestBed.inject(HttpClient);
    http.get(apiUrl).subscribe();

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });

  it('does not send a residual token to the login endpoint', () => {
    localStorage.setItem('token', 'test-token');
    const http = TestBed.inject(HttpClient);
    http.post('https://fakestoreapi.com/auth/login', {}).subscribe();

    const request = httpMock.expectOne('https://fakestoreapi.com/auth/login');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ token: 'response-token' });
  });

  it('clears the session and redirects on protected 401 responses', () => {
    localStorage.setItem('token', 'test-token');
    const http = TestBed.inject(HttpClient);
    http.get(apiUrl).subscribe({ error: () => undefined });

    const request = httpMock.expectOne(apiUrl);
    request.flush(null, new HttpErrorResponse({ status: 401, url: apiUrl }));

    expect(authService.logout).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('does not send the token to another domain', () => {
    localStorage.setItem('token', 'test-token');
    const http = TestBed.inject(HttpClient);
    http.get('https://example.com/data').subscribe();

    const request = httpMock.expectOne('https://example.com/data');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });
});
