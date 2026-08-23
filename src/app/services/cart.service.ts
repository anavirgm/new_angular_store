import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: ProductRating;
}

export interface ProductRating {
  rate: number;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type FeedbackKind = 'normal' | 'checkout';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'cart-items';
  readonly items = signal<CartItem[]>(this.loadItems());
  readonly feedback = signal<string | null>(null);
  readonly feedbackKind = signal<FeedbackKind | null>(null);
  private feedbackTimer: ReturnType<typeof setTimeout> | undefined;

  totalCount = computed(() => 
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.items().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  addToCart(product: Product, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }
    this.updateItems(currentItems => {
      const existing = currentItems.find(i => i.product.id === product.id);
      if (existing) {
        return currentItems.map(i => 
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...currentItems, { product, quantity }];
    });
    this.showFeedback(`${product.title} agregado al carrito`);
  }

  setQuantity(product: Product, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }
    this.updateItems(currentItems => {
      const existing = currentItems.some(item => item.product.id === product.id);
      return existing
        ? currentItems.map(item => item.product.id === product.id ? { ...item, quantity } : item)
        : [...currentItems, { product, quantity }];
    });
    this.showFeedback(`${product.title} actualizado en el carrito`);
  }

  // Incrementar en 1
  increaseQuantity(productId: number) {
    this.updateItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    this.showFeedback('Cantidad actualizada');
  }

  // Decrementar en 1 (si llega a 0, se elimina)
  decreaseQuantity(productId: number) {
    const target = this.items().find(item => item.product.id === productId);
    this.updateItems(currentItems => {
      const currentItem = currentItems.find(item => item.product.id === productId);
      if (currentItem && currentItem.quantity > 1) {
        return currentItems.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return currentItems.filter(item => item.product.id !== productId);
    });
    this.showFeedback(target && target.quantity === 1 ? 'Producto eliminado del carrito' : 'Cantidad actualizada');
  }

  // Eliminar producto completo independientemente de la cantidad
  removeFromCart(productId: number) {
    const removed = this.items().some(item => item.product.id === productId);
    this.updateItems(currentItems => currentItems.filter(item => item.product.id !== productId));
    if (removed) {
      this.showFeedback('Producto eliminado del carrito');
    }
  }

  checkout(): void {
    if (this.items().length > 0) {
      this.showFeedback('Pedido simulado correctamente', 'checkout');
    }
  }

  private showFeedback(message: string, kind: FeedbackKind = 'normal'): void {
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    this.feedback.set(message);
    this.feedbackKind.set(kind);
    this.feedbackTimer = setTimeout(() => {
      this.dismissFeedback();
    }, kind === 'checkout' ? 1600 : 2800);
  }

  dismissFeedback(): void {
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
      this.feedbackTimer = undefined;
    }
    this.feedback.set(null);
    this.feedbackKind.set(null);
  }

  private updateItems(updater: (items: CartItem[]) => CartItem[]): void {
    this.items.update(currentItems => {
      const nextItems = updater(currentItems);
      this.persistItems(nextItems);
      return nextItems;
    });
  }

  private loadItems(): CartItem[] {
    try {
      const storedItems: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? 'null');
      return Array.isArray(storedItems) ? storedItems.filter((item): item is CartItem => this.isCartItem(item)) : [];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private persistItems(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private isCartItem(value: unknown): value is CartItem {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const item = value as Record<string, unknown>;
    const product = item['product'];
    if (!product || typeof product !== 'object') {
      return false;
    }
    const storedProduct = product as Record<string, unknown>;
    return Number.isInteger(storedProduct['id'])
      && (storedProduct['id'] as number) > 0
      && typeof storedProduct['title'] === 'string'
      && storedProduct['title'].trim().length > 0
      && typeof storedProduct['price'] === 'number'
      && Number.isFinite(storedProduct['price'])
      && (storedProduct['price'] as number) >= 0
      && typeof storedProduct['description'] === 'string'
      && typeof storedProduct['category'] === 'string'
      && typeof storedProduct['image'] === 'string'
      && storedProduct['image'].trim().length > 0
      && this.isValidRating(storedProduct['rating'])
      && Number.isInteger(item['quantity'])
      && (item['quantity'] as number) > 0;
  }

  private isValidRating(value: unknown): boolean {
    if (value === undefined) {
      return true;
    }
    if (!value || typeof value !== 'object') {
      return false;
    }
    const rating = value as Record<string, unknown>;
    return typeof rating['rate'] === 'number'
      && Number.isFinite(rating['rate'])
      && (rating['rate'] as number) >= 0
      && (rating['rate'] as number) <= 5
      && Number.isInteger(rating['count'])
      && (rating['count'] as number) >= 0;
  }
}