export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string; // S3 image URL or file path
  userId: string;
}

// Client-side Product interface - uses string for _id
export interface Product extends ProductInput {
  _id: string;
  __v: number;
}

// Interface for products response with pagination info
export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  totalProducts: number;
  currentPage: number;
}
