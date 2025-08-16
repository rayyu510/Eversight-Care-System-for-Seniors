import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">EverSight Care Desktop Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Guardian Protect</h3>
                <p className="text-gray-600 text-sm">Fall detection & monitoring system</p>
                <Link to="/guardian/protect" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Open Guardian Protect →
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Template System</h3>
                <p className="text-gray-600 text-sm">No-code configuration templates</p>
                <Link to="/templates" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Configure Templates →
                </Link>
            </div>
        </div>
    </div>
);

export default Dashboard;