import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive],
  template: `
    <header class="main-header">
      <a routerLink="/" class="header-brand" aria-label="AURA Store, ir al catálogo">
        <img ngSrc="/aura-mark.svg" width="40" height="40" alt="" />
        <span>AURA STORE</span>
      </a>

      <nav class="header-actions" aria-label="Navegación principal">
        <a routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }" class="header-link">
          Catálogo
        </a>
        <a routerLink="/cart" routerLinkActive="active-link" class="cart-button" aria-label="Abrir carrito de compras">
          <img ngSrc="/cart-icon.svg" width="24" height="24" alt="" />
          <span>Mi Carrito</span>
          <span class="cart-badge" aria-live="polite">{{ cartService.totalCount() }}</span>
        </a>

        @if (authService.isAuthenticated()) {
          <button type="button" (click)="authService.logout()" class="btn-logout">Cerrar Sesión</button>
        } @else {
          <a routerLink="/auth/login" routerLinkActive="active-link" class="header-link">Iniciar Sesión</a>
        }
      </nav>
    </header>
  `
})
export class HeaderComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
}
