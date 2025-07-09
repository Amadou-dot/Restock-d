import { addToast } from '@heroui/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Product, ProductInput, ProductsResponse } from '../../../types/Product';
import { apiFetch, createJsonBody } from './utils.js';

const SERVER_URL = 'http://localhost:3000/api';
const SERVER_URL_ADMIN = 'http://localhost:3000/api/admin';

// Query functions

/**
 * Custom hook to fetch all products
 */
export const useProducts = (page: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: async (): Promise<ProductsResponse> => {
      const response = await apiFetch<ProductsResponse>(
        `${SERVER_URL}/getProducts?page=${page}`,
        undefined,
        'data'
      );
      if (!response || !response.products) {
        return {
          products: [],
          totalPages: 0,
          totalProducts: 0,
          currentPage: page,
        };
      }
      return response;
    },
    enabled: options?.enabled,
  });
};

/**
 * Custom hook to fetch all products for admin
 * This is used in the admin dashboard to manage products
 */
export const useAdminProducts = (page: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['adminProducts', page],
    queryFn: async (): Promise<ProductsResponse> => {
      const response = await apiFetch<ProductsResponse>(
        `${SERVER_URL_ADMIN}/getProducts?page=${page}`,
        { credentials: 'include' },
        'data'
      );
      if (!response || !response.products) {
        return {
          products: [],
          totalPages: 0,
          totalProducts: 0,
          currentPage: page,
        };
      }
      return response;
    },
    retry: 1, // Retry fetching products up to 3 times
    enabled: options?.enabled,
  });
};

/**
 * Custom hook to fetch a single product by its ID
 */
export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      const product = await apiFetch<Product>(
        `${SERVER_URL}/getProduct/${id}`,
        undefined,
        'product'
      );
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    },
    enabled: !!id, // Only run if id is provided
    retry: 3, // Retry fetching the product up to 3 times
  });
};

// Mutation functions

/**
 * Custom hook to add a new product to the database
 */
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      productData: Omit<ProductInput, 'userId'> | FormData
    ): Promise<Product> => {
      // Handle FormData (for file uploads) vs regular JSON data
      const requestOptions: RequestInit = {
        method: 'POST',
      };

      if (productData instanceof FormData) {
        // For file uploads, don't set Content-Type header - let browser set it with boundary
        requestOptions.body = productData;
      } else {
        // For regular JSON data
        requestOptions.body = createJsonBody(productData);
        requestOptions.headers = { 'Content-Type': 'application/json' };
      }

      return apiFetch<Product>(
        `${SERVER_URL_ADMIN}/addProduct`,
        requestOptions,
        'product'
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      addToast({
        title: 'Product added successfully',
        color: 'success',
      });
    },
  });
};

/**
 * Custom hook to edit an existing product
 * Accepts a partial product object to update
 */
export const useEditProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      productData: Partial<Product> | FormData
    ): Promise<Partial<Product>> => {
      const requestOptions: RequestInit = {
        method: 'PATCH',
      };

      if (productData instanceof FormData) {
        // For file uploads, don't set Content-Type header
        requestOptions.body = productData;
      } else {
        // For regular JSON data
        requestOptions.body = createJsonBody(productData);
        requestOptions.headers = { 'Content-Type': 'application/json' };
      }

      return apiFetch<Partial<Product>>(
        `${SERVER_URL_ADMIN}/editProduct`,
        requestOptions
      );
    },
    onSuccess: () => {
      addToast({ title: 'Product edited successfully', color: 'success' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },

    onError: (error: Error) =>
      addToast({
        title: 'Failed to edit product',
        description: error.message,
        color: 'danger',
        timeout: 10000, // 10 seconds
      }),
  });
};

/**
 * Custom hook to delete a product by its ID
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      return apiFetch(`${SERVER_URL_ADMIN}/deleteProduct/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      addToast({ title: 'Product successfully deleted', color: 'success' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
    onError: (error: Error) =>
      addToast({
        title: 'Failed to delete product',
        description: error.message,
        color: 'danger',
        timeout: 10000, // 10 seconds
      }),
  });
};
