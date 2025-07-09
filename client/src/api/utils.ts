/**
 * Standard API response interface
 */
export interface ApiResponse {
  message: string;
  [key: string]: unknown;
}

/**
 * Extract data from API response based on expected data type
 */
export const extractResponseData = <T>(
  response: ApiResponse,
  dataKey?: string
): T => {
  if (dataKey) {
    return response[dataKey] as T;
  }

  // Auto-detect data key based on response structure
  const possibleKeys = [
    'products',
    'product',
    'orders',
    'order',
    'cart',
    'items',
    'item',
    'data',
  ];

  for (const key of possibleKeys) {
    if (key in response && key !== 'message') {
      return response[key] as T;
    }
  }

  // If no specific key found, return the whole response minus the message
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { message, ...data } = response;
  return Object.keys(data).length === 1
    ? (Object.values(data)[0] as T)
    : (data as T);
};

/**
 * Handle API fetch with consistent error handling
 */
export const apiFetch = async <T>(
  url: string,
  options?: RequestInit,
  dataKey?: string
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: options?.headers
      ? { ...options.headers }
      : options?.body instanceof FormData
      ? undefined // Don't set headers for FormData, let browser handle it
      : jsonHeaders,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData?.error || errorData?.message || `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return extractResponseData<T>(data, dataKey);
};

/**
 * Standard headers for JSON requests
 */
export const jsonHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Create a request body for JSON requests
 */
export const createJsonBody = (data: Record<string, unknown>): string =>
  JSON.stringify(data);

/**
 * Check if user is authenticated
 */
export const checkAuthenticated = (
  status: { isLoggedIn: boolean } | undefined
): boolean => {
  return !!(status && status.isLoggedIn);
};
