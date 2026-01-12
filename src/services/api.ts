import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || (window as any).authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      (window as any).authToken = null;
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// Property API
export const propertyAPI = {
  // Get all properties
  getAll: async (filters?: { city?: string; maxPrice?: number; type?: string }) => {
    const params = new URLSearchParams();
    if (filters?.city && filters.city !== 'All') params.append('city', filters.city);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.type && filters.type !== 'All') params.append('type', filters.type);
    
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },
  
  // Get single property
  getById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },
  
  // Create new property (requires auth)
  create: async (propertyData: any) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },
  
  // Update property (requires auth)
  update: async (id: string, propertyData: any) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },
  
  // Delete property (requires auth)
  delete: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};

// Auth API
export const authAPI = {
  // Register new user
  register: async (userData: { name: string; email: string; password: string; type: string; phone?: string }) => {
    const response = await api.post('/auth/register', userData);
    
    // Store token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      (window as any).authToken = response.data.token;
    }
    
    return response.data;
  },
  
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    
    // Store token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      (window as any).authToken = response.data.token;
    }
    
    return response.data;
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    (window as any).authToken = null;
  },
};