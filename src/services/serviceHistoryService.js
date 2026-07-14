import api from './api';

export const serviceHistoryService = {
  getAll: (params = {}) => api.get('/services/', { params }),
  getById: (id) => api.get(`/services/${id}/`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/services/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/services/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/services/${id}/`),
  exportExcel: (params = {}) =>
    api.get('/services/export/', { params: { ...params, format: 'excel' }, responseType: 'blob' }),
};
