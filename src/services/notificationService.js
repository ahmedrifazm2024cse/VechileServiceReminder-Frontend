import api from './api';

export const notificationService = {
  getAll: () => api.get('/notifications/'),
  markRead: (id) => api.patch(`/notifications/${id}/read/`),
  markAllRead: () => api.patch('/notifications/mark-read/'),
  getReminders: (vehicleId) => api.get('/reminders/', { params: { vehicle_id: vehicleId } }),
  updateReminder: (data) => api.put('/reminders/', data),
};
