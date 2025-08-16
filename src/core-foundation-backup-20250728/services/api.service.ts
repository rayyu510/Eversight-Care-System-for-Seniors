export class APIService {
  private static instance: APIService;
  private baseURL = 'http://localhost:3001';

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    return response.json();
  }
}

export const apiService = APIService.getInstance();
