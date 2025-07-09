import type { ReactNode } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import PageLayout from '../components/layouts/PageLayout';
import { useAuthCheck } from './authHooks';

/**
 * Component that renders loading/error states and redirects if not authenticated
 */
export const AuthProtected = ({
  children,
  title = 'Page',
  className = '',
  navigateTo = '/login',
}: {
  children: ReactNode;
  title?: string;
  className?: string;
  navigateTo?: string;
}) => {
  const { isPending, isAuthenticated, error } = useAuthCheck(navigateTo);

  // Loading state
  if (isPending) {
    return <PageLayout className={className} title={title} />;
  }

  // Error state
  if (error) {
    return (
      <PageLayout className={className} title={title}>
        <ErrorMessage description={error.message} />
      </PageLayout>
    );
  }

  // Not authenticated - redirect will happen via useEffect in useAuthCheck
  if (!isAuthenticated) {
    return <PageLayout className={className} title={title} />;
  }

  // Authenticated - render children
  return (
    <PageLayout className={className} title={title}>
      {children}
    </PageLayout>
  );
};
