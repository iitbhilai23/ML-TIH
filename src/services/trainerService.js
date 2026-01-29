import api from './api';

export const trainerService = {
  // Get All Trainers
  getAllTrainers: async (search = '') => {
    try {
      // const response = await api.get('/trainers', {
      const response = await api.get('/trainers?page=1&limit=1000', {
        params: { search }
      });
      //  console.log("ved response", response.data)
      return response.data;
    } catch (error) {
      console.error('Get Trainers Error:', error);
      throw error;
    }
  },

  // Create Trainer (JSON ONLY)
  createTrainer: async (data) => {
    try {
      const response = await api.post('/trainers', data);
      return response.data;
    } catch (error) {
      console.error("Create Trainer Error:", error);
      throw error;
    }
  },

  // Update Trainer (JSON ONLY)
  updateTrainer: async (id, data) => {
    try {
      const response = await api.put(`/trainers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Update Trainer Error:", error);
      throw error;
    }
  },

  // Delete Trainer
  deleteTrainer: async (id) => {
    try {
      await api.delete(`/trainers/${id}`);
      return true;
    } catch (error) {
      console.error("Delete Trainer Error:", error);
      throw error;
    }
  },

  // ✅ Upload Trainer Photo (FIXED)
  uploadTrainerPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('image', file); // 🔥 FIXED (must match backend)

    const res = await api.post(
      `/trainers/${id}/upload-photo`,
      formData
    ); // ❌ no headers

    return res.data;
  },

  // Get Trainer By ID
  getTrainerById: async (id) => {
    const res = await api.get(`/trainers/${id}`);
    return res.data;
  },
};
