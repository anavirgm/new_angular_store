import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="main-wrapper">
      @if (cartService.feedback(); as message) {
        @if (cartService.feedbackKind() === 'checkout') {
          <div class="checkout-backdrop" aria-hidden="true"></div>
        }
        <div class="toast" [class.toast-checkout]="cartService.feedbackKind() === 'checkout'" role="status" aria-live="polite">
          <span class="toast-mark" aria-hidden="true">✓</span>
          <span>{{ message }}</span>
          @if (cartService.feedbackKind() === 'checkout') {
            <button class="toast-close" type="button" aria-label="Cerrar confirmación del pedido" (click)="cartService.dismissFeedback()">×</button>
          }
        </div>
      }
      <header class="main-header">
        <a routerLink="/" class="header-brand" aria-label="AURA Boutique, ir al catálogo">
          AURA BOUTIQUE
        </a>

        <nav class="header-actions" aria-label="Navegación principal">
          <a routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }" class="header-link">
            Catálogo
          </a>
          <a routerLink="/cart" routerLinkActive="active-link" class="cart-button" aria-label="Abrir carrito de compras">
            <span>Mi Carrito</span>
            <span class="cart-badge" aria-live="polite">
              {{ cartService.totalCount() }}
            </span>
          </a>

          @if (authService.isAuthenticated()) {
            <button type="button" (click)="authService.logout()" class="btn-logout">
              Cerrar Sesión
            </button>
          } @else {
            <a routerLink="/auth/login" routerLinkActive="active-link" class="header-link">
              Iniciar Sesión
            </a>
          }
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="main-footer">
        <div class="footer-content">
          <div class="footer-brand">
            <p>AURA Boutique</p>
            <span>Selección curada para tu estilo diario.</span>
          </div>
          <nav class="footer-links" aria-label="Información legal">
            <a routerLink="/terms">Términos y condiciones</a>
            <a routerLink="/privacy">Política de privacidad</a>
          </nav>
        </div>
        <div class="footer-bottom">
          <span>Copyright © 2026 AURA Boutique. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  `
})
export class MainLayoutComponent {
  public cartService = inject(CartService);
  public authService = inject(AuthService);
}