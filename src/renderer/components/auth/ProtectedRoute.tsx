import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // For development demo, always allow access
  // In production, this would check actual authentication state
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    return <div>Please log in to access the application.</div>;
  }
  
  return <>{children}</>;
};
