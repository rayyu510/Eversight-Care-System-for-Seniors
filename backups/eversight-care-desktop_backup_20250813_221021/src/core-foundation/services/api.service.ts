import { APIResponse, APIMetadata } from '../types/api.types';
import { Logger } from '../utils/logger.utils';

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

export class APIService {
  private static instance: APIService;
  private baseURL: string = '';
  private defaultHeaders: Record<string, string> = {};
  private timeout: number = 10000;
  private logger = Logger.getInstance().createModuleLogger('APIService');

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  configure(config: {
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
  }): void {
    if (config.baseURL) this.baseURL = config.baseURL;
    if (config.defaultHeaders) this.defaultHeaders = { ...this.defaultHeaders, ...config.defaultHeaders };
    if (config.timeout) this.timeout = config.timeout;
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  async request<T = any>(config: RequestConfig): Promise<APIResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      this.logger.debug('API Request', {
        requestId,
        method: config.method,
        url: config.url,
        headers: this.sanitizeHeaders({ ...this.defaultHeaders, ...config.headers })
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.timeout);

      const response = await fetch(this.buildURL(config.url), {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...config.headers
        },
        body: config.data ? JSON.stringify(config.data) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const duration = Date.now() - startTime;
      const responseData = await response.json();

      const apiResponse: APIResponse<T> = {
        success: response.ok,
        data: response.ok ? responseData : undefined,
        error: response.ok ? undefined : (responseData?.message || `HTTP ${response.status}`),
        metadata: this.createMetadata(requestId, duration)
      };

      this.logger.info('API Response', {
        requestId,
        status: response.status,
        duration,
        success: response.ok
      });

      return apiResponse;
    } catch (error) {
      const duration = Date.now() - startTime;

      // FIX: Correct logger.error call
      this.logger.error('API Request Failed', {
        requestId,
        method: config.method,
        url: config.url,
        duration,
        error: error instanceof Error ? error.message : String(error)
      });

      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        metadata: this.createMetadata(requestId, duration)
      };
    }
  }

  async get<T = any>(url: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'GET', url, headers });
  }

  async post<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, headers });
  }

  async put<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, headers });
  }

  async delete<T = any>(url: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, headers });
  }

  async patch<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, headers });
  }

  private buildURL(path: string): string {
    if (path.startsWith('http')) return path;
    return `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createMetadata(requestId: string, duration: number): APIMetadata {
    return {
      timestamp: new Date(),
      version: '1.0.0',
      requestId: requestId,
      moduleSource: 'api-service'
    };
  }

  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized = { ...headers };
    if (sanitized.Authorization) {
      sanitized.Authorization = 'Bearer ***';
    }
    return sanitized;
  }
}