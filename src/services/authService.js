import api from './api';

export const authService = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/login/', data),
  logout: (refresh) => api.post('/logout/', { refresh }),
  getProfile: () => api.get('/profile/'),
  updateProfile: (data) => api.put('/profile/', data),
  changePassword: (data) => api.put('/change-password/', data),
  forgotPassword: (email) => api.post('/forgot-password/', { email }),
  resetPassword: (data) => api.post('/reset-password/', data),
};
