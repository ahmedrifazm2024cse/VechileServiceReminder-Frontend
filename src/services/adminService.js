import api from './api';

export const adminService = {
  // Users
  getUsers: (params = {}) => api.get('/admin/users/', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}/`),
  toggleUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/`, { is_active: isActive }),
  // Vehicles
  getVehicles: (params = {}) => api.get('/admin/vehicles/', { params }),
  deleteVehicle: (id) => api.delete(`/admin/vehicles/${id}/`),
  // Services
  getServices: () => api.get('/admin/services/'),
  // Reminder Logs
  getReminderLogs: (params = {}) => api.get('/admin/reminder-logs/', { params }),
  triggerReminders: () => api.post('/admin/trigger-reminders/'),
  // Contacts
  getContacts: (params = {}) => api.get('/admin/contact/', { params }),
  updateContactStatus: (id, status) => api.patch(`/admin/contact/${id}/`, { status }),
};
