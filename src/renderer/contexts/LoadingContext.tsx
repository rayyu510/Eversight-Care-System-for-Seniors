import React, { createContext } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue: LoadingContextType = {
    isLoading: false,
    setLoading: () => {}
  };

  return <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>;
};
