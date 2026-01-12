import api from './api';
import { User } from '../types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  type: 'tenant' | 'landlord';
  phone?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    type: 'tenant' | 'landlord';
    phone?: string;
  };
  message: string;
}

export const authService = {
  // Login user
  login: async (data: LoginData): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const { token, user } = response.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', token);
    const mappedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      isVerified: true,
      phone: user.phone,
    };
    localStorage.setItem('user', JSON.stringify(mappedUser));
    
    return mappedUser;
  },

  // Register new user
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { token, user } = response.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', token);
    const mappedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      isVerified: true,
      phone: user.phone,
    };
    localStorage.setItem('user', JSON.stringify(mappedUser));
    
    return mappedUser;
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};