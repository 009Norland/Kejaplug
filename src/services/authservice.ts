import { User } from '../types';
import { authAPI } from './api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: 'tenant' | 'landlord';
  phone?: string;
}

// Authentication service using backend API
class AuthService {
  private currentUser: User | null = null;

  // Register a new user
  async register(data: RegisterData): Promise<User> {
    try {
      console.log('Registering user with data:', data);
      const response = await authAPI.register(data);
      console.log('Registration response:', response);
      
      // Convert backend user to frontend User type
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        type: response.user.type,
        phone: response.user.phone,
        createdAt: new Date().toISOString()
      };
      
      this.currentUser = user;
      return user;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  // Login user
  async login(data: LoginData): Promise<User> {
    const response = await authAPI.login(data);
    
    // Convert backend user to frontend User type
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      type: response.user.type,
      phone: response.user.phone,
      createdAt: new Date().toISOString()
    };
    
    this.currentUser = user;
    return user;
  }

  // Logout
  logout(): void {
    authAPI.logout();
    this.currentUser = null;
  }

  // Get current logged in user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();