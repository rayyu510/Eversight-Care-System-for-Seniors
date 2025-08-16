import React, { createContext } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue: ThemeContextType = {
    theme: 'light',
    toggleTheme: () => {}
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
