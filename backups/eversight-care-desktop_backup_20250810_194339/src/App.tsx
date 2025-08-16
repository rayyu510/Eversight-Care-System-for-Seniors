import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Copy, Eye } from 'lucide-react';
import TemplateLibrary from './pages/TemplateLibrary';
import GuardianProtectDashboard from './guardian-protect/components/Dashboard/GuardianProtectDashboard';

function App() {
    console.log('App.tsx is loading in browser!');
    alert('App.tsx is running in browser!'); // You should see this popup
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleNavigate = (path) => {
        console.log('Navigating to:', path); // ADD THIS DEBUG LINE
        window.history.pushState({}, '', path);
        setCurrentPath(path);
        // REMOVE THIS LINE: window.location.reload();
    };

    console.log('App rendering, currentPath:', currentPath); // ADD THIS DEBUG LINE

    return (
        <div className="app">
            {/* ADD THIS DEBUG INFO */}
            <div style={{ backgroundColor: 'yellow', padding: '10px', margin: '10px' }}>
                <strong>DEBUG: Current Path = {currentPath}</strong>
            </div>

            <nav>
                <button onClick={() => handleNavigate('/guardian-protect')}>
                    Guardian Protect
                </button>
                <button onClick={() => handleNavigate('/templates')}>
                    Template Library
                </button>
            </nav>

            <main>
                {currentPath === '/guardian-protect' && (
                    <GuardianProtectDashboard />
                )}

                {currentPath === '/templates' && (
                    <TemplateLibrary />
                )}

                {currentPath === '/' && (
                    <GuardianProtectDashboard />
                )}
            </main>
        </div>
    );
}

export default App;