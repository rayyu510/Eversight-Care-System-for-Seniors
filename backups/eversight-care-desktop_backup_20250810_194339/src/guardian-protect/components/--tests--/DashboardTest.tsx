/// <reference types="jest" />

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { getDashboardSummary } from '../../services/mockDataService';

// Simple test component
const TestDashboard: React.FC = () => {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getDashboardSummary()
            .then(summary => {
                setData(summary);
                setLoading(false);
            })
            .catch(error => {
                console.error('Dashboard error:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>No data</div>;

    return (
        <div data-testid="dashboard">
            <div data-testid="device-count">{data.devices.total}</div>
            <div data-testid="alert-count">{data.alerts.active}</div>
        </div>
    );
};

describe('Dashboard Component with Mock Service', () => {
    test('should render dashboard data from mock service', async () => {
        const { getByTestId } = render(<TestDashboard />);

        // Wait for data to load
        await waitFor(() => {
            const dashboardElement = getByTestId('dashboard');
            expect(dashboardElement).toBeDefined();
        });

        // Verify data is displayed
        const deviceCount = getByTestId('device-count');
        const alertCount = getByTestId('alert-count');

        expect(deviceCount.textContent).toMatch(/\d+/); // Should be a number
        expect(alertCount.textContent).toMatch(/\d+/);

        console.log('✅ Component integration test passed');
    });
});

export default TestDashboard;