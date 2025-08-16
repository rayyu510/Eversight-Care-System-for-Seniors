import React, { useState, useEffect } from 'react';
import { GuardianDatabaseBridge } from '../services/database-bridge';

const db = new GuardianDatabaseBridge();

export function AlertsList() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            const activeAlerts = await db.getActiveAlerts();
            setAlerts(activeAlerts);
        } catch (error) {
            console.error('Failed to load alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async (alertId: number) => {
        try {
            await db.acknowledgeAlert(alertId, 1); // Current user ID
            loadAlerts(); // Refresh list
        } catch (error) {
            console.error('Failed to acknowledge alert:', error);
        }
    };

    if (loading) return <div>Loading alerts...</div>;

    return (
        <div className="alerts-list">
            <h3>Active Alerts</h3>
            {alerts.map((alert: any) => (
                <div key={alert.id} className={`alert alert-${alert.severity}`}>
                    <h4>{alert.title}</h4>
                    <p>{alert.description}</p>
                    <button onClick={() => handleAcknowledge(alert.id)}>
                        Acknowledge
                    </button>
                </div>
            ))}
        </div>
    );
}
