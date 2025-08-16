// Base HTTP client
export class ApiService {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  async get(endpoint: string) {
    // Implementation for GET requests
    return fetch(`${this.baseURL}${endpoint}`);
  }

  async post(endpoint: string, data: any) {
    // Implementation for POST requests
    return fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}

export const apiService = new ApiService();