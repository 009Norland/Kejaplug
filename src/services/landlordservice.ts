import api from './api';

export const landlordService = {
  // Get all properties for current landlord
  getMyProperties: async () => {
    const response = await api.get('/landlord/my-properties');
    return response.data;
  },

  updatePropertyStatus: async (propertyId: string, status: 'Available' | 'Rented' | 'Under Maintenance') => {
    const response = await api.patch(`/landlord/properties/${propertyId}/status`, { status });
    return response.data;
  },
};