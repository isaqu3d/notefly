const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.initToken();
  }

  private initToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
      if (this.token) {
        console.log('[API] Token loaded from localStorage');
      } else {
        console.warn('[API] No token found in localStorage');
      }
    }
  }

  refreshToken() {
    this.initToken();
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    } else {
      console.warn('[API] No token available for request:', endpoint);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    // If 401 and not a retry and not the refresh endpoint, try to refresh token
    if (response.status === 401 && !isRetry && !endpoint.includes('/auth/refresh')) {
      console.log('[API] Got 401, attempting to refresh token...');
      const refreshed = await this.tryRefreshToken();

      if (refreshed) {
        console.log('[API] Token refreshed, retrying request...');
        return this.request<T>(endpoint, options, true);
      }
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.warn('[API] No refresh token available');
        return false;
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.error('[API] Failed to refresh token');
        // Clear tokens and redirect to login
        this.setToken(null);
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return false;
      }

      const data = await response.json();
      this.setToken(data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      console.log('[API] Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('[API] Error refreshing token:', error);
      return false;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile<T>(endpoint: string, file: File, isRetry = false): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => null);

    // If 401 and not a retry, try to refresh token
    if (response.status === 401 && !isRetry) {
      const refreshed = await this.tryRefreshToken();
      if (refreshed) {
        return this.uploadFile<T>(endpoint, file, true);
      }
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  }
}

export const api = new ApiClient(API_URL);
