import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { dashboardService } from '../../services/dashboardService';
import { locationService } from '../../services/locationService';
import { Users, BookOpen, MapPin, Calendar, Filter, TrendingUp, Table, BarChart2, User, Map as MapIcon, Maximize, Minimize } from 'lucide-react';

// ===== CLEAN & ELEGANT THEME =====
const THEME = {
  gap: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  pad: {
    s: '2',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '28px'
  },
  bgGradient: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
  glass: {
    background: '#ffffff',
    border: '1px solid #f3f4f6',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease-in-out'
  },
  primary: '#4f46e5',
  secondary: '#db2777',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    secondary: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  },
  input: {
    padding: '10px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#1e293b',
    background: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: '40px',
    display: 'flex',
    alignItems: 'center'
  }
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [filters, setFilters] = useState({
    district: '',
    block: '',
    village: '',
    start_date: '',
    end_date: '',
    subject: '',
    status: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, viewDataResult] = await Promise.all([
        dashboardService.getDashboardData(filters),
        dashboardService.getDashboardViewData(filters)
      ]);
      setData(summaryData);
      setViewData(viewDataResult);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMapLocation = async () => {
      try {
        const data = await locationService.getAll();
        setLocationsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching locations for map:", error);
      }
    };
    fetchMapLocation();
  }, [])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: THEME.bgGradient,
      color: THEME.primary,
      fontSize: '1rem',
      fontWeight: '600'
    }}>
      Loading Dashboard Data...
    </div>
  );

  if (error) return <div style={{ padding: THEME.pad.xl, color: THEME.danger, textAlign: 'center' }}>Error: {error}</div>;
  if (!data) return <div style={{ padding: THEME.pad.xl, color: '#64748b', textAlign: 'center' }}>No Data Available</div>;

  const { summary, participant_stats } = data;

  const COLORS = [THEME.primary, THEME.success, THEME.warning, THEME.secondary];
  const trainingStatusData = [
    { name: 'Scheduled', value: viewData?.by_status?.scheduled || 0 },
    { name: 'Ongoing', value: viewData?.by_status?.ongoing || 0 },
    { name: 'Completed', value: viewData?.by_status?.completed || 0 },
    { name: 'Cancelled', value: viewData?.by_status?.cancelled || 0 }
  ];

  return (
    <div style={{
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: THEME.gap.sm,
      minHeight: '100vh',
      background: THEME.bgGradient,
      overflowX: "hidden",
    }}>
      {/* ===== HEADER & TABS ===== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: THEME.gap.md }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard Overview
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
            Welcome back, here is your training summary.
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: THEME.gap.xs,
          padding: '4px',
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #f3f4f6'
        }}>
          <button
            onClick={() => setActiveTab('summary')}
            style={{ ...getTabStyle(activeTab === 'summary', THEME.gradients.primary) }}
          >
            <TrendingUp size={18} /> <span>Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            style={{ ...getTabStyle(activeTab === 'detailed', THEME.gradients.primary) }}
          >
            <Table size={18} /> <span>Detailed View</span>
          </button>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div style={{ ...THEME.glass, padding: `${THEME.pad.md} ${THEME.pad.lg}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: THEME.gap.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs, paddingRight: THEME.pad.md, borderRight: '1px solid #f3f4f6', color: THEME.primary, fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          <Filter size={16} /> Filters
        </div>
        <select name="district" style={THEME.input} onChange={handleFilterChange} value={filters.district}>
          <option value="">All Districts</option>
          <option value="Khairagarh">Khairagarh</option>
          <option value="Raipur">Raipur</option>
          <option value="Bilaspur">Bilaspur</option>
        </select>
        <select name="block" style={THEME.input} onChange={handleFilterChange} value={filters.block}>
          <option value="">All Blocks</option>
          <option value="Khairagarh">Khairagarh</option>
          <option value="Dhamtari">Dhamtari</option>
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs }}>
          <Calendar size={16} style={{ color: '#94a3b8' }} />
          <input type="date" name="start_date" style={THEME.input} onChange={handleFilterChange} value={filters.start_date} />
          <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', margin: `0 ${THEME.gap.xs}` }}>to</span>
          <input type="date" name="end_date" style={THEME.input} onChange={handleFilterChange} value={filters.end_date} />
        </div>
        <select name="status" style={THEME.input} onChange={handleFilterChange} value={filters.status}>
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ===== CONTENT ===== */}
      {activeTab === 'summary' && <SummaryTab summary={data} viewData={viewData} participant_stats={participant_stats} locationsData={locationsData} />}
      {activeTab === 'detailed' && <DetailedTab viewData={viewData} />}
    </div>
  );
};

// Helper for Button Styles
const getTabStyle = (isActive, gradient) => ({
  display: 'flex', alignItems: 'center', gap: THEME.gap.xs, padding: `8px ${THEME.pad.md}`, border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease-in-out',
  background: isActive ? gradient : 'transparent',
  color: isActive ? 'white' : '#64748b',
  letterSpacing: '0.01em'
});

// ===== HELPER COMPONENT TO FIX MAP RESIZE =====
// This component uses useMap hook to access the map instance and trigger a resize update
const MapResizer = ({ trigger }) => {
  const map = useMap();
  useEffect(() => {
    // Wait a tiny bit for the DOM transition to finish then invalidate size
    const resizeTimeout = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(resizeTimeout);
  }, [trigger, map]);
  return null;
};

// ===== ENHANCED SMOOTH MAP COMPONENT WITH GEOJSON & FULLSCREEN =====
const TraineeLocationMap = ({ locationsData }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fetch GeoJSON data for CG State Boundary
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch('http://127.0.0.1:4001/files/Map/topojsons/states/cg.json');
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error fetching CG GeoJSON:", error);
      }
    };
    fetchGeoJson();
  }, []);

  // Define Smooth Custom Marker Icon
  const createCustomIcon = () => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="width: 100%; height: 100%; background: ${THEME.gradients.primary}; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3); position: absolute; z-index: 2;"></div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%; z-index: 3;"></div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; background: ${THEME.primary}; opacity: 0.3; border-radius: 50%; z-index: 1; animation: pulseSmooth 2.5s infinite ease-out;"></div>
        </div>
        <style>
          @keyframes pulseSmooth {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
            100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
          }
        </style>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const validLocations = locationsData.filter(loc => loc.latitude && loc.longitude);

  // Default center to Chhattisgarh roughly if no data, else average of locations
  let center = [21.2787, 81.8661];
  let zoom = 7;

  if (validLocations.length > 0) {
    const avgLat = validLocations.reduce((sum, loc) => sum + parseFloat(loc.latitude), 0) / validLocations.length;
    const avgLng = validLocations.reduce((sum, loc) => sum + parseFloat(loc.longitude), 0) / validLocations.length;
    center = [avgLat, avgLng];
    zoom = 9;
  }

  // Styles for the main container
  const containerStyle = {
    ...THEME.glass,
    padding: isFullScreen ? 0 : THEME.pad.md,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    ...(isFullScreen ? {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      borderRadius: 0,
      border: 'none',
      margin: 0
    } : {})
  };

  return (
    <>
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: none;
          padding: 0;
          overflow: hidden;
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: bottom center;
        }
        .leaflet-popup-content { margin: 0; line-height: 1.5; }
        .leaflet-popup-tip { background: white; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .leaflet-container a.leaflet-popup-close-button {
          color: #94a3b8; top: 12px; right: 12px; font-size: 20px; padding: 4px; background: rgba(255,255,255,0.8);
          border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s ease;
        }
        .leaflet-popup-content-wrapper:hover .leaflet-container a.leaflet-popup-close-button { opacity: 1; }
        .leaflet-container a.leaflet-popup-close-button:hover { color: #4f46e5; background: white; }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div style={containerStyle}>

        {/* TITLE - TOP LEFT */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '12px 18px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'auto'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: THEME.gradients.primary,
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
          }}></div>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#1e293b',
            letterSpacing: '-0.01em'
          }}>
            Training Center Locations
          </div>
        </div>

        {/* FULLSCREEN TOGGLE BUTTON - TOP RIGHT */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              width: '36px',
              height: '36px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = THEME.primary;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={isFullScreen ? "Exit Fullscreen" : "View Fullscreen"}
          >
            {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>

        <div style={{ flex: 1, width: '100%', height: '100%', background: '#f8fafc', borderRadius: isFullScreen ? 0 : '12px', border: isFullScreen ? 'none' : '1px solid #f3f4f6', overflow: 'hidden' }}>
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ width: "100%", height: "100%" }}
            zoomControl={false}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {geoJsonData && (
              <GeoJSON
                data={geoJsonData}
                style={{
                  color: THEME.primary,
                  weight: 2,
                  fillColor: THEME.primary,
                  fillOpacity: 0.05,
                  dashArray: '5, 5'
                }}
              />
            )}

            {/* COMPONENT TO FIX RESIZE ISSUE */}
            <MapResizer trigger={isFullScreen} />

            {
              validLocations.map((item, index) => (
                <Marker
                  key={item.id || index}
                  position={[item.latitude, item.longitude]}
                  icon={createCustomIcon()}
                >
                  <Popup>
                    <div style={{ minWidth: '220px', padding: '0' }}>
                      <div style={{ padding: '16px', background: 'white', color: '#1e293b' }}>
                        <div style={{ fontWeight: '800', fontSize: '1.05rem', color: THEME.primary, marginBottom: '4px', letterSpacing: '-0.02em' }}>
                          {item.village}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px', lineHeight: '1.4' }}>
                          {item.address_line || 'No specific address details provided.'}
                        </div>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          fontSize: '0.8rem', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px',
                          color: '#475569', fontWeight: '500'
                        }}>
                          <span>{item.block}</span>
                          <span>{item.district}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))
            }
          </MapContainer>

          {/* Empty State Fallback */}
          {validLocations.length === 0 && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.8)', zIndex: 500,
              color: '#94a3b8', textAlign: 'center'
            }}>
              <MapIcon size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No location data available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ===== SUB COMPONENTS =====

const SummaryTab = ({ summary, viewData, participant_stats, locationsData }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.md }}>

    {/* Top Stats Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: THEME.gap.lg }}>
      <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={Users} gradient={THEME.gradients.primary} />
      <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.success} />
      <StatCard title="Active Trainings" value={summary?.active_trainings || 0} icon={BookOpen} gradient={THEME.gradients.warning} />
      <StatCard title="Locations Covered" value={summary?.total_locations || 0} icon={MapPin} gradient={THEME.gradients.secondary} />
    </div>

    {/* NEW LAYOUT: 30% Status Card | 70% Map Card */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '30% 70%',
      gap: THEME.gap.lg,
      alignItems: 'stretch'
    }}>
      {/* Left 30%: Training Status */}
      <div>
        <TrainingStatusCard viewData={viewData} summary={summary} />
      </div>

      {/* Right 70%: Map with Lat/Long */}
      <TraineeLocationMap locationsData={locationsData} />
    </div>

  </div>
);

const DetailedTab = ({ viewData }) => (
  <div style={{ ...THEME.glass, padding: THEME.pad.xl, minHeight: '500px' }}>
    <div style={{ marginBottom: THEME.pad.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}>
          <Table size={24} color={THEME.primary} /> Training Directory
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
          Overview of all training sessions
        </p>
      </div>
      <div style={{
        background: THEME.gradients.primary, padding: `6px ${THEME.pad.md}`, borderRadius: '8px', color: 'white', fontWeight: '700', fontSize: '0.85rem',
        boxShadow: '0 2px 4px rgba(79, 70, 229, 0.1)'
      }}>
        Total Records: {viewData?.data?.length || 0}
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
      {viewData && viewData.data && viewData.data.length > 0 ? (
        viewData.data.map((row, i) => (
          <div
            key={row.training_id || i}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 2.5fr 1.5fr 100px 120px 160px',
              gap: THEME.gap.md,
              alignItems: 'center',
              padding: `${THEME.pad.md} ${THEME.pad.lg}`,
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #f3f4f6',
              transition: 'all 0.15s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = THEME.primary;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#f3f4f6';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <span style={{
                fontFamily: 'monospace', fontSize: '0.85rem', color: THEME.primary, fontWeight: '700',
                background: '#eff6ff', padding: `4px ${THEME.pad.sm}`, borderRadius: '6px', display: 'inline-block', letterSpacing: '-0.03em'
              }}>
                #{row.training_id}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '2px', fontSize: '0.95rem', lineHeight: '1.4' }}>{row.subject_name}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: THEME.gap.xs, fontWeight: '500' }}>
                <User size={13} /> {row.trainer_name}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>{row.village || '-'}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', fontWeight: '500' }}>{row.district}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}>
                <div style={{ width: '40px', height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(row.total_participants / row.max_participants) * 100}%`, height: '100%', background: THEME.success, borderRadius: '2px' }}></div>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{row.total_participants}</span>
              </div>
            </div>
            <div>
              <span style={{
                padding: `4px ${THEME.pad.sm}`, borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block', letterSpacing: '0.05em',
                ...(row.status === 'completed' ? { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' } :
                  row.status === 'ongoing' ? { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' } :
                    row.status === 'scheduled' ? { background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' } :
                      { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' })
              }}>
                {row.status}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
              {new Date(row.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        ))
      ) : (
        <div style={{
          padding: THEME.pad.xl, textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px dashed #f3f4f6', color: '#94a3b8', fontSize: '0.95rem'
        }}>
          No Training Data Available
        </div>
      )}
    </div>
  </div>
);

// ===== DASHBOARD CARDS =====

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div
    style={{
      background: gradient,
      borderRadius: '16px',
      padding: '3px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      transition: 'all 0.2s ease-in-out'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
    }}
  >
    <div style={{
      background: '#ffffff',
      borderRadius: '13px',
      padding: THEME.pad.lg,
      display: 'flex',
      flexDirection: 'column',
      gap: THEME.gap.sm,
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            {title}
          </div>
          <div style={{
            fontSize: '2.2rem', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.02em',
            background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            {value}
          </div>
        </div>
        <div style={{
          width: '48px', height: '48px', background: gradient, borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  </div>
);

const TrainingStatusCard = ({ viewData, summary }) => (
  <div style={{
    background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    borderRadius: '16px',
    padding: '3px',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)',
    height: '100%'
  }}>
    <div style={{ background: '#ffffff', borderRadius: '13px', padding: THEME.pad.lg, height: '100%', boxSizing: 'border-box' }}>
      <h3 style={{ fontWeight: '700', color: '#3730a3', marginBottom: THEME.pad.md, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}>
        <BarChart2 color={THEME.primary} /> Training Status
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
        {['Scheduled', 'Ongoing', 'Completed', 'Cancelled'].map((status, i) => {
          const key = status.toLowerCase();
          const val = viewData?.by_status?.[key] || 0;
          const colors = [THEME.primary, THEME.warning, THEME.success, THEME.danger];
          const c = colors[i];
          const total = summary?.total_trainings || 1;
          const pct = Math.round((val / total) * 100);

          return (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${THEME.pad.sm} ${THEME.pad.md}`,
              background: '#f8fafc', borderRadius: '8px', border: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: c }}></div>
                <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{status}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>{val}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', marginTop: '1px' }}>{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default Dashboard;