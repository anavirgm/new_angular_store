import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService, Product } from '../../services/cart.service';
import { catchError, EMPTY, finalize, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  template: `
    <div class="page-shell catalog-page">
      
      <!-- Header y Filtro Responsivo -->
      <div class="section-heading">
        <div>
          <span class="eyebrow">Colección</span>
          <h2>Productos Destacados</h2>
        </div>

        <div class="category-filter">
          <label for="category">Categoría</label>
          <select id="category" (change)="onCategoryChange($event)">
            <option value="">Todas</option>
            @for (cat of categories(); track cat) {
              <option [value]="cat">{{ cat | titlecase }}</option>
            }
          </select>
        </div>
        @if (categoriesError()) {
          <p class="filter-feedback" role="status">{{ categoriesError() }}</p>
        }
      </div>

      <!-- Spinner y Skeleton Loading -->
        <div class="search-field">
          <label for="product-search">Buscar producto</label>
          <input
            id="product-search"
            type="search"
            [value]="searchTerm()"
            (input)="onSearch($event)"
            placeholder="Nombre, categoría o descripción"
            autocomplete="off"
          />
        </div>
      @if (loading()) {
        <div class="loading-state" aria-label="Cargando catálogo" aria-busy="true">
          <div class="spinner" aria-hidden="true"></div>
          <p>Cargando catálogo...</p>
        </div>
        <div class="product-skeleton-grid" aria-hidden="true">
          @for (skeleton of [1, 2, 3, 4]; track skeleton) {
            <div class="product-skeleton" aria-hidden="true">
              <div class="skeleton-image"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line skeleton-line-short"></div>
            </div>
          }
        </div>
      } @else {
        @if (error()) {
          <div class="alert alert-error" role="alert">
            {{ error() }}
          </div>
        }
        <!-- Grid Responsivo -->
        @if (filteredProducts().length === 0) {
          <div class="empty-state search-empty-state">
            <h3>No encontramos productos</h3>
            <p>Prueba con otro término de búsqueda o cambia la categoría.</p>
          </div>
        } @else {
          <div class="product-grid">
            @for (product of filteredProducts(); track product.id) {
            <article class="product-card">
              
              <div>
                <div class="product-image">
                  <img [src]="product.image" [alt]="product.title" />
                </div>
                
                <span class="product-category">
                  {{ product.category }}
                </span>
                
                <h3 class="product-title">
                  {{ product.title }}
                </h3>
                <p class="product-description">{{ product.description }}</p>
                @if (product.rating; as rating) {
                  <div class="product-rating" [attr.aria-label]="rating.rate + ' de 5 estrellas, ' + rating.count + ' valoraciones'">
                    <span aria-hidden="true">★</span>
                    <strong>{{ rating.rate.toFixed(1) }}</strong>
                    <span>({{ rating.count }})</span>
                  </div>
                }
              </div>

              <div class="product-footer">
                <span class="product-price">\${{ product.price }}</span>
                
                <!-- Boton con Feedback Visual -->
                <button class="button button-primary product-button"
                  (click)="handleAddToCart(product)"
                  [class.button-success]="addedProductIds().includes(product.id)">
                  {{ addedProductIds().includes(product.id) ? '✓ Agregado' : 'Agregar' }}
                </button>
              </div>

            </article>
            }
          </div>
        }
      }
    </div>

  `
})
export class ProductsComponent implements OnDestroy, OnInit {
  private productService = inject(ProductService);
  public cartService = inject(CartService);

  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal<boolean>(true);
  error = signal('');
  categoriesError = signal('');
  addedProductIds = signal<number[]>([]);
  searchTerm = signal('');
  filteredProducts = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    if (!search) {
      return this.products();
    }
    return this.products().filter(product =>
      [product.title, product.description, product.category]
        .some(value => value.toLowerCase().includes(search))
    );
  });
  private readonly categorySelection = new Subject<string>();
  private readonly destroy$ = new Subject<void>();
  private readonly feedbackTimers = new Map<number, ReturnType<typeof setTimeout>>();

  ngOnInit() {
    this.categorySelection.pipe(
      switchMap(category => this.loadProducts(category)),
      takeUntil(this.destroy$)
    ).subscribe(data => this.products.set(data));
    this.categorySelection.next('');

    this.productService.getCategories().pipe(
      catchError(() => {
        this.categoriesError.set('No pudimos cargar las categorías.');
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => this.categories.set(data));
  }

  private loadProducts(category: string) {
    this.loading.set(true);
    this.error.set('');
    const request = category
      ? this.productService.getProductsByCategory(category)
      : this.productService.getProducts();

    return request.pipe(
      catchError(() => {
        this.error.set('No pudimos cargar el catálogo. Intenta de nuevo.');
        return EMPTY;
      }),
      finalize(() => this.loading.set(false))
    );
  }

  handleAddToCart(product: Product) {
    this.cartService.addToCart(product);
    
    // Feedback activo temporalmente (1.5 segundos)
    this.addedProductIds.update(ids => ids.includes(product.id) ? ids : [...ids, product.id]);
    const previousTimer = this.feedbackTimers.get(product.id);
    if (previousTimer) {
      clearTimeout(previousTimer);
    }
    const timer = setTimeout(() => {
      this.addedProductIds.update(ids => ids.filter(id => id !== product.id));
      this.feedbackTimers.delete(product.id);
    }, 1500);
    this.feedbackTimers.set(product.id, timer);
  }

  onCategoryChange(event: Event) {
    const category = (event.target as HTMLSelectElement).value;
    this.categorySelection.next(category);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.categorySelection.complete();
    this.feedbackTimers.forEach(timer => clearTimeout(timer));
    this.feedbackTimers.clear();
    this.addedProductIds.set([]);
  }
}