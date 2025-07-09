import type { Document } from 'mongoose';
import type { Cart, PopulatedCart } from './Cart';
import type { Order } from './Order';
import type { Product } from './Product';
// Interface for Mongoose schema (without Document properties)
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cart: Cart;
  resetToken?: string; // Optional reset token for password reset functionality
  resetTokenExpiration?: Date; // Optional expiration date for the reset token
}

// Define the document interface with methods
export interface IUserDocument extends IUser, Document {
  /**
   * Adds a product to the user's cart.
   * @param {IProduct} product - The product to add to the cart.
   * @param {number} [quantity=1] - The quantity of the product to add. Defaults to 1.
   * @return {Promise<void>} A promise that resolves when the product is added.
   * @throws {Error} If the quantity is less than or equal to 0.
   */
  addToCart(product: Product, quantity?: number): Promise<void>;
  /**
   * Deletes an item from the user's cart.
   * @param {string} productId - The ID of the product to remove from the cart.
   * @return {Promise<void>} A promise that resolves when the item is removed.
   */
  deleteItemFromCart(productId: string): Promise<void>;
  /**
   * Clears the user's cart.
   * @return {Promise<void>} A promise that resolves when the cart is cleared.
   */
  clearCart(): Promise<void>;
  /**
   * Retrieves the user's cart.
   * @return {Promise<Cart>} A promise that resolves to the user's cart. Only includes item IDs and quantities.
   * Use `getPopulatedCart` for detailed product information.
   * @throws {Error} If there are issues retrieving the cart.
   */
  getCart(): Promise<Cart>;
  /**
   * Retrieves the user's cart with populated product details.
   * @return {Promise<PopulatedCart>} A promise that resolves to the populated cart.
   * @throws {Error} If there are issues retrieving the populated cart.
   */
  getPopulatedCart(): Promise<PopulatedCart>;
  /**
   * Places an order based on the current user's cart.
   * @return {Promise<void>} A promise that resolves when the order is placed.
   * @throws {Error} If the cart is empty or there are issues placing the order.
   */
  placeOrder(): Promise<void>;
  /**
   * Retrieves all orders placed by the user.
   * @return {Promise<Order[]>} A promise that resolves to an array of orders.
   * @throws {Error} If there are issues retrieving the orders.
   */
  getOrders(): Promise<Order[]>;

  /**
   * Retrieves all products created by the user.
   * @return {Promise<ProductsResponse>} A promise that resolves to products with pagination info.
   * @throws {Error} If there are issues retrieving the products.
   */
  getCreatedProducts(page: number): Promise<{
    products: Product[];
    totalPages: number;
    totalProducts: number;
    currentPage: number;
  }>;
}
