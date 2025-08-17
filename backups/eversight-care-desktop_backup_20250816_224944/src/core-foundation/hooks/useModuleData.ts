// Module-specific data
import { useState, useEffect } from 'react';

export const useModuleData = (moduleName: string) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate module data fetching
        const timer = setTimeout(() => {
            setData({
                status: 'online',
                health: 97,
                lastUpdate: new Date()
            });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [moduleName]);

    return { data, loading };
};