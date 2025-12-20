import api from './api';

export const participantService = {
  // Get participants (optionally filter by training_id)
  getAll: async (filters = {}) => {
    const response = await api.get('/participants', { params: filters });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/participants', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/participants/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/participants/${id}`);
    return true;
  }
};