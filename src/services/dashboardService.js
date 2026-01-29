import api from '../services/api';

/**
 * Helper: remove unsupported filters safely
 */
const sanitizeFilters = (filters, blockedKeys = []) => {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([key, value]) =>
        !blockedKeys.includes(key) &&
        value !== null &&
        value !== undefined &&
        value !== ''
    )
  );
};

export const dashboardService = {

  getDistricts: async () => {
    try {
      const response = await api.get('/reports/districts');
      return response.data;
    } catch (error) {
      console.error("District Fetch Error:", error);
      throw error;
    }
  },

  getBlocksByDistrict: async (district_cd) => {
    if (!district_cd) return [];
    const res = await api.get('/reports/blocks', {
      params: { district_cd }
    });
    return res.data;
  },

  // Summary data (district_cd NOT allowed)
  getDashboardData: async (filters = {}) => {
    try {
      const cleanFilters = sanitizeFilters(filters, ['district_cd', 'block_cd']);

      const response = await api.get('/dashboard/summary', {
        params: cleanFilters
      });

      return response.data;
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      throw error;
    }
  },

  // Dashboard view data (district_cd NOT allowed)
  getDashboardViewData: async (filters = {}) => {
    try {
      const cleanFilters = sanitizeFilters(filters, ['district_cd', 'block_cd']);

      const response = await api.get('/dashboard/training-stats', {
        params: cleanFilters
      });

      return response.data;
    } catch (error) {
      console.error("Dashboard View Fetch Error:", error);
      throw error;
    }
  },

  // Map data (district_cd NOT allowed)
  getMapData: async (filters = {}) => {
    try {
      const cleanFilters = sanitizeFilters(filters, ['district_cd', 'block_cd']);

      const response = await api.get('/dashboard-view/map', {
        params: cleanFilters
      });

      return response.data;
    } catch (error) {
      console.error("Map Data Fetch Error:", error);
      throw error;
    }
  },

  // Location-wise statistics (same endpoint, same rule)
  getLocationStats: async (filters = {}) => {
    try {
      const cleanFilters = sanitizeFilters(filters, ['district_cd', 'block_cd']);

      const response = await api.get('/dashboard/training-stats', {
        params: cleanFilters
      });

      return response.data;
    } catch (error) {
      console.error("Location Stats Fetch Error:", error);
      throw error;
    }
  }
};
