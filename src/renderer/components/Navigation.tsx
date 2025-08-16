import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Users, Camera, Activity, Calendar, FileText } from 'lucide-react';

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

  // TEMPLATE CONFIGURATION SYSTEM - New Section
  { path: '/templates', label: 'Template Library', section: 'Configuration & Setup' },
  { path: '/templates/builder', label: 'Create Template', section: 'Configuration & Setup' },
  { path: '/templates/floor-plans', label: 'Floor Plan Setup', section: 'Configuration & Setup' },
  { path: '/templates/cameras', label: 'Camera Configuration', section: 'Configuration & Setup' },
  { path: '/templates/residents', label: 'Resident Setup', section: 'Configuration & Setup' },
  { path: '/templates/staff', label: 'Staff Management', section: 'Configuration & Setup' },
  { path: '/templates/emergency', label: 'Emergency Plans', section: 'Configuration & Setup' },
  { path: '/templates/import-export', label: 'Data Import/Export', section: 'Configuration & Setup' },

  { path: '/configuration', label: 'System Configuration' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'Main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  // Helper function to get icon for nav items
  const getNavIcon = (path: string) => {
    if (path.includes('/guardian/protect')) return <Shield className="h-4 w-4 mr-2" />;
    if (path.includes('/guardian/insight')) return <Activity className="h-4 w-4 mr-2" />;
    if (path.includes('/guardian/care')) return <Users className="h-4 w-4 mr-2" />;
    if (path.includes('/templates/cameras')) return <Camera className="h-4 w-4 mr-2" />;
    if (path.includes('/templates/floor-plans')) return <Shield className="h-4 w-4 mr-2" />;
    if (path.includes('/templates/staff')) return <Users className="h-4 w-4 mr-2" />;
    if (path.includes('/templates/emergency')) return <Shield className="h-4 w-4 mr-2" />;
    if (path.includes('/templates')) return <FileText className="h-4 w-4 mr-2" />;
    if (path.includes('/emergency')) return <Shield className="h-4 w-4 mr-2" />;
    if (path.includes('/reporting')) return <Activity className="h-4 w-4 mr-2" />;
    if (path.includes('/configuration')) return <FileText className="h-4 w-4 mr-2" />;
    return <FileText className="h-4 w-4 mr-2" />;
  };

  // Helper function to check if current path is in template section
  const isTemplateActive = (itemPath: string) => {
    const currentPath = location.pathname;
    if (itemPath.includes('/templates')) {
      return currentPath.includes('/templates');
    }
    return currentPath === itemPath;
  };

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
                marginBottom: '0.5rem',
                paddingLeft: '0.5rem'
              }}>
                {section}
              </div>
            )}
            <ul style={{ listStyle: 'none' }}>
              {items.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to="/template"
                    className={`nav-link ${isTemplateActive(item.path) ? 'active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      margin: '0.125rem 0',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      color: isTemplateActive(item.path) ? '#1d4ed8' : '#374151',
                      backgroundColor: isTemplateActive(item.path) ? '#dbeafe' : 'transparent',
                      fontWeight: isTemplateActive(item.path) ? '600' : '400',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      if (!isTemplateActive(item.path)) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.color = '#1f2937';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isTemplateActive(item.path)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#374151';
                      }
                    }}
                  >
                    {getNavIcon('/templates')}
                    <span>Template Library</span>

                    {/* Badge for new template features */}
                    {item.path.includes('/templates') && item.path !== '/templates/import-export' && (
                      <span style={{
                        marginLeft: 'auto',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontSize: '0.625rem',
                        fontWeight: '600',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase'
                      }}>
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Quick Access Template Actions */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#9ca3af',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          Quick Actions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link
            to="/templates/builder"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.375rem 0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            <FileText className="h-3 w-3 mr-2" />
            Create Template
          </Link>
          <Link
            to="/templates"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.375rem 0.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            <Activity className="h-3 w-3 mr-2" />
            View Templates
          </Link>
        </div>
      </div>
    </nav>
  );
};