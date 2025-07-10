import type { Product } from './Product';

export interface CartItem {
  productId: string;
  quantity: number;
  dateAdded: Date;
}

export interface PopulatedCartItem {
  productId: string;
  product: Product;
  quantity: number;
  dateAdded: Date;
}

export type Cart = {
  items: CartItem[];
  totalQuantity: number; // Total number of items in the cart
  totalPrice: number; // Total price of all items in the cart
  lastUpdated: Date;
};

export type PopulatedCart = {
  items: PopulatedCartItem[];
  totalQuantity: number; // Total number of items in the cart
  totalPrice: number; // Total price of all items in the cart
  lastUpdated: Date;
};

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}
