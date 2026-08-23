import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';

@Component({
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
class RouterHostComponent {}

describe('Application route integration', () => {
  const validToken = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIiwiaWF0IjoxfQ.signature';
  let fixture: ComponentFixture<RouterHostComponent>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterHostComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: CartService, useClass: CartService }
      ]
    });
    fixture = TestBed.createComponent(RouterHostComponent);
  });

  afterEach(() => localStorage.clear());

  it('navigates to the catalog after a successful login', async () => {
    const router = TestBed.inject(Router);
    const authService = TestBed.inject(AuthService);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    authService.login('mor_2314', '83r5^_').subscribe();
    const request = httpMock.expectOne('https://fakestoreapi.com/auth/login');
    request.flush({ token: validToken });
    await fixture.whenStable();

    expect(router.url).toBe('/');
  });

  it('loads the protected cart route with a valid session', async () => {
    localStorage.setItem('token', validToken);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/cart');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/cart');
    expect(fixture.nativeElement.textContent).toContain('Tu carrito está vacío');
  });

  it('renders legal pages inside MainLayout with the store footer', async () => {
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/terms');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/terms');
    expect(fixture.nativeElement.textContent).toContain('Términos y condiciones');
    expect(fixture.nativeElement.querySelector('.main-header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.main-footer')).toBeTruthy();

    await router.navigateByUrl('/privacy');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/privacy');
    expect(fixture.nativeElement.textContent).toContain('Política de privacidad');
  });
});
