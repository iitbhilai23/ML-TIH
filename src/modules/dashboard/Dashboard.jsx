
import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { dashboardService } from '../../services/dashboardService';
import { locationService } from '../../services/locationService';
import { trainingService } from '../../services/trainingService';
import { Users, BookOpen, MapPin, Calendar, Filter, TrendingUp, Table, BarChart2, User, Map as MapIcon, Maximize, Minimize } from 'lucide-react';

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
    primary: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    success: 'linear-gradient(135deg, #0f766e 0%, #0f172a 120%)',
    warning: 'linear-gradient(135deg, #b45309 0%, #1f2937 120%)',
    secondary: 'linear-gradient(135deg, #334155 0%, #111827 100%)',
    cyan: 'linear-gradient(135deg, #0e7490 0%, #0f172a 120%)', // New gradient added
    kpiA: 'linear-gradient(135deg, #7b3f99 0%, #5a2b7a 100%)',
    kpiB: 'linear-gradient(135deg, #9b59b6 0%, #7b3f99 100%)',
    kpiC: 'linear-gradient(135deg, #6a0dad 0%, #4c1d95 100%)',
    kpiD: 'linear-gradient(135deg, #b06ad9 0%, #7b3f99 100%)'
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
  const [trainingLocations, setTrainingLocations] = useState([]);
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

  useEffect(() => {
    const fetchTrainingsForMap = async () => {
      try {
        const trainings = await trainingService.getAll();

        console.log("Training data loaded:", trainings);

        setTrainingLocations(
          Array.isArray(trainings) ? trainings : trainings?.data || []
        );
      } catch (error) {
        console.error("Error fetching trainings for map:", error);
      }
    };

    fetchTrainingsForMap();
  }, []);

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

  const { summary } = data;

  return (
    <div style={{
      padding: 10,
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
      {activeTab === 'summary' && (
        <SummaryTab
          summary={data}
          viewData={viewData}
          locationsData={locationsData}
          trainingLocations={trainingLocations}
        />
      )}

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
const MapResizer = ({ trigger }) => {
  const map = useMap();
  useEffect(() => {
    // Small timeout allows CSS transition to finish before invalidating size
    const resizeTimeout = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(resizeTimeout);
  }, [trigger, map]);
  return null;
};

// ===== ENHANCED SMOOTH MAP COMPONENT WITH GEOJSON & FULLSCREEN =====
const TraineeLocationMap = ({ locationsData, trainingLocations }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false); // STATE FOR FULLSCREEN

  // ✅ Trainings that have lat/lng
  const validTrainingLocations = trainingLocations.filter(
    t =>
      t.location_details &&
      t.location_details.latitude &&
      t.location_details.longitude
  );

  // ✅ Plain locations (no training)
  const validLocations = locationsData.filter(
    loc => loc.latitude && loc.longitude
  );

  // ===== MAP CENTER LOGIC =====
  let center = [21.2787, 81.8661];
  let zoom = 7;

  const allPoints = [
    ...validLocations,
    ...validTrainingLocations.map(t => t.location_details)
  ];

  if (allPoints.length > 0) {
    const avgLat =
      allPoints.reduce((s, l) => s + Number(l.latitude), 0) / allPoints.length;
    const avgLng =
      allPoints.reduce((s, l) => s + Number(l.longitude), 0) / allPoints.length;

    center = [avgLat, avgLng];
    zoom = 9;
  }

  // ===== GEOJSON =====
  useEffect(() => {
    fetch('http://127.0.0.1:4001/files/Map/topojsons/states/cg.json')
      .then(res => res.json())
      .then(setGeoJsonData)
      .catch(console.error);
  }, []);

  // ===== MARKER ICON =====
  const createCustomIcon = () =>
    L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          position: relative;
          width: 22px;
          height: 32px;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 50%;
            width: 20px;
            height: 20px;
            background: #9647bb;
            border-radius: 50% 50% 50% 0;
            transform: translateX(-50%) rotate(-45deg);
            box-shadow: 0 4px 12px rgba(255, 45, 255, 0.31);
            border: 2px solid rgba(255,255,255,0.85);
          "></div>
          <div style="
            position: absolute;
            top: 6px;
            left: 50%;
            width: 8px;
            height: 8px;
            background: #e2e8f0;
            border-radius: 50%;
            transform: translateX(-50%);
            box-shadow: 0 0 0 3px rgba(226,232,240,0.35);
          "></div>
        </div>
      `,
      iconSize: [22, 32],
      iconAnchor: [11, 32]
    });

  // ===== CONTAINER STYLES (Dynamic) =====
  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    position: 'relative', // Needed for absolute children
    background: 'linear-gradient(to bottom right, #f8fafc, #ffffff)',
    borderRadius: isFullScreen ? '0' : '16px',
    border: isFullScreen ? 'none' : '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: isFullScreen ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.05)',
    padding: isFullScreen ? 0 : THEME.pad.lg,
    overflow: 'hidden',
    ...(isFullScreen ? {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      margin: 0
    } : {})
  };

  return (
    <div style={containerStyle}>
      {/* Decorative border elements */}
      {!isFullScreen && (
        <>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(to right, #e2e8f0, #f1f5f9, #e2e8f0)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(to right, #e2e8f0, #f1f5f9, #e2e8f0)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            bottom: '0',
            width: '3px',
            background: 'linear-gradient(to bottom, #e2e8f0, #f1f5f9, #e2e8f0)',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            width: '3px',
            background: 'linear-gradient(to bottom, #e2e8f0, #f1f5f9, #e2e8f0)',
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            zIndex: 1
          }}></div>
          {/* Corner decorations */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '16px',
            height: '16px',
            borderTop: '2px solid #e2e8f0',
            borderLeft: '2px solid #e2e8f0',
            borderTopLeftRadius: '8px',
            zIndex: 2
          }}></div>
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            borderTop: '2px solid #e2e8f0',
            borderRight: '2px solid #e2e8f0',
            borderTopRightRadius: '8px',
            zIndex: 2
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            width: '16px',
            height: '16px',
            borderBottom: '2px solid #e2e8f0',
            borderLeft: '2px solid #e2e8f0',
            borderBottomLeftRadius: '8px',
            zIndex: 2
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            borderBottom: '2px solid #e2e8f0',
            borderRight: '2px solid #e2e8f0',
            borderBottomRightRadius: '8px',
            zIndex: 2
          }}></div>
        </>
      )}

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

      {/* FULLSCREEN TOGGLE - TOP RIGHT */}
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

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', borderRadius: isFullScreen ? 0 : '12px' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={{
              color: THEME.primary,
              weight: 2,
              fillOpacity: 0.05
            }}
          />
        )}

        {/* MAP RESIZER FIX */}
        <MapResizer trigger={isFullScreen} />

        {/* ===== LOCATION MARKERS (NO TRAINER UI) ===== */}
        {validLocations.map((loc, i) => (
          <Marker
            key={`loc-${i}`}
            position={[loc.latitude, loc.longitude]}
            icon={createCustomIcon()}
          >
            <Popup>
              <strong>{loc.village}</strong>
              <br />
              {loc.block}, {loc.district}
            </Popup>
          </Marker>
        ))}

        {/* ===== TRAINING MARKERS (WITH IMAGE) ===== */}
        {validTrainingLocations.map((training, i) => {
          const loc = training.location_details;

          return (
            <Marker
              key={`training-${training.id}`}
              position={[loc.latitude, loc.longitude]}
              icon={createCustomIcon()}
            >
              <Popup>
                <div style={{ minWidth: '240px' }}>
                  {/* Trainer Row */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <img
                      src={
                        training.trainer_profile_image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          training.trainer_name
                        )}`
                      }
                      alt={training.trainer_name}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {training.trainer_name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {training.subject_name}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, color: THEME.primary }}>
                    {loc.village}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569' }}>
                    {loc.block}, {loc.district}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        training.status === 'completed'
                          ? THEME.success
                          : training.status === 'ongoing'
                            ? THEME.warning
                            : THEME.primary
                    }}
                  >
                    Status: {training.status}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

// ===== SUB COMPONENTS =====

const SummaryTab = ({ summary, viewData, locationsData, trainingLocations }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>

    {/* Top Stats Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: THEME.gap.md }}>
      <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={User} gradient={THEME.gradients.kpiA} />
      <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.kpiB} />
      <StatCard title="Active Trainings" value={summary?.active_trainings || 0} icon={BookOpen} gradient={THEME.gradients.kpiC} />
      <StatCard title="Locations Covered" value={summary?.total_locations || 0} icon={MapPin} gradient={THEME.gradients.kpiD} />
    </div>

    {/* NEW LAYOUT: 30% Status Card | 70% Map Card */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '30% 70%',
      gap: THEME.gap.sm,
      alignItems: 'stretch'
    }}>
      {/* Left 30%: Training Status */}
      <div>
        <TrainingStatusCard viewData={viewData} summary={summary} />
      </div>

      {/* Right 70%: Map with Lat/Long */}
      <TraineeLocationMap
        locationsData={locationsData}
        trainingLocations={trainingLocations}
      />

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
// Redesigned StatCard with soft gradient, white text, and modern hover effects
const StatCard = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div
      style={{
        // Base Container Styles
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '260px',
        padding: '22px 24px',
        borderRadius: '12px',
        position: 'relative',
        backgroundImage: `${gradient},
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='white' stop-opacity='0.12'/><stop offset='1' stop-color='white' stop-opacity='0'/></linearGradient></defs><rect width='120' height='120' fill='url(%23g)'/><path d='M0 20 H120 M0 60 H120 M0 100 H120' stroke='white' stroke-opacity='0.08'/><path d='M20 0 V120 M60 0 V120 M100 0 V120' stroke='white' stroke-opacity='0.06'/></svg>")`,
        backgroundBlendMode: 'screen',
        backgroundSize: 'cover',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        // Subtle shadow for depth
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.14)',
        // Smooth transition for hover effects (250ms ease)
        transition: 'transform 220ms ease, box-shadow 220ms ease, filter 220ms ease',
        cursor: 'default',
        overflow: 'hidden', // Ensures rounded corners clip content
        userSelect: 'none', // Prevents text selection on clicks
      }}
      // Interaction: Hover effect handlers
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        // Increase shadow intensity on hover
        e.currentTarget.style.boxShadow = '0 18px 36px rgba(0, 0, 0, 0.18)';
        e.currentTarget.style.filter = 'saturate(1.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        // Revert shadow to default
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.14)';
        e.currentTarget.style.filter = 'none';
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '0',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0))',
          pointerEvents: 'none'
        }}
      />
      {/* Left Side: Content (Title + Value) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
          zIndex: 1
        }}
      >
        {/* Title Typography */}
        <div
          style={{
            fontSize: '10.5px',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.9)', // White with 0.9 opacity
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.18)',
            padding: '4px 8px',
            borderRadius: '8px',
            width: 'fit-content',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {title}
        </div>

        {/* Value Typography */}
        <div
          style={{
            fontSize: '34px',
            fontWeight: '800',
            lineHeight: '1.05',
            letterSpacing: '-0.015em',
            color: '#ffffff', // Solid white for high contrast
            textShadow: '0 2px 10px rgba(0,0,0,0.18)'
          }}
        >
          {value}
        </div>
      </div>

      {/* Right Side: Icon Container */}
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(6px)', // Adds subtle glassmorphism effect
          border: '1px solid rgba(255, 255, 255, 0.24)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.12)',
          zIndex: 1
        }}
      >
        {/* Render Icon passed via props */}
        <Icon
          size={26}
          color="#ffffff"
          strokeWidth={2.5}
          style={{
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

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
