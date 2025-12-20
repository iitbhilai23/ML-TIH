import api from './api';

/**
 * Utility: remove empty / null filters
 */
const cleanFilters = (filters = {}) =>
  Object.fromEntries(
    Object.entries(filters).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  );

/**
 * ===============================
 * GENERIC REPORT (type based)
 * GET /api/reports/generate
 * ===============================
 */
export const generateReport = async (filters = {}) => {
  const params = cleanFilters(filters);
  const response = await api.get("/reports/generate", { params });
  return response.data;
};

/**
 * ===============================
 * TRAINING REPORT
 * GET /api/reports/training
 * ===============================
 */
export const getTrainingReport = async (filters = {}) => {
  const params = cleanFilters(filters);
  const response = await api.get("/reports/training", { params });
  return response.data;
};

/**
 * ===============================
 * PARTICIPANT REPORT
 * GET /api/reports/participant
 * ===============================
 */
export const getParticipantReport = async (filters = {}) => {
  const params = cleanFilters(filters);
  const response = await api.get("/reports/participant", { params });
  return response.data;
};

/**
 * ===============================
 * SUMMARY REPORT (KPI cards)
 * GET /api/reports/summary
 * ===============================
 */
export const getSummaryReport = async (filters = {}) => {
  const params = cleanFilters(filters);
  const response = await api.get("/reports/summary", { params });
  return response.data;
};

/**
 * ===============================
 * LOCATION REPORT (Map data)
 * GET /api/reports/location
 * ===============================
 */
export const getLocationReport = async (filters = {}) => {
  const params = cleanFilters(filters);
  const response = await api.get("/reports/location", { params });
  return response.data;
};