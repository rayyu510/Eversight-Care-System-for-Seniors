import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue: AuthContextType = {
    user: null,
    login: async () => {},
    logout: () => {}
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
