import api from './api';

export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  deposit: number;
  type: string;
  location: {
    city: string;
    estate: string;
    street: string;
    lat?: number;
    lng?: number;
  };
  amenities: string[];
  images: string[];
  status?: 'Available' | 'Rented' | 'Under Maintenance';
}

export const propertyService = {
  // Get all properties with optional filters
  getAllProperties: async (filters?: {
    city?: string;
    maxPrice?: number;
    type?: string;
    status?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.city && filters.city !== 'All') params.append('city', filters.city);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.type && filters.type !== 'All') params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property by ID
  getPropertyById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property (landlord only)
  createProperty: async (data: CreatePropertyData) => {
    const response = await api.post('/properties', data);
    return response.data;
  },

  // Update property
  updateProperty: async (id: string, data: Partial<CreatePropertyData>) => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};