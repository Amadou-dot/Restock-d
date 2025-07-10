import type { CartItem } from './Cart';

export interface OrderItem extends CartItem {
  productName: string;
  productPrice: number;
  image_url: string;
}

export interface OrderInput {
  userId: string;
  items: OrderItem[];
  status?: 'pending' | 'completed' | 'cancelled';
}

// Order interface for client
export interface Order extends OrderInput {
  _id: string;
  createdAt: Date;
  totalPrice: number;
  invoiceUrl?: string; // Optional invoice URL
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
