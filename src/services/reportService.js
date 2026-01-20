// src/services/reportService.js

import api from './api';

/**
 * Fetches training reports with filters.
 */
export const fetchTrainingReport = async (filters = {}) => {
  const res = await api.get('/reports/training', { params: filters });
  return res.data;
};

/**
 * Fetches participant reports with filters.
 */
export const fetchParticipantReport = async (filters = {}) => {
  const res = await api.get('/reports/participant', { params: filters });
  return res.data;
};

/**
 * Fetches summary statistics.
 */
export const fetchSummaryReport = async (filters = {}) => {
  const res = await api.get('/reports/summary', { params: filters });
  return res.data;
};

/**
 * Fetches location data for map markers.
 */
export const fetchLocationReport = async (filters = {}) => {
  const res = await api.get('/reports/location', { params: filters });
  return res.data;
};