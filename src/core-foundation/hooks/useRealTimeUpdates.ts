// WebSocket integration
import { useState, useEffect } from 'react';
import { websocketService } from '../services/websocketService';

export const useRealTimeUpdates = (eventType: string) => {
    const [updates, setUpdates] = useState<any[]>([]);

    useEffect(() => {
        const handleUpdate = (data: any) => {
            setUpdates(prev => [...prev, data]);
        };

        websocketService.subscribe(eventType, handleUpdate);

        return () => {
            // Cleanup subscription
        };
    }, [eventType]);

    return updates;
};