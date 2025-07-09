import { addToast } from '@heroui/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { apiFetch, createJsonBody } from './utils';

const AUTH_URL = 'http://localhost:3000/api/auth';

/**
 * Fetches the current authentication status of the user.
 * @return A query hook that returns the authentication status.
 * This hook checks if the user is logged in or not.
 * It uses a GET request to the /status endpoint.
 * The response includes a boolean indicating if the user is logged in.
 * The data is considered fresh for 5 minutes.
 * If the user is logged in, it returns an object with `isLoggedIn: true`.
 * If the user is not logged in, it returns `isLoggedIn: false`.
 * Example usage:
 * ```javascript
 * const { data, isLoading, error } = useAuthStatus();
 * if (isLoading) {
 *   return <div>Loading...</div>;
 * }
 * if (error) {
 *  return <div>Error: {error.message}</div>;
 * }
 * return <div>User is {data.isLoggedIn ? 'logged in' : 'not logged in'}</div>;
 * ```
 * @returns A query hook for the authentication status.
 * This hook can be used to determine if the user is logged in or not.
 * It automatically handles caching and refetching of the status.
 * It is useful for components that need to display different content based on the user's authentication state.
 * @example
 * ```javascript
 * const { data: authStatus } = useAuthStatus();
 * if (authStatus.isLoggedIn) {
 *  return <div>Welcome back!</div>;
 * } else {
 *  return <div>Please log in.</div>;
 * }
 * ```
 **/
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      return apiFetch<{ isLoggedIn: boolean }>(`${AUTH_URL}/status`);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**Login mutation
 * @returns A mutation hook for logging in a user.
 * This hook can be used to log in a user with their email and password.
 * It sends a POST request to the /login endpoint with the user's credentials.
 * The response includes the user's email and a boolean indicating if the login was successful.
 * Example usage:
```javascript
 * const { mutate: login, isLoading, error } = useLogin();
 * const handleLogin = (email, password) => {
 *   login({ email, password });
 * };
 * ```
 */

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return apiFetch<{ user: { email: string }; isLoggedIn: boolean }>(
        `${AUTH_URL}/login`,
        {
          method: 'POST',
          body: createJsonBody(data),
        }
      );
    },
    onSuccess: () => {
      // Invalidate auth status to refresh login state
      queryClient.invalidateQueries({ queryKey: ['authStatus'] });
    },
  });
};

/**
 * Sign up mutation
 * @returns A mutation hook for signing up a new user.
 */
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      return apiFetch<{ user: { email: string }; isLoggedIn: boolean }>(
        `${AUTH_URL}/signup`,
        {
          method: 'POST',
          body: createJsonBody(data),
        }
      );
    },
    onSuccess: () => {
      // Invalidate auth status to refresh login state
      queryClient.invalidateQueries({ queryKey: ['authStatus'] });
    },
  });
};

/**
 * Logout mutation
 * @returns A mutation hook for logging out the user.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiFetch<{ isLoggedIn: boolean }>(`${AUTH_URL}/logout`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      // Invalidate auth status to refresh login state
      queryClient.invalidateQueries({ queryKey: ['authStatus'] });
    },
    onError: (error: Error) => {
      addToast({
        description: `Logout failed: ${error.message}`,
        color: 'danger',
      });
    },
  });
};

export const useCsrfToken = () => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await apiFetch<{ csrfToken: string }>(
          `${AUTH_URL}/csrf-token`
        );
        setToken(response.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);
  return token;
};

/**
 * Sends a password reset email to the user.
 * @param email - The user's email address to send the reset link.
 * @returns A mutation hook for password reset functionality.
 */
export const usePasswordReset = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return apiFetch<{ message: string }>(`${AUTH_URL}/password-reset`, {
        method: 'POST',
        body: createJsonBody({ email }),
      });
    },
    onSuccess: () => {
      addToast({
        description: 'Password reset email sent successfully.',
        color: 'success',
      });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Password Reset Failed',
        description: error.message,
        color: 'danger',
      });
    },
  });
};

/**
 * Updates the user's password using a reset token.
 * @param data - An object containing the reset token, new password, and confirmation password.
 * @returns A mutation hook for updating the password.
 */
export const useNewPassword = () => {
  return useMutation({
    mutationFn: async (data: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => {
      return apiFetch<{ message: string }>(`${AUTH_URL}/new-password`, {
        method: 'POST',
        body: createJsonBody(data),
      });
    },
    onSuccess: () => {
      addToast({
        description: 'Password updated successfully.',
        color: 'success',
      });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Update Password Failed',
        description: error.message,
        color: 'danger',
      });
    },
  });
};
