// src/operations-center/components/Controls/EmergencyControls.tsx
import React, { useState } from 'react';
import { AlertTriangle, Shield, Zap, Phone, Lock, Unlock } from 'lucide-react';

interface EmergencyControlsProps {
    onEmergencyAction: (action: string) => Promise<boolean>;
    loading?: boolean;
}

export const EmergencyControls: React.FC<EmergencyControlsProps> = ({
    onEmergencyAction,
    loading = false
}) => {
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<string | null>(null);

    const handleEmergencyAction = async (action: string) => {
        if (confirmAction !== action) {
            setConfirmAction(action);
            setTimeout(() => setConfirmAction(null), 5000); // Reset after 5 seconds
            return;
        }

        setActiveAction(action);
        try {
            await onEmergencyAction(action);
        } finally {
            setActiveAction(null);
            setConfirmAction(null);
        }
    };

    const emergencyActions = [
        {
            id: 'emergency_shutdown',
            title: 'Emergency Shutdown',
            description: 'Immediately shutdown all non-critical systems',
            icon: Zap,
            color: 'bg-red-600 hover:bg-red-700',
            confirmColor: 'bg-red-800',
            risk: 'critical'
        },
        {
            id: 'security_lockdown',
            title: 'Security Lockdown',
            description: 'Lock all access points and trigger security protocols',
            icon: Shield,
            color: 'bg-orange-600 hover:bg-orange-700',
            confirmColor: 'bg-orange-800',
            risk: 'high'
        },
        {
            id: 'emergency_contact',
            title: 'Emergency Services',
            description: 'Contact emergency services and authorities',
            icon: Phone,
            color: 'bg-purple-600 hover:bg-purple-700',
            confirmColor: 'bg-purple-800',
            risk: 'high'
        },
        {
            id: 'maintenance_mode',
            title: 'Maintenance Mode',
            description: 'Put all systems into safe maintenance mode',
            icon: Lock,
            color: 'bg-yellow-600 hover:bg-yellow-700',
            confirmColor: 'bg-yellow-800',
            risk: 'medium'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-medium text-gray-900">Emergency Controls</h3>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-red-900">Emergency Use Only</h4>
                        <p className="text-red-700 text-sm mt-1">
                            These controls should only be used in genuine emergency situations.
                            All actions are logged and require confirmation.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {emergencyActions.map(action => (
                    <div key={action.id} className="relative">
                        <button
                            onClick={() => handleEmergencyAction(action.id)}
                            disabled={loading || activeAction === action.id}
                            className={`w-full p-6 rounded-lg text-white transition-all duration-200 ${confirmAction === action.id
                                    ? action.confirmColor
                                    : action.color
                                } ${activeAction === action.id
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                }`}
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <action.icon className="h-8 w-8" />
                                <div className="text-center">
                                    <h4 className="font-medium">{action.title}</h4>
                                    <p className="text-sm opacity-90 mt-1">{action.description}</p>
                                </div>

                                {confirmAction === action.id && (
                                    <div className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                        Click again to confirm
                                    </div>
                                )}

                                {activeAction === action.id && (
                                    <div className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                        Executing...
                                    </div>
                                )}
                            </div>
                        </button>

                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${action.risk === 'critical' ? 'bg-red-100 text-red-800' :
                                action.risk === 'high' ? 'bg-orange-100 text-orange-800' :
                                    'bg-yellow-100 text-yellow-800'
                            }`}>
                            {action.risk}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Emergency Protocols</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• All emergency actions are immediately logged and reported</li>
                    <li>• Critical systems will remain operational during emergencies</li>
                    <li>• Emergency contacts will be notified automatically</li>
                    <li>• Recovery procedures will be initiated after emergency resolution</li>
                </ul>
            </div>
        </div>
    );
};