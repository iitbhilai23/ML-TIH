import api from './api';

export const locationService = {
  getAll: async (filters = {}) => {
    // Backend supports: village, block, district, limit, page
    const response = await api.get('/locations', { params: filters });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/locations', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/locations/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/locations/${id}`);
    return true;
  }
};