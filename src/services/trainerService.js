import api from './api';

export const trainerService = {
  //  Get All Trainers
  getAllTrainers: async (search = '') => {
    try {
      const response = await api.get('/trainers', {
        params: { search }
      });
      return response.data;
    } catch (error) {
      console.error("Get Trainers Error:", error);
      throw error;
    }
  },

  // Create Trainer
  createTrainer: async (data) => {
    try {
      const response = await api.post('/trainers', data);
      return response.data;
    } catch (error) {
      console.error("Create Trainer Error:", error);
      throw error;
    }
  },

  // Update Trainer
  updateTrainer: async (id, data) => {
    try {
      const response = await api.put(`/trainers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Update Trainer Error:", error);
      throw error;
    }
  },

  //  Delete Trainer
  deleteTrainer: async (id) => {
    try {
      await api.delete(`/trainers/${id}`);
      return true;
    } catch (error) {
      console.error("Delete Trainer Error:", error);
      throw error;
    }
  },

  // Upload Trainer Photo
  uploadTrainerPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post(`/trainers/${id}/upload-photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  },

  getTrainerById: async (id) => {
    const res = await api.get(`/trainers/${id}`);
    return res.data;
  },


};
