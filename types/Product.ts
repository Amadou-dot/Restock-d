import { Types } from 'mongoose';

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string; // S3 image URL or file path
  userId: string;
}

// Interface for Mongoose schema
export interface IProduct extends ProductInput {}

// Legacy Product interface for compatibility
export interface Product extends ProductInput {
  _id: Types.ObjectId | string;
  __v: number;
}

// New interface for products response with pagination info
export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  totalProducts: number;
  currentPage: number;
}
