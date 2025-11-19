const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'; 

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data;
    
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || 'An error occurred';
      const error = new Error(errorMessage);
      (error as any).errors = data.errors;
      (error as any).status = response.status;
      throw error;
    }

    return data;
  }

  async get<T>(endpoint: string, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(requireAuth),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: any, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(requireAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(requireAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(requireAuth),
    });

    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService();

