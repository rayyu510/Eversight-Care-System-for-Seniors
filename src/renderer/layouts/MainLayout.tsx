import React from 'react';
import { Navigation } from '../components/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <header className="header">
        <h1>Eversight Care Desktop</h1>
        <div className="header-info">
          Healthcare Management System v1.0
        </div>
      </header>
      <Navigation />
      <main className="content">
        {children}
      </main>
    </div>
  );
};
