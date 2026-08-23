import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { CartItem, CartService, Product } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let fixture: ComponentFixture<ProductsComponent>;
  let component: ProductsComponent;
  let productService: {
    getProducts: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
    getProductsByCategory: ReturnType<typeof vi.fn>;
  };
  let cartService: { addToCart: ReturnType<typeof vi.fn>; setQuantity: ReturnType<typeof vi.fn>; items: ReturnType<typeof signal<CartItem[]>> };
  const product: Product = {
    id: 1,
    title: 'Test product',
    price: 10,
    description: 'Description',
    category: 'electronics',
    image: 'image.jpg',
    rating: { rate: 4.5, count: 10 }
  };

  beforeEach(() => {
    productService = {
      getProducts: vi.fn().mockReturnValue(of([product])),
      getCategories: vi.fn().mockReturnValue(of(['electronics'])),
      getProductsByCategory: vi.fn().mockReturnValue(of([product]))
    };
    cartService = { addToCart: vi.fn(), setQuantity: vi.fn(), items: signal<CartItem[]>([]) };
    TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: CartService, useValue: cartService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it('loads products and categories and finishes loading', () => {
    fixture.detectChanges();

    expect(component.products()).toEqual([product]);
    expect(component.categories()).toEqual(['electronics']);
    expect(component.loading()).toBe(false);
  });

  it('renders the product description and rating', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.product-description')?.textContent).toContain('Description');
    expect(element.querySelector('.product-rating')?.textContent).toContain('4.5');
    expect(element.querySelector('.product-rating')?.getAttribute('aria-label'))
      .toContain('4.5 de 5 estrellas');
  });

  it('filters products by the search term', () => {
    const secondProduct = { ...product, id: 2, title: 'Leather wallet', category: 'jewelery' };
    productService.getProducts.mockReturnValue(of([product, secondProduct]));
    fixture.detectChanges();

    component.onSearch({ target: { value: 'wallet' } } as unknown as Event);

    expect(component.filteredProducts()).toEqual([secondProduct]);
  });

  it('opens a product preview and controls the quantity before adding', () => {
    fixture.detectChanges();

    component.openPreview(product);
    component.increasePreviewQuantity();
    component.increasePreviewQuantity();
    component.decreasePreviewQuantity();

    expect(component.selectedProduct()).toEqual(product);
    expect(component.previewQuantity()).toBe(2);
    component.addPreviewToCart(product);

    expect(cartService.setQuantity).toHaveBeenCalledWith(product, 2);
    expect(component.selectedProduct()).toBeNull();
  });

  it('opens the preview with the current quantity from the cart', () => {
    cartService.items.set([{ product, quantity: 3 }]);
    fixture.detectChanges();

    component.openPreview(product);

    expect(component.previewQuantity()).toBe(3);
    expect(component.previewIsInCart()).toBe(true);
  });

  it('shows an empty state when the search has no matches', () => {
    fixture.detectChanges();
    component.onSearch({ target: { value: 'nonexistent' } } as unknown as Event);
    fixture.detectChanges();

    expect(component.filteredProducts()).toEqual([]);
    expect(fixture.nativeElement.querySelector('.search-empty-state')).toBeTruthy();
  });

  it('loads products by the selected category', () => {
    fixture.detectChanges();
    component.onCategoryChange({ target: { value: 'electronics' } } as unknown as Event);

    expect(productService.getProductsByCategory).toHaveBeenCalledWith('electronics');
    expect(component.products()).toEqual([product]);
  });

  it('exposes a user-facing error and stops loading when the catalog fails', () => {
    productService.getProducts.mockReturnValue(throwError(() => new Error('network')));
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.error()).toContain('No pudimos cargar el catálogo');
  });

  it('shows feedback when categories fail to load', () => {
    productService.getCategories.mockReturnValue(throwError(() => new Error('network')));
    fixture.detectChanges();

    expect(component.categoriesError()).toBe('No pudimos cargar las categorías.');
  });

  it('adds the selected product to the cart', () => {
    fixture.detectChanges();
    component.handleAddToCart(product);

    expect(cartService.addToCart).toHaveBeenCalledWith(product);
    expect(component.addedProductIds()).toContain(product.id);
  });

  it('discards the response from a previous category selection', () => {
    const firstResponse = new Subject<Product[]>();
    const secondResponse = new Subject<Product[]>();
    const secondProduct = { ...product, id: 2, title: 'Second product' };
    productService.getProductsByCategory
      .mockImplementation((category: string) => category === 'electronics' ? firstResponse : secondResponse);
    fixture.detectChanges();

    component.onCategoryChange({ target: { value: 'electronics' } } as unknown as Event);
    component.onCategoryChange({ target: { value: 'jewelery' } } as unknown as Event);
    firstResponse.next([product]);
    secondResponse.next([secondProduct]);

    expect(component.products()).toEqual([secondProduct]);
  });

  it('keeps one feedback ID and resets its timer on rapid clicks', () => {
    vi.useFakeTimers();
    try {
      fixture.detectChanges();
      component.handleAddToCart(product);
      vi.advanceTimersByTime(1000);
      component.handleAddToCart(product);

      expect(component.addedProductIds()).toEqual([product.id]);

      vi.advanceTimersByTime(499);
      expect(component.addedProductIds()).toEqual([product.id]);
      vi.advanceTimersByTime(1);
      vi.runOnlyPendingTimers();
      expect(component.addedProductIds()).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });
});
