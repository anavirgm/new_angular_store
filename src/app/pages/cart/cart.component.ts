import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-shell cart-page">
      
      <div class="section-heading cart-heading">
        <h2>Bolsa de Compras</h2>
        <a routerLink="/" class="text-link">← Volver al catálogo</a>
      </div>

      @if (cartService.items().length === 0) {
        <div class="empty-state">
          <h3>Tu carrito está vacío</h3>
          <p>No has agregado ningún artículo a tu bolsa.</p>
          <a routerLink="/" class="button button-primary">
            Ver productos
          </a>
        </div>
      } @else {
        <div class="cart-layout">
          
          <!-- Lista de Items -->
          <div class="cart-items">
            @for (item of cartService.items(); track item.product.id) {
              <article class="cart-item">
                
                <!-- Imagen -->
                <div class="cart-image">
                  <img [src]="item.product.image" [alt]="item.product.title" />
                </div>

                <!-- Detalle del Producto -->
                <div class="cart-detail">
                  <h4>{{ item.product.title }}</h4>
                  <p>\${{ item.product.price }} USD</p>
                </div>

                <!-- Controles de Cantidad (+ / -) -->
                <div class="cart-controls">
                  
                  <div class="quantity-control">
                    <button 
                      (click)="cartService.decreaseQuantity(item.product.id)"
                      aria-label="Disminuir cantidad">
                      -
                    </button>
                    
                    <span class="quantity-value" aria-live="polite">
                      {{ item.quantity }}
                    </span>

                    <button 
                      (click)="cartService.increaseQuantity(item.product.id)"
                      aria-label="Aumentar cantidad">
                      +
                    </button>
                  </div>

                  <!-- Subtotal del ítem -->
                  <span class="item-subtotal">
                    \${{ (item.product.price * item.quantity).toFixed(2) }}
                  </span>

                  <!-- Botón Quitar Todo -->
                  <button 
                    (click)="cartService.removeFromCart(item.product.id)"
                    title="Eliminar del carrito"
                    aria-label="Eliminar producto del carrito">
                    ✕
                  </button>
                </div>

              </article>
            }
          </div>

          <!-- Resumen de Pedido -->
          <aside class="order-summary">
            <h3>Resumen de compra</h3>
            
            <div class="summary-row">
              <span>Total de artículos</span>
              <span>{{ cartService.totalCount() }}</span>
            </div>
            
            <div class="summary-row summary-shipping">
              <span>Envío</span>
              <span>Gratis</span>
            </div>

            <div class="summary-total">
              <span>Total</span>
              <span>\${{ cartService.totalPrice().toFixed(2) }}</span>
            </div>

            <button class="button button-primary checkout-button" type="button" (click)="cartService.checkout()">
              Finalizar Pedido
            </button>

            <button
              type="button"
              class="btn-clear-cart"
              (click)="cartService.clearCart()"
              aria-label="Vaciar carrito completo">
              🗑 Vaciar carrito
            </button>
          </aside>

        </div>
      }
    </div>
  `
})
export class CartComponent {
  public cartService = inject(CartService);
}