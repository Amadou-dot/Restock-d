import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../api/auth';
import { checkAuthenticated } from '../api/utils';

interface AuthCheckResult {
  isPending: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

/**
 * Custom hook for authentication checks with automatic redirection
 */
export const useAuthCheck = (navigateTo: string): AuthCheckResult => {
  const navigate = useNavigate();
  const { data: status, isPending, error } = useAuthStatus();

  const isAuthenticated = checkAuthenticated(status);

  useEffect(() => {
    // Only redirect if we're not loading and not authenticated
    if (!isPending && !error && !isAuthenticated) {
      navigate(navigateTo);
    }
  }, [isPending, error, isAuthenticated, navigate, navigateTo]);
  
  useEffect(() => {
    if (!isPending && error) console.log('Authentication check failed:', error);
  }, [error, isPending]);

  return {
    isPending,
    isAuthenticated,
    error,
  };
};

/**
 * Simple authentication check hook
 */
export const useIsAuthenticated = (): boolean => {
  const { data: status } = useAuthStatus();
  return checkAuthenticated(status);
};
