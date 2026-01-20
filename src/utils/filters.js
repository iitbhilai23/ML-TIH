// src/utils/filters.js

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Format date for API (YYYY-MM-DD)
export const formatDateForAPI = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Get education stats from training data
export const getEducationStats = (trainingData) => {
  const stats = {
    '10th Pass': 0,
    '12th Pass': 0,
    'Graduate': 0,
    'Post Graduate': 0,
    'Other': 0
  };

  trainingData.forEach(training => {
    const educations = training.educations?.split(', ') || [];
    educations.forEach(edu => {
      if (stats.hasOwnProperty(edu)) {
        stats[edu] += 1;
      } else {
        stats['Other'] += 1;
      }
    });
  });

  return stats;
};

// Get district-wise stats
export const getDistrictStats = (trainingData) => {
  const stats = {};
  
  trainingData.forEach(training => {
    const district = training.location_details?.district || 'Unknown';
    stats[district] = (stats[district] || 0) + 1;
  });

  return stats;
};

// Filter data locally (if needed)
export const filterData = (data, filters) => {
  return data.filter(item => {
    // District filter
    if (filters.district && filters.district !== 'all') {
      if (item.location_details?.district !== filters.district) return false;
    }

    // Block filter
    if (filters.block && filters.block !== 'all') {
      if (item.location_details?.block !== filters.block) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (item.status !== filters.status) return false;
    }

    // Date range filter
    if (filters.start_date) {
      const itemDate = new Date(item.start_date);
      const startDate = new Date(filters.start_date);
      if (itemDate < startDate) return false;
    }

    if (filters.end_date) {
      const itemDate = new Date(item.start_date);
      const endDate = new Date(filters.end_date);
      if (itemDate > endDate) return false;
    }

    return true;
  });
};

// Prepare map locations
export const prepareMapLocations = (locationData) => {
  return locationData
    .filter(loc => loc.latitude && loc.longitude)
    .map(loc => ({
      id: loc.id,
      name: loc.village || loc.block,
      position: [loc.latitude, loc.longitude],
      details: {
        district: loc.district,
        block: loc.block,
        village: loc.village,
        total_trainings: loc.total_trainings,
        total_participants: loc.total_participants
      }
    }));
};