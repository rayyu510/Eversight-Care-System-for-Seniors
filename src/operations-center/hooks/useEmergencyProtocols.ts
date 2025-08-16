// src/operations-center/hooks/useEmergencyProtocols.ts << 'EOF'
import { useState, useEffect } from 'react';
import { EmergencyProtocolService } from '../services/emergencyProtocolService';
import { EmergencyProtocol } from '../types/operationsTypes';

export const useEmergencyProtocols = () => {
    const [protocols, setProtocols] = useState<EmergencyProtocol[]>([]);
    const [activeProtocols, setActiveProtocols] = useState<EmergencyProtocol[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProtocols = async () => {
            try {
                setLoading(true);
                const service = EmergencyProtocolService.getInstance();
                const allProtocols = await service.getAllProtocols();
                const active = await service.getActiveProtocols();

                setProtocols(allProtocols);
                setActiveProtocols(active);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchProtocols();

        // Update every 5 seconds for active protocols
        const interval = setInterval(fetchProtocols, 5000);
        return () => clearInterval(interval);
    }, []);

    const activateProtocol = async (protocolId: string, activatedBy?: string) => {
        try {
            const service = EmergencyProtocolService.getInstance();
            const success = await service.activateProtocol(protocolId, activatedBy);

            if (success) {
                // Refresh protocols
                const allProtocols = await service.getAllProtocols();
                const active = await service.getActiveProtocols();
                setProtocols(allProtocols);
                setActiveProtocols(active);
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to activate protocol');
            return false;
        }
    };

    const deactivateProtocol = async (protocolId: string) => {
        try {
            const service = EmergencyProtocolService.getInstance();
            const success = await service.deactivateProtocol(protocolId);

            if (success) {
                // Refresh protocols
                const allProtocols = await service.getAllProtocols();
                const active = await service.getActiveProtocols();
                setProtocols(allProtocols);
                setActiveProtocols(active);
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to deactivate protocol');
            return false;
        }
    };

    const completeStep = async (protocolId: string, stepId: string, completedBy?: string) => {
        try {
            const service = EmergencyProtocolService.getInstance();
            const success = await service.completeStep(protocolId, stepId, completedBy);

            if (success) {
                // Refresh protocols
                const allProtocols = await service.getAllProtocols();
                setProtocols(allProtocols);
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to complete step');
            return false;
        }
    };

    return {
        protocols,
        activeProtocols,
        loading,
        error,
        activateProtocol,
        deactivateProtocol,
        completeStep
    };
};