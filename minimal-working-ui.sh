#!/bin/bash

echo "🔧 Creating minimal working UI to display content..."

# ============================================================================
# Update CSS with better styling and layout
# ============================================================================

cat > src/renderer/styles/globals.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  height: 100vh;
  overflow: hidden;
}

#root {
  height: 100vh;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main Layout */
.main-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar content";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  background: #ffffff;
}

.header {
  grid-area: header;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 1.25rem;
  font-weight: 600;
}

.header-info {
  font-size: 0.875rem;
  opacity: 0.9;
}

.sidebar {
  grid-area: sidebar;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 1rem;
  overflow-y: auto;
}

.nav-menu {
  list-style: none;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: block;
  padding: 0.75rem 1rem;
  color: #64748b;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-link:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.nav-link.active {
  background: #3b82f6;
  color: white;
}

.content {
  grid-area: content;
  padding: 2rem;
  overflow-y: auto;
  background: #f8fafc;
}

/* Auth Layout */
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
}

.auth-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #64748b;
  font-size: 0.875rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  transition: background-color 0.2s;
}

button:hover {
  background: #2563eb;
}

button:active {
  background: #1d4ed8;
}

/* Page Content */
.page-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.page-description {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  margin-top: 1rem;
}

.feature-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-item::before {
  content: "→";
  color: #3b82f6;
  font-weight: bold;
  margin-right: 0.5rem;
}
EOF

# ============================================================================
# Create a proper navigation component
# ============================================================================

cat > src/renderer/components/Navigation.tsx << 'EOF'
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  section?: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/guardian/protect', label: 'Guardian Protect', section: 'Guardian Modules' },
  { path: '/guardian/insight', label: 'Guardian Insight', section: 'Guardian Modules' },
  { path: '/guardian/caretrack', label: 'Guardian CareTrack', section: 'Guardian Modules' },
  { path: '/guardian/carepro', label: 'Guardian CarePro', section: 'Guardian Modules' },
  { path: '/family', label: 'Family Portal' },
  { path: '/emergency', label: 'Emergency Response' },
  { path: '/reporting', label: 'Reporting & Analytics' },
  { path: '/communication', label: 'Communication' },
  { path: '/configuration', label: 'Configuration' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  
  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'Main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <nav className="sidebar">
      <ul className="nav-menu">
        {Object.entries(groupedItems).map(([section, items]) => (
          <li key={section}>
            {section !== 'Main' && (
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase',
                marginTop: '1rem',
                marginBottom: '0.5rem'
              }}>
                {section}
              </div>
            )}
            <ul style={{ listStyle: 'none' }}>
              {items.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};
EOF

# ============================================================================
# Update the main layout to include navigation
# ============================================================================

cat > src/renderer/layouts/MainLayout.tsx << 'EOF'
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
EOF

# ============================================================================
# Update pages to show actual content
# ============================================================================

cat > src/renderer/pages/auth/LoginPage.tsx << 'EOF'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="page-content">
      <h2 className="page-title">Login to Eversight Care</h2>
      <p className="page-description">
        Enter your credentials to access the healthcare management system.
      </p>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit">
          Sign In
        </button>
      </form>
      
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
        <p><strong>Demo credentials:</strong> Any email/password will work for development</p>
      </div>
    </div>
  );
};
EOF

cat > src/renderer/pages/dashboard/DashboardPage.tsx << 'EOF'
import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="status-badge">Module: Dashboard</div>
      <h2 className="page-title">Healthcare Management Dashboard</h2>
      <p className="page-description">
        Welcome to the Eversight Care Desktop System. This comprehensive platform provides 
        advanced healthcare management capabilities for senior care facilities.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🛡️ Guardian Protect</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>AI-powered fall detection and floor monitoring system for rooms 201-210</p>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>📊 Guardian Insight</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Health analytics and predictive modeling for resident care</p>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>📋 Guardian CareTrack</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Care documentation and billing optimization system</p>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🤖 Guardian CarePro</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>AI clinical decision support and telemedicine platform</p>
        </div>
      </div>
      
      <ul className="feature-list">
        <li className="feature-item">Multi-role dashboard system (Caregivers, Family, Admin, Emergency, Residents)</li>
        <li className="feature-item">Real-time mobile-desktop synchronization</li>
        <li className="feature-item">Advanced security with multi-factor authentication</li>
        <li className="feature-item">Comprehensive family engagement portal</li>
        <li className="feature-item">Emergency response and facility coordination</li>
      </ul>
    </div>
  );
};
EOF

cat > src/renderer/pages/guardian/GuardianProtectPage.tsx << 'EOF'
import React from 'react';

export const GuardianProtectPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="status-badge">Module: Guardian Protect</div>
      <h2 className="page-title">Fall Detection & Floor Monitoring</h2>
      <p className="page-description">
        AI-powered fall detection system with comprehensive floor plan monitoring for rooms 201-210.
        Advanced video analytics and real-time emergency response coordination.
      </p>
      
      <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
        <strong style={{ color: '#1e40af' }}>🏗️ Implementation Ready:</strong> This module will include ~12,000 lines of production code
      </div>
      
      <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Core Features</h3>
      <ul className="feature-list">
        <li className="feature-item">Interactive floor plan visualization for rooms 201-210</li>
        <li className="feature-item">Multi-camera video feed integration with AI analysis</li>
        <li className="feature-item">Real-time fall detection with confidence scoring</li>
        <li className="feature-item">Heat map visualization of high-risk zones</li>
        <li className="feature-item">Automated emergency alert system</li>
        <li className="feature-item">Caregiver location tracking and response coordination</li>
        <li className="feature-item">Historical incident analysis and reporting</li>
        <li className="feature-item">Predictive risk assessment modeling</li>
      </ul>
    </div>
  );
};
EOF

# ============================================================================
# Update other Guardian pages similarly
# ============================================================================

cat > src/renderer/pages/guardian/GuardianInsightPage.tsx << 'EOF'
import React from 'react';

export const GuardianInsightPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="status-badge">Module: Guardian Insight</div>
      <h2 className="page-title">Health Analytics & Predictive Modeling</h2>
      <p className="page-description">
        Advanced health analytics platform with AI-powered predictive modeling for 
        population health management and individual care optimization.
      </p>
      
      <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
        <strong style={{ color: '#1e40af' }}>🏗️ Implementation Ready:</strong> This module will include ~10,000 lines of production code
      </div>
      
      <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Analytics Capabilities</h3>
      <ul className="feature-list">
        <li className="feature-item">50+ health data points tracking and analysis</li>
        <li className="feature-item">AI-powered health outcome predictions</li>
        <li className="feature-item">Population health management dashboard</li>
        <li className="feature-item">Risk stratification and early warning systems</li>
        <li className="feature-item">Trend analysis with correlation discovery</li>
        <li className="feature-item">Wellness pattern recognition across residents</li>
        <li className="feature-item">Personalized health recommendations</li>
        <li className="feature-item">Clinical decision support integration</li>
      </ul>
    </div>
  );
};
EOF

# ============================================================================
# Fix the protected route to allow demo access
# ============================================================================

cat > src/renderer/components/auth/ProtectedRoute.tsx << 'EOF'
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
EOF

echo ""
echo "✅ Minimal working UI created!"
echo "🔧 Added:"
echo "   - Professional navigation sidebar"
echo "   - Styled layouts and forms"
echo "   - Content for Dashboard and Guardian modules"
echo "   - Working routing between pages"
echo "   - Demo authentication (any login works)"
echo ""
echo "🚀 The Electron window should now show content!"
echo "   - Navigate between different modules"
echo "   - See the foundation for each Guardian system"
echo "   - Ready for full module implementation"