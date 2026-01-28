import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { dashboardService } from '../../services/dashboardService';
import { locationService } from '../../services/locationService';
import { trainingService } from '../../services/trainingService';
import { Users, BookOpen, MapPin, Calendar, Filter, TrendingUp, Table, BarChart2, User, Map as MapIcon, Maximize, Minimize, House } from 'lucide-react';

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
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [filters, setFilters] = useState({
    district_cd: '',
    block_cd: '',
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
    const fetchDistricts = async () => {
      try {
        const data = await dashboardService.getDistricts();
        setDistricts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading districts', error);
      }
    };

    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        if (!filters.district_cd) {
          // Reset blocks if "All Districts"
          setBlocks([]);
          setFilters((prev) => ({ ...prev, block_cd: '' }));
          return;
        }

        const data = await dashboardService.getBlocksByDistrict(filters.district_cd);
        setBlocks(Array.isArray(data) ? data : []);

        // Reset selected block when district changes
        setFilters((prev) => ({ ...prev, block_cd: '' }));
      } catch (error) {
        console.error('Error loading blocks', error);
      }
    };

    fetchBlocks();
  }, [filters.district_cd]);


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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: THEME.gap.md }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard Overview
          </h1>
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

      <div style={{ ...THEME.glass, padding: `${THEME.pad.md} ${THEME.pad.lg}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: THEME.gap.xl }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs, paddingRight: THEME.pad.md, borderRight: '1px solid #f3f4f6', color: THEME.primary, fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          <Filter size={16} /> Filters
        </div>
        <select name="district_cd" style={THEME.input} onChange={handleFilterChange} value={filters.district_cd}>
          <option value="">All Districts</option>
          {/* <option value="2230">Khairagarh</option>
          <option value="2210">Durg</option>
          <option value="2209">Rajnandgaon</option> */}
          {districts.map((d) => (
            <option key={d.district_cd} value={d.district_cd}>
              {d.district_name}
            </option>
          ))}
        </select>
        <select name="block_cd" style={THEME.input} onChange={handleFilterChange} value={filters.block_cd} >
          {/* <option value="">All Blocks</option>
          <option value="220908">Khairagarh</option>
          <option value="221011">Patan</option>
          <option value="220904">Churia</option> */}
          {/* <option value="">
            {filters.district_cd ? 'All Blocks' : 'Select District First'}
          </option>
          disabled={!filters.district_cd}
           */}
          <option value="">All Blocks</option>
          {blocks.map((b) => (
            <option key={b.block_cd} value={b.block_cd}>
              {b.block_name}
            </option>
          ))}
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



const getTabStyle = (isActive, gradient) => ({
  display: 'flex', alignItems: 'center', gap: THEME.gap.xs, padding: `8px ${THEME.pad.md}`, border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease-in-out',
  background: isActive ? gradient : 'transparent',
  color: isActive ? 'white' : '#64748b',
  letterSpacing: '0.01em'
});

const MapResizer = ({ trigger }) => {
  const map = useMap();
  useEffect(() => {
    const resizeTimeout = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(resizeTimeout);
  }, [trigger, map]);
  return null;
};

// ===== MAP COMPONENT WITH SPECIFIC FAKE LOCATIONS =====
const TraineeLocationMap = ({ locationsData, trainingLocations }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // STRICT BOUNDS FOR CHHATTISGARH
  const MIN_LAT = 17.5;
  const MAX_LAT = 24.0;
  const MIN_LNG = 79.5;
  const MAX_LNG = 85.0;

  // Helper to check if coordinate is valid and within CG
  const isWithinCG = (lat, lng) => {
    return lat >= MIN_LAT && lat <= MAX_LAT && lng >= MIN_LNG && lng <= MAX_LNG;
  };

  // ===== SPECIFIC FAKE DATA POINTS (OLD + NEW) =====
  const rawSpecificLocations = [
    // Old Locations
    { name: 'Balod', lat: 20.7304, lng: 81.2042, district: 'Balod' },
    { name: 'Gurur', lat: 20.6749, lng: 81.0047, district: 'Balod' },
    { name: 'Dondi Lohara', lat: 20.4703, lng: 81.0328, district: 'Balod' },
    { name: 'Dondi', lat: 20.5800, lng: 81.2300, district: 'Balod' },
    { name: 'Bemetara', lat: 21.7156, lng: 81.5342, district: 'Bemetara' },
    { name: 'Nawagarh (Bemetara)', lat: 21.6450, lng: 81.6120, district: 'Bemetara' },
    { name: 'Saja', lat: 21.6500, lng: 81.4000, district: 'Bemetara' },
    { name: 'Kawardha', lat: 22.0086, lng: 81.2450, district: 'Kabirdham' },
    { name: 'Pandariya', lat: 22.2226, lng: 81.4095, district: 'Kabirdham' },
    { name: 'Bodla', lat: 22.2150, lng: 81.3700, district: 'Kabirdham' },
    { name: 'Bilaspur', lat: 22.0786, lng: 82.1523, district: 'Bilaspur' },
    { name: 'Takhatpur', lat: 22.1300, lng: 82.0300, district: 'Bilaspur' },
    { name: 'Kota', lat: 22.3000, lng: 82.0300, district: 'Bilaspur' },
    { name: 'Masturi', lat: 22.0100, lng: 82.1600, district: 'Bilaspur' },
    { name: 'Bilha', lat: 21.9500, lng: 82.0500, district: 'Bilaspur' },
    { name: 'Mungeli', lat: 22.0656, lng: 81.6843, district: 'Mungeli' },
    { name: 'Pathariya', lat: 22.0500, lng: 81.5600, district: 'Mungeli' },
    { name: 'Lormi', lat: 22.2745, lng: 81.7012, district: 'Mungeli' },
    { name: 'Korba', lat: 22.3639, lng: 82.7348, district: 'Korba' },
    { name: 'Katghora', lat: 22.5020, lng: 82.5430, district: 'Korba' },
    { name: 'Pali', lat: 22.3900, lng: 82.3000, district: 'Korba' },
    { name: 'Kartala', lat: 22.2800, lng: 82.7600, district: 'Korba' },
    { name: 'Janjgir', lat: 22.0093, lng: 82.5778, district: 'Janjgir-Champa' },
    { name: 'Champa', lat: 22.0333, lng: 82.6500, district: 'Janjgir-Champa' },
    { name: 'Pamgarh', lat: 21.8750, lng: 82.5200, district: 'Janjgir-Champa' },
    { name: 'Akaltara', lat: 22.0244, lng: 82.4269, district: 'Janjgir-Champa' },
    { name: 'Baloda', lat: 22.1330, lng: 82.4900, district: 'Janjgir-Champa' },
    { name: 'Nawagarh (Janjgir)', lat: 21.9600, lng: 82.4500, district: 'Janjgir-Champa' },
    { name: 'Raigarh', lat: 21.8974, lng: 83.3959, district: 'Raigarh' },
    { name: 'Baramkela', lat: 21.4700, lng: 83.1600, district: 'Raigarh' },
    { name: 'Sarangarh', lat: 21.5800, lng: 83.0800, district: 'Raigarh' },
    { name: 'Tamnar', lat: 22.1200, lng: 83.2500, district: 'Raigarh' },
    { name: 'Ambikapur', lat: 23.1172, lng: 83.1967, district: 'Surguja' },
    { name: 'Sitapur', lat: 22.7830, lng: 83.4300, district: 'Surguja' },
    { name: 'Mainpat', lat: 22.8200, lng: 83.3200, district: 'Surguja' },
    { name: 'Balrampur', lat: 23.6080, lng: 83.6100, district: 'Balrampur' },
    { name: 'Ramanujganj', lat: 23.8000, lng: 83.7000, district: 'Balrampur' },
    { name: 'Wadrafnagar', lat: 23.7000, lng: 83.3600, district: 'Balrampur' },
    { name: 'Jashpur', lat: 22.8800, lng: 84.1400, district: 'Jashpur' },
    { name: 'Kunkuri', lat: 22.6100, lng: 84.2800, district: 'Jashpur' },
    { name: 'Pathalgaon', lat: 22.5600, lng: 84.4800, district: 'Jashpur' },
    { name: 'Bagicha', lat: 22.4600, lng: 84.1200, district: 'Jashpur' },
    { name: 'Jagdalpur', lat: 19.0814, lng: 82.0213, district: 'Bastar' },
    { name: 'Tokapal', lat: 19.0700, lng: 82.0700, district: 'Bastar' },
    { name: 'Lohandiguda', lat: 19.0000, lng: 82.0300, district: 'Bastar' },
    { name: 'Bastanar', lat: 19.1300, lng: 81.9800, district: 'Bastar' },
    { name: 'Kondagaon', lat: 19.5900, lng: 81.6600, district: 'Kondagaon' },
    { name: 'Keshkal', lat: 19.6000, lng: 81.5000, district: 'Kondagaon' },
    { name: 'Dantewada', lat: 18.9000, lng: 81.3500, district: 'Dantewada' },
    { name: 'Geedam', lat: 18.9700, lng: 81.4000, district: 'Dantewada' },
    { name: 'Bijapur', lat: 18.8300, lng: 80.8200, district: 'Bijapur' },
    { name: 'Bhopalpatnam', lat: 19.0700, lng: 80.3800, district: 'Bijapur' },
    { name: 'Narayanpur', lat: 19.7200, lng: 81.2400, district: 'Narayanpur' },
    { name: 'Gariaband', lat: 20.6300, lng: 82.0600, district: 'Gariaband' },
    { name: 'Chhura', lat: 20.8800, lng: 82.2500, district: 'Gariaband' },

    // NEW Locations
    { name: 'Dhamtari', lat: 20.7075, lng: 81.5482, district: 'Dhamtari' },
    { name: 'Kurud', lat: 20.8300, lng: 81.7200, district: 'Dhamtari' },
    { name: 'Magarlod', lat: 20.6800, lng: 81.8300, district: 'Dhamtari' },

    { name: 'Mahasamund', lat: 21.1074, lng: 82.0979, district: 'Mahasamund' },
    { name: 'Saraipali', lat: 21.3150, lng: 83.0000, district: 'Mahasamund' },
    { name: 'Basna', lat: 21.2800, lng: 82.8300, district: 'Mahasamund' },
    { name: 'Pithora', lat: 21.2500, lng: 82.9300, district: 'Mahasamund' },

    { name: 'Kanker', lat: 20.2719, lng: 81.4917, district: 'Kanker' },
    { name: 'Bhanupratappur', lat: 20.3500, lng: 81.1000, district: 'Kanker' },
    { name: 'Charama', lat: 20.4500, lng: 81.2500, district: 'Kanker' },
    { name: 'Durgkondal', lat: 20.1500, lng: 81.0000, district: 'Kanker' },
    { name: 'Antagarh', lat: 20.0900, lng: 81.1500, district: 'Kanker' },
    { name: 'Pakhanjur', lat: 20.0300, lng: 80.6200, district: 'Kanker' },

    { name: 'Sukma', lat: 18.3900, lng: 81.6500, district: 'Sukma' },
    { name: 'Konta', lat: 17.8100, lng: 81.3900, district: 'Sukma' },
    { name: 'Chhindgarh', lat: 18.5000, lng: 81.8300, district: 'Sukma' },

    
    { name: 'Baloda Bazar', lat: 21.6570, lng: 82.1600, district: 'Baloda Bazar' },
    { name: 'Bhatapara', lat: 21.7350, lng: 81.9500, district: 'Baloda Bazar' },
    { name: 'Simga', lat: 21.6300, lng: 81.7000, district: 'Baloda Bazar' },
    { name: 'Palari', lat: 21.5500, lng: 82.0500, district: 'Baloda Bazar' },

    { name: 'Surajpur', lat: 23.2200, lng: 82.8700, district: 'Surajpur' },
    { name: 'Pratappur', lat: 23.3500, lng: 82.7800, district: 'Surajpur' },
    { name: 'Ramanujnagar', lat: 23.1900, lng: 82.9800, district: 'Surajpur' },

    { name: 'Baikunthpur', lat: 23.2600, lng: 82.5600, district: 'Korea' },
    { name: 'Manendragarh', lat: 23.1200, lng: 82.2000, district: 'Korea' },
    { name: 'Khadgawan', lat: 23.0500, lng: 82.5000, district: 'Korea' },

    { name: 'Gaurela', lat: 22.7600, lng: 81.9000, district: 'Gaurela-Pendra-Marwahi' },
    { name: 'Pendra', lat: 22.7700, lng: 81.9600, district: 'Gaurela-Pendra-Marwahi' },
    { name: 'Marwahi', lat: 22.8000, lng: 82.0000, district: 'Gaurela-Pendra-Marwahi' }
  ];

  // Format raw data to match the training object structure
  const SPECIFIC_FAKE_LOCATIONS = rawSpecificLocations.map((pt, i) => ({
    id: `specific-fake-${i}`,
    isFake: true,
    trainer_name: `Demo Trainer ${pt.name}`,
    subject_name: 'Regional Training',
    trainer_profile_image: `https://i.pravatar.cc/150?u=${i}`,
    status: 'ongoing',
    location_details: {
      latitude: pt.lat,
      longitude: pt.lng,
      village: pt.name,
      block: pt.district,
      district: pt.district
    }
  }));

  // Merge Real and Specific Fake Data
  const allTrainingData = [...(trainingLocations || []), ...SPECIFIC_FAKE_LOCATIONS];

  // ===== FILTERING LOGIC =====
  const validTrainingLocations = allTrainingData.filter(
    t => {
      const lat = Number(t.location_details?.latitude);
      const lng = Number(t.location_details?.longitude);
      return !isNaN(lat) && !isNaN(lng) && isWithinCG(lat, lng);
    }
  );

  const validLocations = (locationsData || []).filter(loc => {
    const lat = Number(loc.latitude);
    const lng = Number(loc.longitude);
    return !isNaN(lat) && !isNaN(lng) && isWithinCG(lat, lng);
  });

  // Center logic - Fixed to use only filtered data
  let center = [21.2787, 81.8661]; // Default Center of CG
  let zoom = 7; // Default Zoom

  if (validTrainingLocations.length > 0 || validLocations.length > 0) {
    const allPoints = [
      ...validLocations,
      ...validTrainingLocations.map(t => t.location_details)
    ];

    const avgLat = allPoints.reduce((s, l) => s + Number(l.latitude), 0) / allPoints.length;
    const avgLng = allPoints.reduce((s, l) => s + Number(l.longitude), 0) / allPoints.length;
    center = [avgLat, avgLng];
    zoom = 8;
  }

  useEffect(() => {
    // fetch('http://127.0.0.1:4001/files/Map/topojsons/states/cg.json')
    //   .then(res => res.json())
    //   .then(setGeoJsonData)
    //   .catch(console.error);

    fetch('/files/Map/topojsons/states/cg.json')
    .then(res => {
      if (!res.ok) throw new Error('GeoJSON not found');
      return res.json();
    })
    .then(setGeoJsonData)
    .catch(err => console.error('GeoJSON load error:', err));
  }, []);

  // Icon definition - Using the detailed pin shape
  const createCustomIcon = (color = '#9647bb') =>
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
            background: ${color}; 
            border-radius: 50% 50% 50% 0;
            transform: translateX(-50%) rotate(-45deg);
            box-shadow: 0 4px 12px ${color}4D; 
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

  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
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
      {!isFullScreen && (
        <>
          <div style={{
            position: 'absolute', top: '0', left: '0', right: '0', height: '3px',
            background: 'linear-gradient(to right, #e2e8f0, #f1f5f9, #e2e8f0)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute', bottom: '0', left: '0', right: '0', height: '3px',
            background: 'linear-gradient(to right, #e2e8f0, #f1f5f9, #e2e8f0)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute', top: '0', left: '0', bottom: '0', width: '3px',
            background: 'linear-gradient(to bottom, #e2e8f0, #f1f5f9, #e2e8f0)', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px', zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute', top: '0', right: '0', bottom: '0', width: '3px',
            background: 'linear-gradient(to bottom, #e2e8f0, #f1f5f9, #e2e8f0)', borderTopRightRadius: '16px', borderBottomRightRadius: '16px', zIndex: 1
          }}></div>
          <div style={{ position: 'absolute', top: '8px', left: '8px', width: '16px', height: '16px', borderTop: '2px solid #e2e8f0', borderLeft: '2px solid #e2e8f0', borderTopLeftRadius: '8px', zIndex: 2 }}></div>
          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderTop: '2px solid #e2e8f0', borderRight: '2px solid #e2e8f0', borderTopRightRadius: '8px', zIndex: 2 }}></div>
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '16px', height: '16px', borderBottom: '2px solid #e2e8f0', borderLeft: '2px solid #e2e8f0', borderBottomLeftRadius: '8px', zIndex: 2 }}></div>
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '16px', height: '16px', borderBottom: '2px solid #e2e8f0', borderRight: '2px solid #e2e8f0', borderBottomRightRadius: '8px', zIndex: 2 }}></div>
        </>
      )}

      <div style={{
        position: 'absolute', top: '10px', left: '10px', zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
        padding: '12px 18px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto'
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: THEME.gradients.primary, border: '2px solid white', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)' }}></div>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', letterSpacing: '-0.01em' }}>
          Training Center Locations ({validTrainingLocations.length})
        </div>
      </div>

      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, pointerEvents: 'auto' }}>
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          style={{
            background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', width: '36px', height: '36px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'scale(1)'; }}
          title={isFullScreen ? "Exit Fullscreen" : "View Fullscreen"}
        >
          {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>

      <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%', borderRadius: isFullScreen ? 0 : '12px' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {geoJsonData && (
          <GeoJSON data={geoJsonData} style={{ color: THEME.primary, weight: 2, fillOpacity: 0.05 }} />
        )}

        <MapResizer trigger={isFullScreen} />

        {/* Plain Locations */}
        {validLocations.map((loc, i) => (
          <Marker key={`loc-${i}`} position={[loc.latitude, loc.longitude]} icon={createCustomIcon()}>
            <Popup><strong>{loc.village}</strong><br />{loc.block}, {loc.district}</Popup>
          </Marker>
        ))}

        {/* Training Markers */}
        {/* {validTrainingLocations.map((training, i) => {
          const loc = training.location_details;
          const markerColor = training.isFake ? '#2563EB' : '#9647bb';

          return (
            <Marker
              key={`training-${training.id}`}
              position={[loc.latitude, loc.longitude]}
              icon={createCustomIcon(markerColor)}
            >
              <Popup>
                <div style={{ minWidth: '240px' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <img
                      src={training.trainer_profile_image}
                      alt={training.trainer_name}
                      style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{training.trainer_name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {training.subject_name}
                        Marketplace Literacy
                      </div>
                      {training.isFake && (
                        <span style={{ fontSize: 10, background: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>DEMO</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: THEME.primary }}>{loc.village}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{loc.block}, {loc.district}</div>
                  <div style={{
                    marginTop: 8, fontSize: 12, fontWeight: 700,
                    color: training.status === 'completed' ? THEME.success : training.status === 'ongoing' ? THEME.warning : THEME.primary
                  }}>
                    Status: {training.status}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })} */}
      </MapContainer>
    </div>
  );
};


// ===== SUB COMPONENTS =====

const SummaryTab = ({ summary, viewData, locationsData, trainingLocations }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>

    {/* Top Stats Grid - Updated minmax for smaller cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: THEME.gap.md }}>
      <StatCard title="Total Trainings" value={summary?.total_trainings || 0} icon={BookOpen} gradient={THEME.gradients.kpiA} />
      <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={User} gradient={THEME.gradients.kpiB} />
      <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.kpiC} />
      <StatCard title="Total Locations" value={summary?.total_locations || 0} icon={House} gradient={THEME.gradients.kpiD} />
    </div>

    {/* FULL WIDTH MAP */}
    <div style={{ width: '100%', height: '600px' }}>
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

const StatCard = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div
      style={{
        // Base Container Styles
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '200px', // Smaller minimum width
        padding: '16px 18px', // Reduced padding for compactness
        borderRadius: '14px',
        position: 'relative',
        backgroundImage: `${gradient}`,
        // Removed the noisy SVG pattern for a cleaner look, kept subtle overlay
        backgroundSize: 'cover',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        // Elegant shadows with inner glow
        boxShadow: `
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
        transition: 'transform 220ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 220ms ease',
        cursor: 'default',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `
            0 10px 20px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `;
      }}
    >
      {/* Subtle Overlay for Glass Effect */}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
          pointerEvents: 'none'
        }}
      />

      {/* Left Side: Content (Title + Value) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
          zIndex: 1
        }}
      >
        {/* Title Typography - Clean, No Pill Background */}
        <div
          style={{
            fontSize: '0.7rem', // Smaller text
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.85)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          {title}
        </div>

        {/* Value Typography - Reduced Size */}
        <div
          style={{
            fontSize: '1.75rem', // Reduced from 34px
            fontWeight: '800',
            lineHeight: '1',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {value}
        </div>
      </div>

      {/* Right Side: Icon Container - Smaller & Cleaner */}
      <div
        style={{
          width: '42px', // Reduced from 54px
          height: '42px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1
        }}
      >
        <Icon
          size={20} // Reduced from 26px
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
