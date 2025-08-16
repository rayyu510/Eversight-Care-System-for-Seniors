import { useState, useEffect } from 'react';
import { ModuleIntegrationService } from '../services/moduleIntegrationService';
import { ModuleIntegrationStatus } from '../types/operationsTypes';

export const useModuleIntegration = () => {
    const [moduleStatuses, setModuleStatuses] = useState<ModuleIntegrationStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModuleStatuses = async () => {
            try {
                setLoading(true);
                const service = ModuleIntegrationService.getInstance();
                const statuses = await service.getAllModuleStatuses();
                setModuleStatuses(statuses);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchModuleStatuses();

        // Update every 15 seconds
        const interval = setInterval(fetchModuleStatuses, 15000);
        return () => clearInterval(interval);
    }, []);

    return { moduleStatuses, loading, error };
};