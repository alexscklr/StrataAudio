import { useConsent } from '../hooks/useConsent';
import { Navigate } from 'react-router-dom';
import { ReactNode, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const hasConsent = useConsent();
  const { participantId } = useContext(AuthContext);

  // While checking consent status, don't render anything
  if (hasConsent === null) {
    return null;
  }

  // If consent or participant session is missing, redirect to ConsentPage
  if (!hasConsent || !participantId) {
    return <Navigate to="/" replace />;
  }

  // If consent is given, render the protected content
  return children;
};
