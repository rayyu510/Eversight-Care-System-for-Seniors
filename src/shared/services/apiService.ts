// Base API service with mock data simulation
class ApiService {
    private delay(ms: number = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async get<T>(endpoint: string, data?: T): Promise<T> {
        await this.delay();
        // Simulate API call - replace with real HTTP calls
        console.log(`API GET: ${endpoint}`, data);
        return data as T;
    }

    async post<T>(endpoint: string, data: T): Promise<T> {
        await this.delay();
        // Simulate API call - replace with real HTTP calls
        console.log(`API POST: ${endpoint}`, data);
        return data;
    }

    async put<T>(endpoint: string, data: T): Promise<T> {
        await this.delay();
        console.log(`API PUT: ${endpoint}`, data);
        return data;
    }

    async delete(endpoint: string): Promise<void> {
        await this.delay();
        console.log(`API DELETE: ${endpoint}`);
    }
}

export const apiService = new ApiService();