import { TestBed } from '@angular/core/testing';
import { CartService, Product } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  const product: Product = {
    id: 1,
    title: 'Test product',
    price: 10,
    description: 'Description',
    category: 'test',
    image: 'image.jpg'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [CartService] });
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('adds products, merges duplicates and calculates count and total', () => {
    service.addToCart(product);
    service.addToCart(product);

    expect(service.items()).toEqual([{ product, quantity: 2 }]);
    expect(service.totalCount()).toBe(2);
    expect(service.totalPrice()).toBe(20);
  });

  it('changes quantities and removes an item when decreasing from one', () => {
    service.addToCart(product);
    service.increaseQuantity(product.id);
    service.decreaseQuantity(product.id);
    service.decreaseQuantity(product.id);

    expect(service.items()).toEqual([]);
    expect(service.totalCount()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('removes the complete product regardless of quantity', () => {
    service.addToCart(product);
    service.addToCart(product);
    service.removeFromCart(product.id);

    expect(service.items()).toEqual([]);
  });

  it('shows feedback for a simulated checkout', () => {
    service.addToCart(product);

    service.checkout();

    expect(service.feedback()).toBe('Pedido simulado correctamente');
    expect(service.feedbackKind()).toBe('checkout');
    expect(service.feedbackKind()).toBe('checkout');
  });

  it('allows the checkout feedback to be closed manually', () => {
    service.addToCart(product);
    service.checkout();

    service.dismissFeedback();

    expect(service.feedback()).toBeNull();
    expect(service.feedbackKind()).toBeNull();
  });

  it('persists the cart and restores it when the service is reconstructed', () => {
    service.addToCart(product);
    service.addToCart(product);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [CartService] });

    const restoredService = TestBed.inject(CartService);

    expect(JSON.parse(localStorage.getItem('cart-items') ?? 'null')).toEqual([
      { product, quantity: 2 }
    ]);
    expect(restoredService.items()).toEqual([{ product, quantity: 2 }]);
    expect(restoredService.totalCount()).toBe(2);
  });

  it('ignores malformed persisted cart data', () => {
    localStorage.setItem('cart-items', '{invalid-json');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [CartService] });

    const restoredService = TestBed.inject(CartService);

    expect(restoredService.items()).toEqual([]);
    expect(localStorage.getItem('cart-items')).toBeNull();
  });

  it('ignores persisted items with incomplete products or non-integer quantities', () => {
    localStorage.setItem('cart-items', JSON.stringify([
      { product, quantity: 1.5 },
      { product: { ...product, title: '' }, quantity: 1 },
      { product, quantity: 1 }
    ]));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [CartService] });

    const restoredService = TestBed.inject(CartService);

    expect(restoredService.items()).toEqual([{ product, quantity: 1 }]);
    expect(restoredService.totalPrice()).toBe(10);
  });
});
