import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from 'react-leaflet';
import { dashboardService } from '../../services/dashboardService';
import { locationService } from '../../services/locationService';
import { trainingService } from '../../services/trainingService';
import { Users, BookOpen, MapPin, Calendar, Filter, Table, User, House, Maximize, Minimize, X } from 'lucide-react';
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
    district_cd: '', block_cd: '', village: '', start_date: '', end_date: '', subject: '', status: ''
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // console.log(trainingLocations.slice(0, 10));

  // const mapFocusPoint = useMemo(() => {
  //   if (selectedState && locationsData.length > 0) {
  //     const targetLocation = locationsData.find(loc => loc.state_code === selectedState);
  //     if (targetLocation && targetLocation.latitude && targetLocation.longitude) {
  //       return [Number(targetLocation.latitude), Number(targetLocation.longitude)];
  //     }
  //   }
  //   return null;
  // }, [selectedState, locationsData]);

  // const mapFocusPoint = useMemo(() => {
  //   if (selectedState && locationsData.length > 0) {
  //     const targetLocation = locationsData.find(loc => loc.state_code === selectedState);

  //     if (targetLocation && targetLocation.latitude && targetLocation.longitude) {

  //       console.log("🎯 Focus State:", targetLocation.state_name);
  //       console.log("📍 Focus Lat:", targetLocation.latitude);
  //       console.log("📍 Focus Lng:", targetLocation.longitude);

  //       return [Number(targetLocation.latitude), Number(targetLocation.longitude)];
  //     }
  //   }
  //   return null;
  // }, [selectedState, locationsData]);

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

  // const filteredLocationsForMap = useMemo(() => {
  //   return locationsData.filter(loc => {
  //     const matchCountry = !selectedCountry || loc.country_code === selectedCountry;
  //     const matchState = !selectedState || loc.state_code === selectedState;
  //     return matchCountry && matchState;
  //   });
  // }, [locationsData, selectedCountry, selectedState]);

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
    start_date: filters.start_date, end_date: filters.end_date, status: filters.status
  });

  useEffect(() => { fetchData(); }, [activeFilters]);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const [summaryData, viewDataResult] = await Promise.all([
        dashboardService.getDashboardData(filters),
        dashboardService.getDashboardViewData(filters)
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

  // Normalize a name string: lowercase, trim, replace hyphens/underscores with spaces, collapse whitespace
  // This ensures "Mohla-Manpur-Chowki" matches "Mohla Manpur Chowki" etc.
  const normalizeName = (str) =>
    str?.trim().toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ') || '';

  const filteredTrainingLocations = useMemo(() => {
    if (!trainingLocations.length) return [];

    const selectedDistrictObj = districts.find(d => String(d.district_cd) === String(filters.district_cd));
    const selectedDistrictNameNorm = normalizeName(selectedDistrictObj?.district_name);
    const selectedDistrictCd = selectedDistrictObj ? String(selectedDistrictObj.district_cd) : null;

    const selectedBlockObj = blocks.find(b => String(b.block_cd) === String(filters.block_cd));
    const selectedBlockNameNorm = normalizeName(selectedBlockObj?.block_name);
    const selectedBlockCd = selectedBlockObj ? String(selectedBlockObj.block_cd) : null;

    return trainingLocations.filter(training => {
      const loc = training.location_details || {};

      // Match district: try normalized name first, then fall back to district_cd
      let matchDistrict = true;
      if (filters.district_cd && selectedDistrictObj) {
        const locDistrictNorm = normalizeName(loc.district);
        const locDistrictCd = loc.district_cd != null ? String(loc.district_cd) : null;
        matchDistrict =
          (locDistrictNorm && locDistrictNorm === selectedDistrictNameNorm) ||
          (locDistrictCd && selectedDistrictCd && locDistrictCd === selectedDistrictCd);
      }

      // Match block: try normalized name first, then fall back to block_cd
      let matchBlock = true;
      if (filters.block_cd && selectedBlockObj) {
        const locBlockNorm = normalizeName(loc.block);
        const locBlockCd = loc.block_cd != null ? String(loc.block_cd) : null;
        matchBlock =
          (locBlockNorm && locBlockNorm === selectedBlockNameNorm) ||
          (locBlockCd && selectedBlockCd && locBlockCd === selectedBlockCd);
      }

      const matchStatus = !filters.status || training.status?.toLowerCase() === filters.status.toLowerCase();
      let matchDate = true;
      const trainingDate = new Date(training.start_date);
      if (filters.start_date && training.start_date) { if (trainingDate < new Date(filters.start_date)) matchDate = false; }
      if (filters.end_date && training.start_date) { if (trainingDate > new Date(filters.end_date)) matchDate = false; }
      return matchDistrict && matchBlock && matchStatus && matchDate;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingLocations, filters, districts, blocks]);

  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: THEME.bgGradient, color: THEME.primary, fontSize: '1rem', fontWeight: '600' }}>Loading Dashboard Data...</div>;
  if (error) return <div style={{ padding: THEME.pad.xl, color: THEME.danger, textAlign: 'center' }}>Error: {error}</div>;
  if (!data) return <div style={{ padding: THEME.pad.xl, color: '#64748b', textAlign: 'center' }}>No Data Available</div>;

  const { summary } = data;

  const selectSx = {
    minWidth: 160, height: '42px', background: '#ffffff', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 500,
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0', borderRadius: '10px' },
    '&:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #cbd5e1 !important' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: `1px solid ${THEME.primary} !important` },
    '& .MuiSelect-select': { padding: '10px 14px', display: 'flex', alignItems: 'center', color: '#1e293b' }
  };

  return (
    <div style={{ padding: '10px 15px 15px 15px', display: 'flex', flexDirection: 'column', gap: THEME.gap.xs, minHeight: '100vh', background: THEME.bgGradient, overflowX: "hidden" }}>
      <Box sx={{ textAlign: 'center', mb: 0.5, opacity: 0, animation: 'fadeIn 0.8s ease-out forwards' }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        {/* <Typography variant="h4" component="h1" fontWeight="700" color="text.primary" gutterBottom sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, mb: 0.5 }}>
          Marketplace Literacy <Box component="span" sx={{ background: "linear-gradient(90deg, #D4AF37 0%, #2E8B57 50%, #1976d2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Chhattisgarh</Box>
        </Typography> */}
        {/* <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontSize: { xs: '0.75rem', md: '0.85rem' }, fontWeight: 400 }}>
          Empowering women through financial education and entrepreneurship skills
        </Typography> */}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', px: 1, mb: 0.5 }}>
        <div style={{ ...THEME.glass, width: '100%', maxWidth: '1500px', justifyContent: 'center', padding: '12px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: THEME.gap.sm, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs, paddingRight: THEME.pad.sm, borderRight: '1px solid rgba(0,0,0,0.05)', color: THEME.primary, fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            <Filter size={14} /> Filters
          </div>
          <Select name="district_cd" value={filters.district_cd} onChange={handleFilterChange} displayEmpty size="small" sx={selectSx}>
            <MenuItem value="">All Districts</MenuItem>
            {districts.map((d) => (<MenuItem key={d.district_cd} value={d.district_cd}>{d.district_name}</MenuItem>))}
          </Select>
          <Select name="country" value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(""); }} displayEmpty size="small" sx={selectSx}>
            <MenuItem value="">Select Country</MenuItem>
            {countriesFromAPI.map((country) => (<MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>))}
          </Select>
          <Select name="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} displayEmpty size="small" sx={selectSx} disabled={!selectedCountry}>
            <MenuItem value="">-- Select State --</MenuItem>
            {statesFromAPI.map((state) => (<MenuItem key={state.code} value={state.code}>{state.name}</MenuItem>))}
          </Select>
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs }}>
            <Calendar size={14} style={{ color: '#94a3b8' }} />
            <input type="date" name="start_date" style={{ ...THEME.input, height: '38px', fontSize: '0.8rem' }} onChange={handleFilterChange} value={filters.start_date} />
            <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.75rem', margin: `0 ${THEME.gap.xs}` }}>to</span>
            <input type="date" name="end_date" style={{ ...THEME.input, height: '38px', fontSize: '0.8rem' }} onChange={handleFilterChange} value={filters.end_date} />
          </div>
          <Select name="status" value={filters.status} onChange={handleFilterChange} displayEmpty size="small" sx={selectSx}>
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
          </Select>
        </div>
      </Box >
      {activeTab === 'summary' && <SummaryTab summary={data} viewData={viewData} locationsData={locationsData} trainingLocations={filteredTrainingLocations} focusTarget={mapFocusPoint} />}
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
const TraineeLocationMap = ({ trainingLocations, focusTarget }) => {
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
    // return !isNaN(lat) && !isNaN(lng) && isWithinCG(lat, lng);
    return !isNaN(lat) && !isNaN(lng);
  });

  const totalTrainings = validTrainingLocations.length;
  useEffect(() => { setGeoJsonData(cgGeoJson); }, []);

  const groupedLocations = useMemo(() => {
    return validTrainingLocations.reduce((acc, training) => {
      const lat = Number(training.location_details?.latitude);
      const lng = Number(training.location_details?.longitude);
      const key = `${lat.toFixed(4)}-${lng.toFixed(4)}`;
      if (!acc[key]) acc[key] = { lat, lng, trainings: [] };
      acc[key].trainings.push(training);
      return acc;
    }, {});
  }, [validTrainingLocations]);

  // --- Training Markers Icon ---
  const createCustomIcon = (count, color = '#7b3f99') => {
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
      {/* <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', padding: '8px 14px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #f1f5f9' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#9647bb' }}></div>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}></div>
      </div> */}

      {/* Map Control: Fullscreen */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 1000 }}>
        <button onClick={() => setIsFullScreen(!isFullScreen)} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '8px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          {isFullScreen ? <Minimize size={18} color="#64748b" /> : <Maximize size={18} color="#64748b" />}
        </button>
      </div>

      <MapContainer style={{ width: '100%', height: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* Controller to handle map movement based on selection */}
        <MapLocationController target={focusTarget} />

        {/* Adjusts bounds if no specific target is selected */}
        <MapBoundsAdjuster geoJsonData={geoJsonData} trigger={isFullScreen} focusTarget={focusTarget} />

        <MapResizer trigger={isFullScreen} />

        {geoJsonData && <GeoJSON data={geoJsonData} style={{ color: '#7c3aed', weight: 1.5, fillOpacity: 0.03 }} />}

        {/* NEW: Render Focus Marker if a target is selected */}
        {focusTarget && (
          <Marker position={focusTarget} icon={createFocusIcon()} />
        )}

        {/* Render Training Markers */}
        {Object.values(groupedLocations).map((location, i) => {
          const trainings = location.trainings;
          const count = trainings.length;
          const statusColor = getStatusColor(trainings[0]?.status);
          return (
            <Marker
              key={`group-${i}`}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(count, statusColor)}
              ref={(marker) => {
                if (marker) {
                  marker.off('click');
                  marker.on('click', () => {
                    setSelectedTraining([...trainings]);
                  });
                }
              }}
            />
          );
        })}
      </MapContainer>

      {/* MODAL */}
      {Array.isArray(selectedTraining) && selectedTraining.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, animation: 'fadeIn 0.2s' }} onClick={() => setSelectedTraining(null)}>
          <div style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '420px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'scaleIn 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedTraining(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#334155" /></button>
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={24} color="#9647bb" /></div>
                <div>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: '700' }}>{selectedTraining[0]?.location_details?.village || 'Location'}</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{selectedTraining.length} training sessions found here</p>
                </div>
              </div>
              {selectedTraining.map((training, index) => (
                <div key={training.id || index} style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', marginBottom: '10px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>{training.subject_name || 'N/A'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ ...getStatusStyle(training.status), padding: '4px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>{training.status}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}><Users size={14} />{training.total_participants || 0}</div>
                  </div>
                </div>
              ))}
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

const SummaryTab = ({ summary, viewData, locationsData, trainingLocations, focusTarget }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: THEME.gap.sm }}>
      <StatCard title="Total Trainings" value={summary?.total_trainings || 0} icon={BookOpen} gradient={THEME.gradients.kpiA} />
      <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={User} gradient={THEME.gradients.kpiB} />
      <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.kpiC} />
      <StatCard title="Total Locations" value={summary?.total_locations || 0} icon={House} gradient={THEME.gradients.kpiD} />
    </div>
    <div style={{ width: '100%', height: '560px', marginTop: '8px', borderRadius: '20px', overflow: 'hidden' }}>
      <TraineeLocationMap trainingLocations={trainingLocations} focusTarget={focusTarget} />
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
