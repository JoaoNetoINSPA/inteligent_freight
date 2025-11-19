import { apiService } from './api';

export interface User {
  id: number;
  company_id: number;
  email: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await apiService.get<User[]>('/users');
    return response.data || [];
  },

  async getById(id: number): Promise<User> {
    const response = await apiService.get<User>(`/users/${id}`);
    if (!response.data) {
      throw new Error('User not found');
    }
    return response.data;
  },

  async create(data: CreateUserData): Promise<number> {
    const response = await apiService.post<{ user_id: number }>(
      '/users',
      data
    );
    
    return response.data?.user_id || 0;
  },

  async delete(id: number): Promise<void> {
    await apiService.delete(`/users/${id}`);
  },
};

