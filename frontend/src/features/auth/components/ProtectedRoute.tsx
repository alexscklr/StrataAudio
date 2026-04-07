import { useConsent } from '../hooks/useConsent';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const hasConsent = useConsent();

  // While checking consent status, don't render anything
  if (hasConsent === null) {
    return null;
  }

  // If no consent, redirect to ConsentPage
  if (!hasConsent) {
    return <Navigate to="/" replace />;
  }

  // If consent is given, render the protected content
  return children;
};
