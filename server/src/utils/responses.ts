import { Response } from 'express';

/**
 * Standard response interface for API responses
 */
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  [key: string]: any;
}

/**
 * Send a successful response with consistent structure
 * @param res - Express response object
 * @param message - Success message
 * @param data - Optional data to include in response
 * @param statusCode - HTTP status code (default: 200)
 * @param additionalFields - Any additional fields to include in the response
 */
export const sendSuccessResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  additionalFields?: Record<string, any>
): Response => {
  const response: ApiResponse<T> = {
    message,
    ...additionalFields,
  };

  // Only add data if it's provided
  if (data !== undefined) {
    // Use appropriate property name based on data type
    if (Array.isArray(data)) {
      // For arrays, try to infer the property name from the data
      const dataKey = inferArrayPropertyName(data);
      response[dataKey] = data;
    } else {
      // For single objects, try to infer the property name
      const dataKey = inferObjectPropertyName(data);
      response[dataKey] = data;
    }
  }

  return res.status(statusCode).json(response);
};

/**
 * Infer property name for array data
 */
const inferArrayPropertyName = (data: any[]): string => {
  if (data.length === 0) return 'items';
  
  const firstItem = data[0];
  if (firstItem && typeof firstItem === 'object') {
    // Check if it looks like a product
    if ('name' in firstItem && 'price' in firstItem) return 'products';
    // Check if it looks like an order
    if ('items' in firstItem && 'totalPrice' in firstItem) return 'orders';
    // Check if it looks like a cart item
    if ('productId' in firstItem && 'quantity' in firstItem) return 'items';
  }
  
  return 'items'; // fallback
};

/**
 * Infer property name for single object data
 */
const inferObjectPropertyName = (data: any): string => {
  if (!data || typeof data !== 'object') return 'data';
  
  // Check if it looks like a product
  if ('name' in data && 'price' in data) return 'product';
  // Check if it looks like an order
  if ('items' in data && 'totalAmount' in data) return 'order';
  // Check if it looks like a cart
  if ('items' in data && Array.isArray(data.items)) return 'cart';
  // Check if it's just an ID (for delete operations)
  if (typeof data === 'string' || ('_id' in data && Object.keys(data).length === 1)) return 'deletedId';
  
  return 'data'; // fallback
};

/**
 * Common success messages
 */
export const MESSAGES = {
  // Product messages
  PRODUCTS_RETRIEVED: 'Products retrieved successfully',
  PRODUCT_RETRIEVED: 'Product retrieved successfully',
  TOTAL_PAGES_RETRIEVED: 'Total pages retrieved successfully',
  PRODUCT_ADDED: 'Product added successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  NO_PRODUCTS_FOUND: 'No products found',
  
  // Cart messages
  CART_RETRIEVED: 'Cart retrieved successfully',
  ITEM_ADDED_TO_CART: 'Product added to cart successfully',
  ITEM_REMOVED_FROM_CART: 'Product removed from cart successfully',
  CART_CLEARED: 'Cart cleared successfully',
  
  // Order messages
  ORDER_PLACED: 'Order placed successfully',
  ORDERS_RETRIEVED: 'Orders retrieved successfully',
  ORDER_RETRIEVED: 'Order retrieved successfully',
} as const;
