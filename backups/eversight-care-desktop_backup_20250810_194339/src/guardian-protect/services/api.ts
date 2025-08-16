// API service for Guardian Protect
const API_BASE_URL = 'http://localhost:3002/api';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
}

// Generic API call function
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        console.log('🔍 apiCall called with endpoint:', endpoint);
        console.log('🔍 API_BASE_URL:', API_BASE_URL);

        const url = `${API_BASE_URL}${endpoint}`;
        console.log('🌐 Final URL being called:', url);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        console.log('📡 Response status:', response.status, response.statusText);
        console.log('📡 Response URL:', response.url);

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText} for URL: ${response.url}`);
        }

        const data = await response.json();
        console.log('📦 Response data:', data);
        return data;
    } catch (error) {
        console.error(`❌ API Error for endpoint "${endpoint}":`, error);
        throw error;
    }
}

// Alert API functions
export const alertsApi = {
    getAll: () => apiCall<any[]>('/alerts'),
    getActive: () => apiCall<any[]>('/alerts?status=active'),
    getById: (id: string) => apiCall<any>(`/alerts/${id}`),
};

// Residents API functions
export const residentsApi = {
    getAll: () => apiCall<any[]>('/residents'),
    getByFloor: (floor: number) => apiCall<any[]>(`/residents?floor=${floor}`),
    getById: (id: string) => apiCall<any>(`/residents/${id}`),
};

// Cameras API functions
export const camerasApi = {
    getAll: () => apiCall<any[]>('/cameras'),
    getByFloor: (floor: number) => apiCall<any[]>(`/cameras?floor=${floor}`),
    getById: (id: string) => apiCall<any>(`/cameras/${id}`),
};

// Health check
export const healthApi = {
    check: () => apiCall<any>('/health'),
};

export default {
    alerts: alertsApi,
    residents: residentsApi,
    cameras: camerasApi,
    health: healthApi,
};