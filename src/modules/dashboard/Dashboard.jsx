import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { dashboardService } from '../../services/dashboardService';
import { locationService } from '../../services/locationService';
import { trainingService } from '../../services/trainingService';
import { Users, BookOpen, MapPin, Table, User, House, Maximize, Minimize, X, SlidersHorizontal, } from 'lucide-react';
import cgGeoJson from '../../assets/cg.json';


// --- THEME CONFIGURATION ---
const THEME = {
  gap: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px' },
  pad: { s: '2', sm: '12px', md: '16px', lg: '20px', xl: '28px' },
  bgGradient: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
  glass: {
    background: 'rgba(255, 255, 255, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'all 0.3s ease'
  },
  primary: '#4f46e5',
  secondary: '#db2777',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  gradients: {
    primary: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    success: 'linear-gradient(135deg, #0f766e 0%, #0f172a 120%)',
    warning: 'linear-gradient(135deg, #b45309 0%, #1f2937 120%)',
    secondary: 'linear-gradient(135deg, #334155 0%, #111827 100%)',
    cyan: 'linear-gradient(135deg, #0e7490 0%, #0f172a 120%)',
    kpiA: 'linear-gradient(135deg, #7b3f99 0%, #5a2b7a 100%)',
    kpiB: 'linear-gradient(135deg, #9b59b6 0%, #7b3f99 100%)',
    kpiC: 'linear-gradient(135deg, #6a0dad 0%, #4c1d95 100%)',
    kpiD: 'linear-gradient(135deg, #b06ad9 0%, #7b3f99 100%)'
  },
  input: {
    padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem',
    fontWeight: '500', color: '#1e293b', background: '#ffffff', outline: 'none', cursor: 'pointer',
    transition: 'all 0.2s ease', height: '42px', display: 'flex', alignItems: 'center'
  }
};

// --- TRAINING PHASE COLOR PALETTE ---

const TRAINING_TYPE_COLORS = {
  '': '#16a34a',                   // Default (All Training Types) — green

  'Pilot Phase': '#0ea5e9',        // Group-level — sky blue
  'Pilot Phase I': '#2563eb',      // Blue
  'Pilot Phase II': '#16a34a',     // Green
  'Pilot Phase III': '#f59e0b',    // Amber

  'Educator Phase': '#8b5cf6',     // Group-level — violet
  'Educator Phase I': '#7c3aed',   // Purple
  'Educator Phase II': '#db2777',  // Pink / Magenta
  'Educator Phase III': '#0d9488', // Teal
  'Educator Phase IV': '#dc2626',  // Red
};

const getTrainingTypeColor = (trainingType) =>
  TRAINING_TYPE_COLORS[trainingType] || TRAINING_TYPE_COLORS[''];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [locationsData, setLocationsData] = useState([]);
  const [trainingLocations, setTrainingLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [filters, setFilters] = useState({
    district_cd: '', block_cd: '', village: '', start_date: '', end_date: '', subject: '', status: '', training_type: ''
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [expandedTrainingType, setExpandedTrainingType] = useState('');
  const [isTrainingTypeMenuOpen, setIsTrainingTypeMenuOpen] = useState(false);
  const keepTrainingTypeMenuOpen = useRef(false);


  const mapFocusPoint = useMemo(() => {
    if (!selectedState) return null;

    const targetLocation = locationsData.find(
      loc => String(loc.state_code) === String(selectedState)
    );

    if (targetLocation?.latitude && targetLocation?.longitude) {
      console.log("🌍 Country:", targetLocation.country_name);
      console.log("🏙 State:", targetLocation.state_name);
      console.log("📍 Latitude:", targetLocation.latitude);
      console.log("📍 Longitude:", targetLocation.longitude);

      return [
        Number(targetLocation.latitude),
        Number(targetLocation.longitude)
      ];
    }

    return null;
  }, [selectedState, locationsData]);



  const filteredLocationsForMap = useMemo(() => {
    return locationsData.filter(loc => {
      const matchCountry =
        !selectedCountry ||
        String(loc.country_code) === String(selectedCountry);

      const matchState =
        !selectedState ||
        String(loc.state_code) === String(selectedState);

      return matchCountry && matchState;
    });
  }, [locationsData, selectedCountry, selectedState]);

  const countriesFromAPI = useMemo(() => {
    const map = new Map();
    locationsData.forEach(loc => {
      if (loc.country_code && loc.country_name) {
        map.set(loc.country_code, { code: loc.country_code, name: loc.country_name });
      }
    });
    return Array.from(map.values());
  }, [locationsData]);

  const statesFromAPI = useMemo(() => {
    if (!selectedCountry) return [];
    const map = new Map();
    locationsData.forEach(loc => {
      if (loc.country_code === selectedCountry && loc.state_code && loc.state_name) {
        map.set(loc.state_code, { code: loc.state_code, name: loc.state_name });
      }
    });
    return Array.from(map.values());
  }, [selectedCountry, locationsData]);

  //dashboard data fetch on filter change

  const activeFilters = JSON.stringify({
    district_cd: filters.district_cd, block_cd: filters.block_cd,
    subject: filters.subject, start_date: filters.start_date, end_date: filters.end_date, status: filters.status
  });

  useEffect(() => { fetchData(); }, [activeFilters]);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const [summaryData, viewDataResult] = await Promise.all([
        dashboardService.getDashboardData({ ...filters, training_type: undefined }),
        dashboardService.getDashboardViewData({ ...filters, training_type: undefined })
      ]);
      setData(summaryData); setViewData(viewDataResult);
    } catch (error) { console.error("Dashboard Fetch Error:", error); setError(error.message || "Failed to load dashboard data"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchDistricts = async () => { try { const data = await dashboardService.getDistricts(); setDistricts(Array.isArray(data) ? data : []); } catch (error) { console.error('Error loading districts', error); } };
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (!filters.district_cd) { setBlocks([]); return; }
    const fetchBlocks = async () => {
      try {
        if (!filters.district_cd) { setBlocks([]); setFilters((prev) => ({ ...prev, block_cd: '' })); return; }
        const data = await dashboardService.getBlocksByDistrict(filters.district_cd);
        setBlocks(Array.isArray(data) ? data : []);
        setFilters((prev) => ({ ...prev, block_cd: '' }));
      } catch (error) { console.error('Error loading blocks', error); }
    };
    fetchBlocks();
  }, [filters.district_cd]);

  useEffect(() => {
    const fetchMapLocation = async () => {
      try {
        const data = await locationService.getAll();
        setLocationsData(Array.isArray(data) ? data : []);
      } catch (error) { console.error("Error fetching locations for map:", error); }
    };
    fetchMapLocation();
  }, []);

  useEffect(() => {
    const fetchTrainingsForMap = async () => {
      try {
        const trainings = await trainingService.getAll({ limit: 1000 });
        const trainingData = Array.isArray(trainings) ? trainings : trainings?.data || [];
        setTrainingLocations(trainingData);
      } catch (error) { console.error("Error fetching trainings for map:", error); }
    };
    fetchTrainingsForMap();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, ...(name === 'district_cd' ? { block_cd: '' } : {}) }));
  };

  const handleTrainingTypeGroupClick = (trainingType) => {
    keepTrainingTypeMenuOpen.current = true;
    setFilters(prev => ({ ...prev, training_type: trainingType }));
    setExpandedTrainingType(prev => prev === trainingType ? '' : trainingType);
    setIsTrainingTypeMenuOpen(true);
  };

  const handleTrainingTypeMenuClose = () => {
    if (keepTrainingTypeMenuOpen.current) {
      keepTrainingTypeMenuOpen.current = false;
      return;
    }
    setIsTrainingTypeMenuOpen(false);
  };

  const filteredTrainingLocations = useMemo(() => {
    if (!trainingLocations.length) return [];
    const selectedDistrictObj = districts.find(d => String(d.district_cd) === String(filters.district_cd));
    const selectedDistrictName = selectedDistrictObj?.district_name?.toLowerCase();
    const selectedBlockObj = blocks.find(b => String(b.block_cd) === String(filters.block_cd));
    const selectedBlockName = selectedBlockObj?.block_name?.toLowerCase();

    return trainingLocations.filter(training => {
      const loc = training.location_details || {};
      const matchDistrict = !filters.district_cd || (
        loc.district_cd != null
          ? String(loc.district_cd) === String(filters.district_cd)
          : loc.district?.toLowerCase() === selectedDistrictName
      );
      const matchBlock = !filters.block_cd || (
        loc.block_cd != null
          ? String(loc.block_cd) === String(filters.block_cd)
          : loc.block?.toLowerCase() === selectedBlockName
      );
      const matchStatus = !filters.status || training.status?.toLowerCase() === filters.status.toLowerCase();
      const matchSubject = !filters.subject || (training.subject_name?.toLowerCase() === filters.subject.toLowerCase() || training.subject?.toLowerCase() === filters.subject.toLowerCase());
      const trainingType = training.training_type?.toLowerCase() || '';
      const matchTrainingType = !filters.training_type || trainingType.startsWith(filters.training_type.toLowerCase());
      let matchDate = true;
      const trainingDate = new Date(training.start_date);
      if (filters.start_date && training.start_date) { if (trainingDate < new Date(filters.start_date)) matchDate = false; }
      if (filters.end_date && training.start_date) { if (trainingDate > new Date(filters.end_date)) matchDate = false; }
      return matchDistrict && matchBlock && matchStatus && matchTrainingType && matchDate && matchSubject;
    });
  }, [trainingLocations, filters, districts, blocks]);

  // NEW: resolve the active marker color from the currently selected training type
  const activeMarkerColor = useMemo(
    () => getTrainingTypeColor(filters.training_type),
    [filters.training_type]
  );

  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: THEME.bgGradient, color: THEME.primary, fontSize: '1rem', fontWeight: '600' }}>Loading Dashboard Data...</div>;
  if (error) return <div style={{ padding: THEME.pad.xl, color: THEME.danger, textAlign: 'center' }}>Error: {error}</div>;
  if (!data) return <div style={{ padding: THEME.pad.xl, color: '#64748b', textAlign: 'center' }}>No Data Available</div>;

  const { summary } = data;

  const isFiltered = Boolean(filters.district_cd || filters.subject || filters.training_type);

  const selectSx = {
    minWidth: 210,
    height: '42px',
    background: '#ffffff',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#1e293b',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    '& .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      transition: 'all 0.2s ease-in-out'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6366f1 !important',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4f46e5 !important',
      borderWidth: '1.5px',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12) !important'
    },
    '& .MuiSelect-select': {
      padding: '9px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#0f172a'
    }
  };

  return (
    <div style={{ padding: '10px 15px 15px 15px', display: 'flex', flexDirection: 'column', gap: THEME.gap.xs, minHeight: '100vh', background: THEME.bgGradient, overflowX: "hidden" }}>
      <Box sx={{ textAlign: 'center', mb: 0.5, opacity: 0, animation: 'fadeIn 0.8s ease-out forwards' }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', px: 1, mb: 1 }}>
        <div
          style={{
            ...THEME.glass,
            width: '100%',
            maxWidth: '1500px',
            padding: '12px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: THEME.gap.sm,
            margin: '0 auto',
            borderRadius: '18px',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(226, 232, 240, 0.9)'
          }}
        >
          {/* Left Title & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
              }}
            >
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Dashboard Controls
                {isFiltered && (
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', background: '#e0e7ff', color: '#4338ca', padding: '2px 9px', borderRadius: '20px', letterSpacing: '0.02em' }}>
                    Active Filters
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                Filter trainings & map view by district or type
              </div>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* District Filter */}
            <Select
              name="district_cd"
              value={filters.district_cd}
              onChange={handleFilterChange}
              displayEmpty
              size="small"
              sx={selectSx}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                      <MapPin size={16} color="#6366f1" />
                      <span>All Districts</span>
                    </span>
                  );
                }
                const dist = districts.find(d => String(d.district_cd) === String(selected));
                return (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 600 }}>
                    <MapPin size={16} color="#4f46e5" />
                    <span>{dist?.district_name || 'District'}</span>
                  </span>
                );
              }}
            >
              <MenuItem value="">
                <span style={{ fontWeight: 500, color: '#64748b' }}>All Districts</span>
              </MenuItem>
              {districts.map((d) => (
                <MenuItem key={d.district_cd} value={d.district_cd} sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {d.district_name}
                </MenuItem>
              ))}
            </Select>

            {/* Training Type Filter */}
            <Select
              name="training_type"
              value={filters.training_type}
              onChange={handleFilterChange}
              open={isTrainingTypeMenuOpen}
              onOpen={() => setIsTrainingTypeMenuOpen(true)}
              onClose={handleTrainingTypeMenuClose}
              displayEmpty
              size="small"
              sx={selectSx}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                      <BookOpen size={16} color="#7c3aed" />
                      <span>All Training Types</span>
                    </span>
                  );
                }
                return (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 600 }}>
                    {/* NEW: small color swatch showing the active phase color */}
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: getTrainingTypeColor(selected),
                        flexShrink: 0
                      }}
                    />
                    <BookOpen size={16} color="#7c3aed" />
                    <span>{selected}</span>
                  </span>
                );
              }}
            >
              <MenuItem value="">
                <span style={{ fontWeight: 500, color: '#64748b' }}>All Training Types</span>
              </MenuItem>
              <MenuItem
                value="Pilot Phase"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleTrainingTypeGroupClick('Pilot Phase');
                }}
                sx={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Pilot Phase {expandedTrainingType === 'Pilot Phase' ? '▾' : '▸'}
              </MenuItem>
              {expandedTrainingType === 'Pilot Phase' && ['I', 'II', 'III'].map((phase) => (
                <MenuItem key={phase} value={`Pilot Phase ${phase}`} sx={{ pl: 4, fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* NEW: color swatch per phase option */}
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: getTrainingTypeColor(`Pilot Phase ${phase}`),
                      flexShrink: 0
                    }}
                  />
                  Pilot Phase {phase}
                </MenuItem>
              ))}
              <MenuItem
                value="Educator Phase"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleTrainingTypeGroupClick('Educator Phase');
                }}
                sx={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Educator Phase {expandedTrainingType === 'Educator Phase' ? '▾' : '▸'}
              </MenuItem>
              {expandedTrainingType === 'Educator Phase' && ['I', 'II', 'III', 'IV'].map((phase) => (
                <MenuItem key={phase} value={`Educator Phase ${phase}`} sx={{ pl: 4, fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* NEW: color swatch per phase option */}
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: getTrainingTypeColor(`Educator Phase ${phase}`),
                      flexShrink: 0
                    }}
                  />
                  Educator Phase {phase}
                </MenuItem>
              ))}
            </Select>

          </div>
        </div>
      </Box>
      {activeTab === 'summary' && (
        <SummaryTab
          summary={data}
          viewData={viewData}
          locationsData={locationsData}
          trainingLocations={filteredTrainingLocations}
          focusTarget={mapFocusPoint}
          markerColor={activeMarkerColor}
          activeTrainingType={filters.training_type}
        />
      )}
      {activeTab === 'detailed' && <DetailedTab viewData={viewData} />}
    </div >
  );
};

const MapResizer = ({ trigger }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timeout = setTimeout(() => { if (map._container) map.invalidateSize(); }, 400);
    return () => clearTimeout(timeout);
  }, [trigger, map]);
  return null;
};

const MapLocationController = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target && target.length === 2) {
      map.flyTo(target, 10, { animate: true, duration: 1.5 });
    }
  }, [target, map]);
  return null;
};

// --- SMART MAP COMPONENT (UPDATED WITH MARKER) ---
const TraineeLocationMap = ({ trainingLocations, focusTarget, markerColor, activeTrainingType }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);

  useEffect(() => {
    if (selectedTraining) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedTraining]);

  const MIN_LAT = 17.5; const MAX_LAT = 24.0; const MIN_LNG = 79.5; const MAX_LNG = 85.0;
  const isWithinCG = (lat, lng) => lat >= MIN_LAT && lat <= MAX_LAT && lng >= MIN_LNG && lng <= MAX_LNG;

  const validTrainingLocations = (trainingLocations || []).filter(training => {
    const lat = Number(training?.location_details?.latitude);
    const lng = Number(training?.location_details?.longitude);
    return !isNaN(lat) && !isNaN(lng) && isWithinCG(lat, lng);
  });

  const totalTrainings = validTrainingLocations.length;
  useEffect(() => { setGeoJsonData(cgGeoJson); }, []);

  // Group by coordinate key for same-spot stacking, keeping district info
  const groupedLocations = useMemo(() => {
    return validTrainingLocations.reduce((acc, training) => {
      const lat = Number(training.location_details?.latitude);
      const lng = Number(training.location_details?.longitude);
      const key = `${lat.toFixed(4)}-${lng.toFixed(4)}`;
      if (!acc[key]) acc[key] = { lat, lng, trainings: [], district: training.location_details?.district || 'Unknown' };
      acc[key].trainings.push(training);
      return acc;
    }, {});
  }, [validTrainingLocations]);

  // Group location-spots by district for district-wise clustering
  const districtGrouped = useMemo(() => {
    const byDistrict = {};
    Object.values(groupedLocations).forEach((loc) => {
      const district = loc.district || 'Unknown';
      if (!byDistrict[district]) byDistrict[district] = [];
      byDistrict[district].push(loc);
    });
    return byDistrict;
  }, [groupedLocations]);

  // NOTE: District-based palette kept for reference/fallback use elsewhere,
  // but marker/cluster color is now driven by the selected training phase (MARKER_COLOR below).
  const DISTRICT_PALETTE = [
    '#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626',
    '#7c3aed', '#db2777', '#0f766e', '#ca8a04', '#b45309',
    '#1d4ed8', '#15803d', '#b91c1c', '#6d28d9', '#0369a1',
  ];
  const districtColorMap = useMemo(() => {
    const map = {};
    Object.keys(districtGrouped).forEach((district, idx) => {
      map[district] = DISTRICT_PALETTE[idx % DISTRICT_PALETTE.length];
    });
    return map;
  }, [districtGrouped]);

  // --- Training Markers Icon ---
  // CHANGED: color now comes from the selected training-type phase (passed as `markerColor` prop),
  // falling back to the original green when no phase filter is active.
  const MARKER_COLOR = markerColor || '#16a34a';

  const createCustomIcon = (count, color = MARKER_COLOR) => {
    const stackShadow = count > 1
      ? `2px -2px 0 rgba(255,255,255,0.9), 3px -3px 0 ${color}, 4px -4px 0 rgba(255,255,255,0.9), 5px -5px 0 ${color}`
      : '0 4px 14px rgba(0,0,0,0.15)';

    return L.divIcon({
      className: 'smart-marker-container',
      html: `
        <div class="smart-marker-body" style="
            width: 40px; height: 40px; 
            display: flex; align-items: center; justify-content: center;
            background: ${color}; 
            border-radius: 50%; 
            color: white; 
            font-weight: 800; 
            font-size: 14px; 
            font-family: 'Inter', sans-serif;
            border: 2.5px solid #ffffff;
            box-shadow: ${stackShadow};
            cursor: pointer;
            transition: transform 0.2s ease;
            position: relative;
            z-index: 10;
        ">
            ${count}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      interactive: true
    });
  };

  // --- NEW: Focus/Center Marker Icon ---
  const createFocusIcon = () => {
    return L.divIcon({
      className: 'focus-marker-container',
      html: `
        <style>
          @keyframes pulse-ring {
            0% { transform: scale(0.33); opacity: 1; }
            80%, 100% { opacity: 0; transform: scale(2.5); }
          }
          .pulse-circle {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 100%; height: 100%;
            background: rgba(220, 38, 38, 0.4);
            border-radius: 50%;
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
        </style>
        <div style="
            width: 30px; height: 30px; 
            position: relative;
            display: flex; align-items: center; justify-content: center;
            color: #ffffff;
        ">
          <div class="pulse-circle"></div>
          <div style="
            width: 20px; height: 20px;
            background: #dc2626; /* Red color for focus */
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
            z-index: 10;
          "></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      interactive: false // No need to click this center marker
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#059669'; case 'ongoing': return '#d97706'; case 'scheduled': return '#4f46e5'; default: return '#9647bb';
    }
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'completed': return { background: '#d1fae5', color: '#065f46' };
      case 'ongoing': return { background: '#fef3c7', color: '#92400e' };
      case 'scheduled': return { background: '#e0e7ff', color: '#3730a3' };
      default: return { background: '#f1f5f9', color: '#475569' };
    }
  };

  const containerStyle = {
    height: '100%', display: 'flex', flexDirection: 'column', position: 'relative',
    background: '#ffffff', borderRadius: isFullScreen ? '0' : '20px',
    border: isFullScreen ? 'none' : '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: isFullScreen ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    ...(isFullScreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 } : {})
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .smart-marker-container:hover .smart-marker-body { transform: scale(1.1) translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.25) !important; }
      `}</style>

      {/* Map Control: Info Badge */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', padding: '9px 14px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e2e8f0' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: MARKER_COLOR, boxShadow: `0 0 0 4px ${MARKER_COLOR}1f` }}></div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Chhattisgarh</div>
          <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b', marginTop: '1px' }}>{totalTrainings} training locations</div>
        </div>
      </div>

      {/* NEW: Active phase legend — shows only when a training type filter is applied */}
      {activeTrainingType && (
        <div style={{
          position: 'absolute', top: '68px', left: '15px', zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)', padding: '7px 14px', borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: MARKER_COLOR, flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#334155' }}>{activeTrainingType}</span>
        </div>
      )}

      {/* Map Control: Fullscreen */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 1000 }}>
        <button onClick={() => setIsFullScreen(!isFullScreen)} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '8px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          {isFullScreen ? <Minimize size={18} color="#64748b" /> : <Maximize size={18} color="#64748b" />}
        </button>
      </div>

      <MapContainer style={{ width: '100%', height: '100%' }} zoomControl={false} minZoom={5}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* Controller to handle map movement based on selection */}
        <MapLocationController target={focusTarget} />

        {/* Adjusts bounds if no specific target is selected */}
        <MapBoundsAdjuster geoJsonData={geoJsonData} trigger={isFullScreen} focusTarget={focusTarget} />

        <MapResizer trigger={isFullScreen} />

        {geoJsonData && <GeoJSON data={geoJsonData} style={{ color: '#4f46e5', weight: 2, fillColor: '#818cf8', fillOpacity: 0.08, dashArray: '3 4' }} />}

        {/* NEW: Render Focus Marker if a target is selected */}
        {focusTarget && (
          <Marker position={focusTarget} icon={createFocusIcon()} />
        )}

        {/* Render Training Markers with Marker Clustering */}
        {/* District-wise Marker Clustering — one MCG per district */}
        {Object.entries(districtGrouped).map(([district, locations]) => {
          return (
            <MarkerClusterGroup
              key={`cluster-${district}`}
              chunkedLoading
              maxClusterRadius={80}
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={false}
              iconCreateFunction={(cluster) => {
                const childMarkers = cluster.getAllChildMarkers();
                let total = 0;
                childMarkers.forEach((m) => { total += (m.options?.trainingCount || 1); });
                const size = total > 50 ? 56 : total > 20 ? 50 : 44;
                const fontSize = total > 99 ? '12px' : '14px';
                return L.divIcon({
                  html: `
                    <div style="
                      width: ${size}px;
                      height: ${size}px;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      background: ${MARKER_COLOR};
                      border-radius: 50%;
                      color: white;
                      font-weight: 800;
                      font-size: ${fontSize};
                      font-family: 'Inter', sans-serif;
                      border: 3px solid #ffffff;
                      box-shadow: 0 4px 16px ${MARKER_COLOR}59;
                      cursor: pointer;
                      line-height: 1.1;
                    ">
                      <span>${total}</span>
                    </div>
                  `,
                  className: 'custom-district-cluster-icon',
                  iconSize: [size, size],
                  iconAnchor: [size / 2, size / 2],
                });
              }}
            >
              {locations.map((location, i) => {
                const trainings = location.trainings;
                const count = trainings.length;
                return (
                  <Marker
                    key={`${district}-marker-${i}`}
                    position={[location.lat, location.lng]}
                    icon={createCustomIcon(count, MARKER_COLOR)}
                    trainingCount={count}
                    eventHandlers={{
                      click: () => { setSelectedTraining([...trainings]); },
                    }}
                  />
                );
              })}
            </MarkerClusterGroup>
          );
        })}
      </MapContainer>

      {/* MODAL */}
      ```jsx
      {Array.isArray(selectedTraining) && selectedTraining.length > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 10000,
            animation: "fadeIn 0.25s ease-out"
          }}
          onClick={() => setSelectedTraining(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "880px",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 25px 60px -15px rgba(88, 28, 135, 0.3)",
              position: "relative",
              border: "1px solid rgba(192, 132, 252, 0.3)"
            }}
          >
            {/* Header Banner */}
            <div
              style={{
                padding: "24px 30px",
                background:
                  "linear-gradient(135deg, #581c87 0%, #6b21a8 50%, #7e22ce 100%)",
                borderRadius: "24px 24px 0 0",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div
                  style={{
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <BookOpen size={14} color="#e9d5ff" />
                    Subject
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#ffffff",
                      fontSize: "20px",
                      fontWeight: "800",
                      letterSpacing: "-0.02em"
                    }}
                  >
                    Marketplace Literacy
                  </h2>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                {/* Session Count */}
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    padding: "5px 14px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "700"
                  }}
                >
                  {selectedTraining.length} Session
                  {selectedTraining.length > 1 ? "s" : ""}
                </span>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedTraining(null)}
                  style={{
                    width: 36,
                    height: 36,
                    border: "none",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.25)",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.25)";
                  }}
                >
                  <X size={18} color="#ffffff" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: "24px"
              }}
            >
              {selectedTraining.map((training, index) => {
                const rawSubject = training.subject || training.subject_name;

                const subject =
                  rawSubject &&
                    !/advanced/i.test(rawSubject) &&
                    !/digital/i.test(rawSubject)
                    ? rawSubject
                    : "Marketplace Literacy";

                return (
                  <div
                    key={training.id || index}
                    style={{
                      border: "1px solid #ede9fe",
                      borderRadius: "20px",
                      overflow: "hidden",
                      background: "#ffffff",
                      boxShadow: "0 8px 24px rgba(124, 58, 237, 0.06)"
                    }}
                  >
                    {/* Training Hero Image */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        overflow: "hidden"
                      }}
                    >
                      <img
                        src={
                          training.training_image ||
                          "https://placehold.co/1200x250/ede9fe/6b21a8?text=Marketplace+Literacy+Training"
                        }
                        alt="Training Session"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(30, 27, 75, 0.75) 0%, transparent 60%)"
                        }}
                      />
                    </div>

                    {/* Content Section */}
                    <div
                      style={{
                        padding: "24px",
                        display: "grid",
                        gridTemplateColumns: "200px 1fr",
                        gap: "24px",
                        alignItems: "center"
                      }}
                    >
                      {/* Trainer Profile */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          padding: "16px",
                          background: "#faf5ff",
                          borderRadius: "16px",
                          border: "1px solid #f3e8ff"
                        }}
                      >
                        <div
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: "50%",
                            padding: "3px",
                            background:
                              "linear-gradient(135deg, #7c3aed, #c084fc)",
                            marginBottom: 10
                          }}
                        >
                          <img
                            src={
                              training.trainer_profile_image ||
                              training.trainer_image ||
                              "https://placehold.co/110x110/f3e8ff/6b21a8?text=👤"
                            }
                            alt="Master Trainer"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "https://placehold.co/110x110/f3e8ff/6b21a8?text=👤";
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              objectFit: "cover",
                              background: "#ffffff"
                            }}
                          />
                        </div>

                        <h3
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: "800",
                            color: "#3b0764"
                          }}
                        >
                          {training.trainer_name || "Trainer Name"}
                        </h3>

                        <span
                          style={{
                            fontSize: "12px",
                            color: "#7c3aed",
                            fontWeight: "600",
                            marginTop: "2px"
                          }}
                        >
                          Master Trainer
                        </span>
                      </div>

                      {/* Metadata */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px"
                        }}
                      >
                        {/* Participants */}
                        <div
                          style={{
                            padding: "10px 14px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #f1f5f9"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              marginBottom: "3px"
                            }}
                          >
                            Participants
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "800",
                              color: "#0f172a",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <Users size={15} color="#7c3aed" />
                            {training.total_participants ||
                              training.actual_participants ||
                              0}{" "}
                            Trainees
                          </div>
                        </div>

                        {/* District */}
                        <div
                          style={{
                            padding: "10px 14px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #f1f5f9"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              marginBottom: "3px"
                            }}
                          >
                            District
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "800",
                              color: "#0f172a",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <MapPin size={15} color="#7c3aed" />
                            {training.location_details?.district ||
                              "Chhattisgarh"}
                          </div>
                        </div>

                        {/* Block */}
                        <div
                          style={{
                            padding: "10px 14px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #f1f5f9"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              marginBottom: "3px"
                            }}
                          >
                            Block
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "800",
                              color: "#0f172a",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <MapPin size={15} color="#7c3aed" />
                            {training.location_details?.block || "-"}
                          </div>
                        </div>

                        {/* Village */}
                        <div
                          style={{
                            padding: "10px 14px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #f1f5f9"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              marginBottom: "3px"
                            }}
                          >
                            Village
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "800",
                              color: "#0f172a",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <MapPin size={15} color="#7c3aed" />
                            {training.location_details?.village ||
                              training.location_details?.block ||
                              "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modern Completed Status */}
                    {training.status?.toLowerCase() === "completed" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "0 24px 22px"
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "9px",
                            padding: "8px 20px",
                            borderRadius: "999px",
                            background:
                              "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                            border: "1px solid #86EFAC",
                            color: "#166534",
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "0.08em",
                            boxShadow:
                              "0 4px 14px rgba(22, 163, 74, 0.12)"
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#22C55E",
                              boxShadow:
                                "0 0 0 4px rgba(34, 197, 94, 0.12)"
                            }}
                          />

                          COMPLETED
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapBoundsAdjuster = ({ geoJsonData, trigger, focusTarget }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !geoJsonData || focusTarget) return;
    const layer = L.geoJSON(geoJsonData); const bounds = layer.getBounds(); if (!bounds.isValid()) return;
    const timeout = setTimeout(() => { if (map._container) { map.invalidateSize(); map.fitBounds(bounds, { paddingTopLeft: [40, 40], paddingBottomRight: [40, 40], maxZoom: 8 }); } }, 400);
    return () => clearTimeout(timeout);
  }, [geoJsonData, trigger, focusTarget, map]);
  return null;
};

const SummaryTab = ({ summary, viewData, locationsData, trainingLocations, focusTarget, markerColor, activeTrainingType }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: THEME.gap.sm }}>
      <StatCard title="Total Trainings" value={summary?.total_trainings || 0} icon={BookOpen} gradient={THEME.gradients.kpiA} />
      <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={User} gradient={THEME.gradients.kpiB} />
      <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.kpiC} />
      <StatCard title="Total Locations" value={summary?.total_locations || 0} icon={House} gradient={THEME.gradients.kpiD} />
    </div>
    <div style={{ width: '100%', height: '560px', marginTop: '8px', borderRadius: '20px', overflow: 'hidden' }}>
      <TraineeLocationMap
        trainingLocations={trainingLocations}
        focusTarget={focusTarget}
        markerColor={markerColor}
        activeTrainingType={activeTrainingType}
      />
    </div>
  </div>
);

const DetailedTab = ({ viewData }) => (
  <div style={{ ...THEME.glass, padding: THEME.pad.xl, minHeight: '500px', background: '#ffffff' }}>
    <div style={{ marginBottom: THEME.pad.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}><Table size={24} color={THEME.primary} /> Training Directory</h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Comprehensive overview of sessions</p>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
      {viewData && viewData.data && viewData.data.length > 0 ? (
        viewData.data.map((row, i) => (
          <div key={row.training_id || row.id || i} style={{ display: 'grid', gridTemplateColumns: '80px 2.5fr 1.5fr 100px 120px 160px', gap: THEME.gap.md, alignItems: 'center', padding: `16px 20px`, background: '#ffffff', borderRadius: '14px', border: '1px solid #f3f4f6', transition: 'all 0.15s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#e5e7eb'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f3f4f6'; }}>
            <div><span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: THEME.primary, fontWeight: '700', background: '#eff6ff', padding: `4px 8px`, borderRadius: '6px' }}>#{row.training_id || row.id}</span></div>
            <div><div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '2px', fontSize: '0.95rem' }}>{row.subject_name}</div><div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}><User size={13} /> {row.trainer_name}</div></div>
            <div><div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>{row.village || row.location_details?.village || '-'}</div></div>
            <div><span style={{ padding: `4px 8px`, borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', background: '#e0e7ff', color: '#3730a3' }}>{row.status}</span></div>
          </div>
        ))
      ) : (<div style={{ padding: THEME.pad.xl, textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>No Training Data Available</div>)}
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '200px', padding: '14px 16px', borderRadius: '12px', position: 'relative', backgroundImage: `${gradient}`, backgroundSize: 'cover', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`, transition: 'transform 220ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 220ms ease', cursor: 'default', overflow: 'hidden', userSelect: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`; }}>
      <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, zIndex: 1 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.02em', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>{value}</div>
      </div>
      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.1)', zIndex: 1 }}><Icon size={18} color="#ffffff" strokeWidth={2.5} /></div>
    </div>
  );
};

export default Dashboard;
