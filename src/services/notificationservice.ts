import api from './api';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  clearNotifications: async () => {
    await api.delete('/notifications');
  },
  markAsRead: async (id: string) => {
    await api.patch(`/notifications/${id}`, { isRead: true });
  },
};