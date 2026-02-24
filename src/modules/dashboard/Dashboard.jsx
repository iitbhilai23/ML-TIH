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

// --- THEME CONFIGURATION (Original Colors Restored) ---
const THEME = {
  gap: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px' },
  pad: { s: '2', sm: '12px', md: '16px', lg: '20px', xl: '28px' },
  bgGradient: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
  glass: {
    background: 'rgba(255, 255, 255, 0.85)', // Slight glass effect
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
  // --- ORIGINAL CARD GRADIENTS (KEPT AS REQUESTED) ---
  gradients: {
    primary: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    success: 'linear-gradient(135deg, #0f766e 0%, #0f172a 120%)',
    warning: 'linear-gradient(135deg, #b45309 0%, #1f2937 120%)',
    secondary: 'linear-gradient(135deg, #334155 0%, #111827 100%)',
    cyan: 'linear-gradient(135deg, #0e7490 0%, #0f172a 120%)',
    kpiA: 'linear-gradient(135deg, #7b3f99 0%, #5a2b7a 100%)', // Original Purple
    kpiB: 'linear-gradient(135deg, #9b59b6 0%, #7b3f99 100%)', // Original Light Purple
    kpiC: 'linear-gradient(135deg, #6a0dad 0%, #4c1d95 100%)', // Original Deep Purple
    kpiD: 'linear-gradient(135deg, #b06ad9 0%, #7b3f99 100%)'  // Original Soft Purple
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
    const fetchMapLocation = async () => { try { const data = await locationService.getAll(); setLocationsData(Array.isArray(data) ? data : []); } catch (error) { console.error("Error fetching locations for map:", error); } };
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

  const filteredTrainingLocations = useMemo(() => {
    if (!trainingLocations.length) return [];
    const selectedDistrictObj = districts.find(d => String(d.district_cd) === String(filters.district_cd));
    const selectedDistrictName = selectedDistrictObj?.district_name?.toLowerCase();
    const selectedBlockObj = blocks.find(b => String(b.block_cd) === String(filters.block_cd));
    const selectedBlockName = selectedBlockObj?.block_name?.toLowerCase();

    return trainingLocations.filter(training => {
      const loc = training.location_details || {};
      const matchDistrict = !filters.district_cd || (loc.district?.toLowerCase() === selectedDistrictName);
      const matchBlock = !filters.block_cd || (loc.block?.toLowerCase() === selectedBlockName);
      const matchStatus = !filters.status || training.status?.toLowerCase() === filters.status.toLowerCase();
      let matchDate = true;
      const trainingDate = new Date(training.start_date);
      if (filters.start_date && training.start_date) { if (trainingDate < new Date(filters.start_date)) matchDate = false; }
      if (filters.end_date && training.start_date) { if (trainingDate > new Date(filters.end_date)) matchDate = false; }
      return matchDistrict && matchBlock && matchStatus && matchDate;
    });
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

      {/* --- HEADER --- */}
      <Box sx={{ textAlign: 'center', mb: 0.5, opacity: 0, animation: 'fadeIn 0.8s ease-out forwards' }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <Typography variant="h4" component="h1" fontWeight="700" color="text.primary" gutterBottom sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, mb: 0.5 }}>
          Marketplace Literacy <Box component="span" sx={{ background: "linear-gradient(90deg, #D4AF37 0%, #2E8B57 50%, #1976d2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Chhattisgarh</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontSize: { xs: '0.75rem', md: '0.85rem' }, fontWeight: 400 }}>
          Empowering women through financial education and entrepreneurship skills
        </Typography>
      </Box>

      {/* --- GLASSMORPHISM FILTER BAR --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', px: 1, mb: 0.5 }}>
        <div style={{ ...THEME.glass, width: '100%', maxWidth: '1300px', justifyContent: 'center', padding: '12px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: THEME.gap.sm, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs, paddingRight: THEME.pad.sm, borderRight: '1px solid rgba(0,0,0,0.05)', color: THEME.primary, fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            <Filter size={14} /> Filters
          </div>
          <Select name="district_cd" value={filters.district_cd} onChange={handleFilterChange} displayEmpty size="small" sx={selectSx}>
            <MenuItem value="">All Districts</MenuItem>
            {districts.map((d) => (<MenuItem key={d.district_cd} value={d.district_cd}>{d.district_name}</MenuItem>))}
          </Select>
          <Select name="block_cd" value={filters.block_cd} onChange={handleFilterChange} displayEmpty size="small" sx={selectSx} disabled={!filters.district_cd}>
            <MenuItem value="">All Blocks</MenuItem>
            {blocks.map((b) => (<MenuItem key={b.block_cd} value={b.block_cd}>{b.block_name}</MenuItem>))}
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
      </Box>

      {activeTab === 'summary' && <SummaryTab summary={data} viewData={viewData} locationsData={locationsData} trainingLocations={filteredTrainingLocations} />}
      {activeTab === 'detailed' && <DetailedTab viewData={viewData} />}
    </div>
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

// --- SMART MAP COMPONENT ---
const TraineeLocationMap = ({ trainingLocations }) => {
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

  // Smart Grouping Logic: Proximity Merge
  const groupedLocations = useMemo(() => {
    return validTrainingLocations.reduce((acc, training) => {
      const lat = Number(training.location_details?.latitude);
      const lng = Number(training.location_details?.longitude);
      // Round to 4 decimal places (~11m) to group nearby markers
      const key = `${lat.toFixed(4)}-${lng.toFixed(4)}`;
      if (!acc[key]) acc[key] = { lat, lng, trainings: [] };
      acc[key].trainings.push(training);
      return acc;
    }, {});
  }, [validTrainingLocations]);

  // Modern "Stacked" Visual Marker
  const createCustomIcon = (count, color = '#7b3f99') => {
    // Create a "Stacked Card" effect if count > 1
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
      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', padding: '8px 14px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #f1f5f9' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#9647bb' }}></div>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{totalTrainings} Trainings</div>
      </div>

      {/* Map Control: Fullscreen */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 1000 }}>
        <button onClick={() => setIsFullScreen(!isFullScreen)} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '8px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          {isFullScreen ? <Minimize size={18} color="#64748b" /> : <Maximize size={18} color="#64748b" />}
        </button>
      </div>

      <MapContainer style={{ width: '100%', height: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <MapBoundsAdjuster geoJsonData={geoJsonData} trigger={isFullScreen} />
        <MapResizer trigger={isFullScreen} />
        {geoJsonData && <GeoJSON data={geoJsonData} style={{ color: '#7c3aed', weight: 1.5, fillOpacity: 0.03 }} />}

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
                  marker.off('click'); // remove old listeners
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

const MapBoundsAdjuster = ({ geoJsonData, trigger }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !geoJsonData) return;
    const layer = L.geoJSON(geoJsonData); const bounds = layer.getBounds(); if (!bounds.isValid()) return;
    const timeout = setTimeout(() => { if (map._container) { map.invalidateSize(); map.fitBounds(bounds, { paddingTopLeft: [40, 40], paddingBottomRight: [40, 40], maxZoom: 8 }); } }, 400);
    return () => clearTimeout(timeout);
  }, [geoJsonData, trigger, map]);
  return null;
};

const SummaryTab = ({ summary, viewData, locationsData, trainingLocations }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
    {/* --- KPI ROW (Original Colors) --- */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: THEME.gap.sm }}>
      <StatCard title="Total Trainings" value={summary?.total_trainings || 0} icon={BookOpen} gradient={THEME.gradients.kpiA} />
      <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={User} gradient={THEME.gradients.kpiB} />
      <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.kpiC} />
      <StatCard title="Total Locations" value={summary?.total_locations || 0} icon={House} gradient={THEME.gradients.kpiD} />
    </div>
    {/* --- MAP AREA --- */}
    <div style={{ width: '100%', height: '560px', marginTop: '8px', borderRadius: '20px', overflow: 'hidden' }}>
      <TraineeLocationMap trainingLocations={trainingLocations} />
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

// --- KPI CARD COMPONENT (Original Style) ---
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