
import api from '../services/api';

export const dashboardService = {

  // Existing: Summary data
  getDashboardData: async (filters = {}) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      );
      // const response = await api.get('/dashboard/complete', { params: cleanFilters });
      const response = await api.get('/dashboard/summary', { params: cleanFilters });
      return response.data;
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      throw error;
    }
  },

  //  Get dashboard view data (from your training_dashboard view)
  getDashboardViewData: async (filters = {}) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      );
      const response = await api.get('/dashboard/training-stats', { params: cleanFilters });
      return response.data;
    } catch (error) {
      console.error("Dashboard View Fetch Error:", error);
      throw error;
    }
  },

  //  Get map data
  getMapData: async (filters = {}) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      );
      const response = await api.get('/dashboard-view/map', { params: cleanFilters });
      return response.data;
    } catch (error) {
      console.error("Map Data Fetch Error:", error);
      throw error;
    }
  },

  //  Get location-wise statistics
  getLocationStats: async (filters = {}) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      );
      const response = await api.get('/dashboard/training-stats', { params: cleanFilters });
      return response.data;
    } catch (error) {
      console.error("Location Stats Fetch Error:", error);
      throw error;
    }
  }
};