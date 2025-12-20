import api from './api';

export const fileUploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file); 

    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }
};