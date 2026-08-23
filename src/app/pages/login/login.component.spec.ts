import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NEVER, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: { login: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { login: vi.fn() };
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: { navigate: vi.fn() } }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('keeps loading while the login request is pending', () => {
    authService.login.mockReturnValue(NEVER);
    component.username = 'mor_2314';
    component.password = '83r5^_';

    component.onSubmit();

    expect(component.loading()).toBe(true);
  });

  it('shows an error and stops loading when credentials are invalid', () => {
    authService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
    component.username = 'wrong';
    component.password = 'wrong';

    component.onSubmit();

    expect(component.loading()).toBe(false);
    expect(component.error()).toContain('Credenciales inválidas');
  });
});
