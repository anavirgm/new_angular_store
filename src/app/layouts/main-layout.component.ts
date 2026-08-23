import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartService } from '../services/cart.service';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
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

      <!-- HEADER -->
      <app-header />

      <!-- MAIN -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- FOOTER -->
      <app-footer />
    </div>
  `
})
export class MainLayoutComponent {
  public cartService = inject(CartService);
}