import type { ReactNode } from 'react';
import Title from '../Title';

interface PageLayoutProps {
  children?: ReactNode;
  className?: string;
  title?: string;
}

export default function PageLayout({
  children,
  className = '',
  title = '',
}: PageLayoutProps) {
  return (
    <div className={`p-8 min-h-screen ${className}`}>
      <Title text={title} />
      {children && children}
    </div>
  );
}
