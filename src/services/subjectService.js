import api from './api';

export const subjectService = {
  getAll: async (search = '') => {
    const response = await api.get('/subjects', { params: { search } });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/subjects', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/subjects/${id}`);
    return true;
  }
};