// Update your src/guardian-protect/components/Alerts/AlertCard.tsx to accept all props:

import React from 'react';

interface AlertCardProps {
    alert: any;
    onAcknowledge?: () => Promise<void>;
    onDismiss?: () => Promise<void>;
    showActions?: boolean;
}

const AlertCard = ({ alert, onAcknowledge, onDismiss, showActions = false }: AlertCardProps) => {
    // Safety first - handle undefined/null alert
    if (!alert) {
        return (
            <div className="p-4 border rounded-lg bg-gray-50">
                <p>No alert data</p>
            </div>
        );
    }

    // Safe property access with fallbacks
    const title = alert?.title || 'Unknown Alert';
    const description = alert?.description || 'No description available';
    const severity = alert?.severity || 'medium';
    const status = alert?.status || 'active';

    // Safe severity color
    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'critical': return 'bg-red-200 text-red-900 border-red-300';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <div className={`p-4 border rounded-lg ${getSeverityColor(severity)}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm">{title}</h3>
                <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-70">
                    {severity}
                </span>
            </div>
            <p className="text-sm mb-2">{description}</p>
            <div className="flex justify-between items-center text-xs">
                <span>Status: {status}</span>
                <span>Just now</span>
            </div>

            {/* Add action buttons if showActions is true */}
            {showActions && (onAcknowledge || onDismiss) && (
                <div className="flex gap-2 mt-3">
                    {onAcknowledge && (
                        <button
                            onClick={() => onAcknowledge()}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Acknowledge
                        </button>
                    )}
                    {onDismiss && (
                        <button
                            onClick={() => onDismiss()}
                            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Dismiss
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// Add BOTH exports to fix the import issue:
export default AlertCard;
export { AlertCard };