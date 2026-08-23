import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideRouter([]),
        {
          provide: CartService,
          useValue: { totalCount: signal(3), feedback: signal(null), feedbackKind: signal(null) }
        },
        {
          provide: AuthService,
          useValue: { isAuthenticated: vi.fn().mockReturnValue(false) }
        }
      ]
    });
    fixture = TestBed.createComponent(MainLayoutComponent);
    fixture.detectChanges();
  });

  it('renders the live cart counter and store footer', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.cart-badge')?.textContent?.trim()).toBe('3');
    expect(element.querySelector('.main-footer')?.textContent).toContain('Copyright');
    expect(element.querySelector('.header-brand img')?.getAttribute('src')).toContain('aura-mark.svg');
    expect(element.querySelector('.footer-brand img')?.getAttribute('src')).toContain('aura-mark.svg');
    expect(element.querySelector('a[href="/terms"]')).toBeTruthy();
    expect(element.querySelector('a[href="/privacy"]')).toBeTruthy();
  });
});
