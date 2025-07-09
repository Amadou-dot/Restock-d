import { Types } from 'mongoose';
import type { Product } from './Product';

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
  dateAdded: Date;
}

export interface PopulatedCartItem {
  productId: Types.ObjectId;
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
