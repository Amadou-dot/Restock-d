import { addToast } from '@heroui/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CartItem, PopulatedCart } from '../../../types/Cart';
import { apiFetch, createJsonBody } from './utils';

const SERVER_URL = 'http://localhost:3000/api';

/**
 * Custom hook to fetch the current user's cart
 * Returns a PopulatedCart object containing items and total price
 */
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async (): Promise<PopulatedCart> => {
      return apiFetch<PopulatedCart>(
        `${SERVER_URL}/getCart`,
        undefined,
        'cart'
      );
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Custom hook to add a product to the current user's cart
 * Accepts the product ID to be added
 * Defaults the quantity to 1
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string): Promise<CartItem> => {
      return apiFetch<CartItem>(
        `${SERVER_URL}/addToCart`,
        {
          method: 'POST',
          body: createJsonBody({ productId, quantity: 1 }), // Default quantity to 1
        },
        'item'
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Error',
        description: error.message,
        color: 'warning',
      });
    },
  });
};

/**
 * Custom hook to decrement the quantity of an item in the cart
 * Accepts the item ID to be removed
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string): Promise<void> => {
      return apiFetch<void>(`${SERVER_URL}/removeFromCart/${itemId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // Invalidate the cart query to refresh it
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({
        title: 'Success',
        description: 'Item removed from cart',
        color: 'success',
        timeout: 1000,
      });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Error',
        description: error.message,
        color: 'warning',
      });
    },
  });
};

/**
 * Custom hook to clear the current user's cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      return apiFetch<void>(`${SERVER_URL}/clearCart`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // Invalidate the cart query to refresh it
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({
        title: 'Success',
        description: 'Cart cleared successfully',
        color: 'success',
      });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Error',
        description: error.message,
        color: 'warning',
      });
    },
  });
};
