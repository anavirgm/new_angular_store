import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type FeedbackKind = 'normal' | 'checkout';
