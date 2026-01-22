import api from './api';

export const locationService = {
getAll: async (filters = {}) => {
  try {
    const params = {
      page: 1,
      limit: 1000,   // 👈 avoid backend default pagination
      ...filters,    // village, block, district override allowed
    };

    const response = await api.get('/locations', { params });
    return response.data;
  } catch (error) {
    console.error('Get locations error:', error);
    throw error;
  }
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