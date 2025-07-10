import { useMutation, useQuery } from '@tanstack/react-query';
import type { Order } from '../../../types/Order';
import { apiFetch } from './utils';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Custom hook to place an order for the current user's cart.
 */
export const usePlaceOrder = () => {
  return useMutation({
    mutationKey: ['placeOrder'],
    mutationFn: async () => {
      return apiFetch<{ id: string; url: string }>(`${SERVER_URL}/placeOrder`, {
        method: 'POST',
      }, 'data'); // Specify 'data' as the key since server uses 'data' for this response
    },
    retry: 1,
  });
};

/**
 * Custom hook to fetch the current user's orders.
 */
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const orders = await apiFetch<Order[]>(
        `${SERVER_URL}/getOrders`,
        undefined,
        'orders'
      );
      if (!orders || orders.length === 0) return [];
      return orders;
    },
    retry: 3,
  });
};

/**
 * Custom hook to fetch a pdf invoice URL for a specific order.
 */
export const useGetInvoice = (orderId: string) => {
  return useQuery({
    queryKey: ['invoice', orderId],
    queryFn: async (): Promise<{ invoiceUrl: string }> => {
      const response = await apiFetch<Record<string, unknown>>(
        `${SERVER_URL}/getInvoice/${orderId}`,
        undefined
      );

      // Handle different response structures
      if (
        response &&
        'invoiceUrl' in response &&
        typeof response.invoiceUrl === 'string'
      ) {
        return { invoiceUrl: response.invoiceUrl };
      }
      if (
        response &&
        'data' in response &&
        typeof response.data === 'object' &&
        response.data &&
        'invoiceUrl' in response.data &&
        typeof response.data.invoiceUrl === 'string'
      ) {
        return { invoiceUrl: response.data.invoiceUrl };
      }

      throw new Error('Failed to fetch invoice URL');
    },
    retry: 3,
    staleTime: 0, // Always refetch to get latest status
  });
};
