import { useState, useEffect } from 'react';
import {
    guardianProtectService,
    guardianInsightService,
    guardianCareProService,
    guardianCareTrackService
} from '../services/moduleServices';

// Generic hook for module data
export function useModuleData<T>(
    serviceMethod: () => Promise<T>,
    dependencies: any[] = []
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await serviceMethod();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, dependencies);

    return { data, loading, error, refetch: () => setLoading(true) };
}

// Specific hooks for each module
export function useGuardianProtectData() {
    const devices = useModuleData(() => guardianProtectService.getDevices());
    const alerts = useModuleData(() => guardianProtectService.getAlerts());

    return {
        devices: devices.data,
        alerts: alerts.data,
        loading: devices.loading || alerts.loading,
        error: devices.error || alerts.error
    };
}

export function useGuardianInsightData() {
    const insights = useModuleData(() => guardianInsightService.getAIInsights());
    const predictions = useModuleData(() => guardianInsightService.getPredictions());

    return {
        insights: insights.data,
        predictions: predictions.data,
        loading: insights.loading || predictions.loading,
        error: insights.error || predictions.error
    };
}

export function useGuardianCareProData() {
    const residents = useModuleData(() => guardianCareProService.getResidents());
    const staff = useModuleData(() => guardianCareProService.getStaff());

    return {
        residents: residents.data,
        staff: staff.data,
        loading: residents.loading || staff.loading,
        error: residents.error || staff.error
    };
}

export function useGuardianCareTrackData() {
    const medications = useModuleData(() => guardianCareTrackService.getMedications());
    const compliance = useModuleData(() => guardianCareTrackService.getCompliance());

    return {
        medications: medications.data,
        compliance: compliance.data,
        loading: medications.loading || compliance.loading,
        error: medications.error || compliance.error
    };
}