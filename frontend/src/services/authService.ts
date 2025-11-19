import { apiService } from './api';

export interface RegisterData {
  company_name: string;
  company_address: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    company_id: number;
    email: string;
    role: string;
  };
  company?: {
    id: number;
    company_name: string;
    company_address: string;
  };
  company_id?: number;
  user_id?: number;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data, false);
    
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user_id) {
        localStorage.setItem('userId', response.data.user_id.toString());
      }
      if (response.data.company_id) {
        localStorage.setItem('companyId', response.data.company_id.toString());
      }
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', 'admin');
    }
    
    return response.data!;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', data, false);
    
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('userId', response.data.user.id.toString());
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('companyId', response.data.user.company_id.toString());
      }
    }
    
    return response.data!;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('companyId');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  },

  getCompanyId(): number | null {
    const companyId = localStorage.getItem('companyId');
    return companyId ? parseInt(companyId, 10) : null;
  },
};

