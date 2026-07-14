import api from './api';

export const dashboardService = {
  getCustomerDashboard: () => api.get('/dashboard/'),
  getAdminDashboard: () => api.get('/admin/dashboard/'),
};
