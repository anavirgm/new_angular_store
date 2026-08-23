import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { CartItem, Product } from '../../models';

describe('CartComponent', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;
  let cartServiceMock: {
    items: ReturnType<typeof signal<CartItem[]>>;
    totalCount: ReturnType<typeof signal<number>>;
    totalPrice: ReturnType<typeof signal<number>>;
    increaseQuantity: ReturnType<typeof vi.fn>;
    decreaseQuantity: ReturnType<typeof vi.fn>;
    removeFromCart: ReturnType<typeof vi.fn>;
    checkout: ReturnType<typeof vi.fn>;
  };

  const mockProduct: Product = {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'A great bag',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
  };

  const mockItem: CartItem = {
    product: mockProduct,
    quantity: 2
  };

  beforeEach(() => {
    cartServiceMock = {
      items: signal<CartItem[]>([]),
      totalCount: signal(0),
      totalPrice: signal(0),
      increaseQuantity: vi.fn(),
      decreaseQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      checkout: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: cartServiceMock }
      ]
    });

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the empty cart state when no items are present', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
    expect(compiled.textContent).toContain('Tu carrito está vacío');
  });

  it('renders cart items and summary when items are in the cart', () => {
    cartServiceMock.items.set([mockItem]);
    cartServiceMock.totalCount.set(2);
    cartServiceMock.totalPrice.set(219.9);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-items')).toBeTruthy();
    expect(compiled.textContent).toContain('Fjallraven Backpack');
    expect(compiled.textContent).toContain('$219.90');
  });

  it('calls increaseQuantity and decreaseQuantity on button clicks', () => {
    cartServiceMock.items.set([mockItem]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll<HTMLButtonElement>('.quantity-control button');
    
    // Decrement button
    buttons[0].click();
    expect(cartServiceMock.decreaseQuantity).toHaveBeenCalledWith(mockProduct.id);

    // Increment button
    buttons[1].click();
    expect(cartServiceMock.increaseQuantity).toHaveBeenCalledWith(mockProduct.id);
  });

  it('calls removeFromCart when delete button is clicked', () => {
    cartServiceMock.items.set([mockItem]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const removeBtn = compiled.querySelector<HTMLButtonElement>('button[title="Eliminar del carrito"]');
    removeBtn?.click();

    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it('calls checkout when finalize button is clicked', () => {
    cartServiceMock.items.set([mockItem]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const checkoutBtn = compiled.querySelector<HTMLButtonElement>('.checkout-button');
    checkoutBtn?.click();

    expect(cartServiceMock.checkout).toHaveBeenCalled();
  });
});
