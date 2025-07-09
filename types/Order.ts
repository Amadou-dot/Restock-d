import type { CartItem } from './Cart';
import { Types } from 'mongoose';

export interface OrderItem extends CartItem {
  productName: string;
  productPrice: number;
  image_url: string;
}

export interface OrderInput {
  userId: Types.ObjectId;
  items: OrderItem[];
  status?: 'pending' | 'completed' | 'cancelled';
}

// Interface for Mongoose schema
export interface IOrder extends OrderInput {
  createdAt: Date;
  totalPrice: number;
  invoiceUrl?: string; // Optional invoice URL
}

// Legacy Order interface for compatibility
export interface Order extends OrderInput {
  _id: Types.ObjectId;
  createdAt: Date;
  totalPrice: number;
  invoiceUrl?: string; // Optional invoice URL
}
