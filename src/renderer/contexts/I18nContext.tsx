import React, { createContext } from 'react';

interface I18nContextType {
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue: I18nContextType = {
    language: 'en',
    setLanguage: () => {},
    t: (key: string) => key
  };

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};
