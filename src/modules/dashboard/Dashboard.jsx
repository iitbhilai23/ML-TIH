
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, Select, MenuItem } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from 'react-leaflet';
import { dashboardService } from '../../services/dashboardService';
import { locationService } from '../../services/locationService';
import { trainingService } from '../../services/trainingService';
import { Users, BookOpen, MapPin, Calendar, Filter, TrendingUp, Table, User, Map as MapIcon, Maximize, Minimize, House, X, ChevronLeft, ChevronRight } from 'lucide-react';
import cgGeoJson from '../../assets/cg.json';

const THEME = {
    gap: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px' },
    pad: { s: '2', sm: '12px', md: '16px', lg: '20px', xl: '28px' },
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
        cyan: 'linear-gradient(135deg, #0e7490 0%, #0f172a 120%)',
        kpiA: 'linear-gradient(135deg, #7b3f99 0%, #5a2b7a 100%)',
        kpiB: 'linear-gradient(135deg, #9b59b6 0%, #7b3f99 100%)',
        kpiC: 'linear-gradient(135deg, #6a0dad 0%, #4c1d95 100%)',
        kpiD: 'linear-gradient(135deg, #b06ad9 0%, #7b3f99 100%)'
    },
    input: {
        padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem',
        fontWeight: '500', color: '#1e293b', background: '#ffffff', outline: 'none', cursor: 'pointer',
        transition: 'all 0.2s ease', height: '40px', display: 'flex', alignItems: 'center'
    }
};

const MarketHeroSection = () => {
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

    // FIX 1: Added 'limit: 1000' and dependencies [filters] to load all data
    useEffect(() => {
        const fetchTrainingsForMap = async () => {
            try {
                // Construct params strictly to match Backend DTO and ensure limit is high
                const params = {
                    limit: 1000,
                    district_cd: filters.district_cd || undefined,
                    block_cd: filters.block_cd || undefined,
                    status: filters.status || undefined,
                    // Map frontend names to backend names
                    start_date_from: filters.start_date || undefined,
                    start_date_to: filters.end_date || undefined
                };

                // Clean out undefined values
                const cleanParams = Object.fromEntries(
                    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
                );

                const trainings = await trainingService.getAll(cleanParams);
                const trainingData = Array.isArray(trainings) ? trainings : trainings?.data || [];
                setTrainingLocations(trainingData);
            } catch (error) { console.error("Error fetching trainings for map:", error); }
        };
        fetchTrainingsForMap();
    }, [filters]); // Re-fetch whenever filters change to update map

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, ...(name === 'district_cd' ? { block_cd: '' } : {}) }));
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: THEME.bgGradient, color: THEME.primary, fontSize: '1rem', fontWeight: '600' }}>Loading Dashboard Data...</div>;
    if (error) return <div style={{ padding: THEME.pad.xl, color: THEME.danger, textAlign: 'center' }}>Error: {error}</div>;
    if (!data) return <div style={{ padding: THEME.pad.xl, color: '#64748b', textAlign: 'center' }}>No Data Available</div>;

    const { summary } = data;

    const selectSx = {
        minWidth: 150, height: '40px', background: '#fff', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500,
        '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e5e7eb', borderRadius: '8px' },
        '&:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #cbd5e1 !important' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: `1px solid ${THEME.primary} !important` },
        '& .MuiSelect-select': { padding: '10px 14px', display: 'flex', alignItems: 'center', color: '#1e293b' }
    };

    return (
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: THEME.gap.sm, minHeight: '100vh', background: THEME.bgGradient, overflowX: "hidden" }}>
            <Box sx={{ textAlign: 'center', mb: 2, opacity: 0, animation: 'fadeIn 0.8s ease-out forwards' }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <Typography variant="h2" component="h1" fontWeight="700" color="text.primary" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '2.5rem' } }}>
                    Marketplace Literacy <Box component="span" sx={{ background: "linear-gradient(90deg, #D4AF37 0%, #2E8B57 50%, #1976d2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Chhattisgarh</Box>
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 400 }}>
                    Empowering women through financial education and entrepreneurship skills
                </Typography>
            </Box>

            {/* ===== FILTERS ===== */}
            <Box sx={{ display: 'flex', justifyContent: 'center', px: 2 }}>
                <div style={{ ...THEME.glass, width: '100%', maxWidth: '1200px', justifyContent: 'center', padding: `${THEME.pad.sm} ${THEME.pad.md}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: THEME.gap.sm, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs, paddingRight: THEME.pad.sm, borderRight: '1px solid #f3f4f6', color: THEME.primary, fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                        <Filter size={16} /> Filters
                    </div>
                    <Select name="district_cd" value={filters.district_cd} onChange={handleFilterChange} displayEmpty size="small" sx={selectSx} MenuProps={{ PaperProps: { sx: { maxHeight: 300, mt: 0.5, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } } }}>
                        <MenuItem value="">All Districts</MenuItem>
                        {districts.map((d) => (<MenuItem key={d.district_cd} value={d.district_cd}>{d.district_name}</MenuItem>))}
                    </Select>
                    <Select name="block_cd" value={filters.block_cd} onChange={handleFilterChange} displayEmpty size="small" sx={selectSx} disabled={!filters.district_cd} MenuProps={{ PaperProps: { sx: { maxHeight: 300, mt: 0.5, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } } }}>
                        <MenuItem value="">All Blocks</MenuItem>
                        {blocks.map((b) => (<MenuItem key={b.block_cd} value={b.block_cd}>{b.block_name}</MenuItem>))}
                    </Select>
                    <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs }}>
                        <Calendar size={16} style={{ color: '#94a3b8' }} />
                        <input type="date" name="start_date" style={THEME.input} onChange={handleFilterChange} value={filters.start_date} />
                        <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', margin: `0 ${THEME.gap.xs}` }}>to</span>
                        <input type="date" name="end_date" style={THEME.input} onChange={handleFilterChange} value={filters.end_date} />
                    </div>
                    <Select name="status" value={filters.status} onChange={handleFilterChange} displayEmpty size="small" sx={selectSx} MenuProps={{ PaperProps: { sx: { maxHeight: 300, mt: 0.5, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } } }}>
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="ongoing">Ongoing</MenuItem>
                        <MenuItem value="scheduled">Scheduled</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </div>
            </Box>

            {activeTab === 'summary' && <SummaryTab summary={data} viewData={viewData} locationsData={locationsData} trainingLocations={trainingLocations} />}
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

// ===== TRAINING LOCATION MAP COMPONENT (FIXED FOR LIMIT & GROUPING) =====
const TraineeLocationMap = ({ trainingLocations }) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);

    const MIN_LAT = 17.5; const MAX_LAT = 24.0; const MIN_LNG = 79.5; const MAX_LNG = 85.0;
    const isWithinCG = (lat, lng) => lat >= MIN_LAT && lat <= MAX_LAT && lng >= MIN_LNG && lng <= MAX_LNG;

    const validTrainingLocations = (trainingLocations || []).filter(training => {
        const lat = Number(training?.location_details?.latitude);
        const lng = Number(training?.location_details?.longitude);
        return !isNaN(lat) && !isNaN(lng) && isWithinCG(lat, lng);
    });

    const totalTrainings = validTrainingLocations.length;

    useEffect(() => { setGeoJsonData(cgGeoJson); }, []);

    // FIX 2: UseMemo for grouping to prevent re-renders and ensure stability
    const groupedLocations = useMemo(() => {
        return validTrainingLocations.reduce((acc, training) => {
            const lat = Number(training.location_details?.latitude);
            const lng = Number(training.location_details?.longitude);
            const key = `${lat}-${lng}`;

            if (!acc[key]) {
                acc[key] = { lat, lng, trainings: [] };
            }

            acc[key].trainings.push(training);
            return acc;
        }, {});
    }, [validTrainingLocations]);

    const createCustomIcon = (count, color = '#7b3f99') =>
        L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div style="
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: ${color};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    border: 3px solid white;
                ">
                    ${count}
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return '#059669'; case 'ongoing': return '#d97706'; case 'scheduled': return '#4f46e5'; case 'cancelled': return '#dc2626'; default: return '#9647bb';
        }
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'completed': return { background: '#d1fae5', color: '#065f46' };
            case 'ongoing': return { background: '#fef3c7', color: '#92400e' };
            case 'scheduled': return { background: '#e0e7ff', color: '#3730a3' };
            case 'cancelled': return { background: '#fee2e2', color: '#991b1b' };
            default: return { background: '#f1f5f9', color: '#475569' };
        }
    };

    const containerStyle = {
        height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease-in-out', position: 'relative',
        background: 'linear-gradient(to bottom right, #f8fafc, #ffffff)', borderRadius: isFullScreen ? '0' : '16px',
        border: isFullScreen ? 'none' : '1px solid rgba(226, 232, 240, 0.8)', boxShadow: isFullScreen ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.05)',
        padding: isFullScreen ? 0 : THEME.pad.lg, overflow: 'hidden', boxSizing: 'border-box',
        ...(isFullScreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, margin: 0 } : {})
    };

    return (
        <div style={containerStyle}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>

            {!isFullScreen && (
                <>
                    <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '3px', background: 'linear-gradient(to right, #e2e8f0, #f1f5f9, #e2e8f0)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', zIndex: 1 }}></div>
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '3px', background: 'linear-gradient(to right, #e2e8f0, #f1f5f9, #e2e8f0)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 1 }}></div>
                </>
            )}

            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', padding: '10px 16px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#9647bb', border: '2px solid white' }}></div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Total Trainings ({totalTrainings})</div>
            </div>

            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, pointerEvents: 'auto' }}>
                <button onClick={() => setIsFullScreen(!isFullScreen)} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px' }}>
                    {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
            </div>

            <MapContainer style={{ width: '100%', height: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <MapBoundsAdjuster geoJsonData={geoJsonData} trigger={isFullScreen} />
                <MapResizer trigger={isFullScreen} />
                {geoJsonData && <GeoJSON data={geoJsonData} style={{ color: THEME.primary, weight: 2, fillOpacity: 0.05 }} />}

                {Object.values(groupedLocations).map((location, i) => {
                    const trainings = location.trainings;
                    const count = trainings.length;
                    // Use first training status color (optional)
                    const statusColor = getStatusColor(trainings[0]?.status);

                    return (
                        <Marker
                            key={`group-${i}`}
                            position={[location.lat, location.lng]}
                            icon={createCustomIcon(count, statusColor)}
                            eventHandlers={{
                                click: () => {
                                    setSelectedTraining(trainings); // pass array
                                }
                            }}
                        />
                    );
                })}
            </MapContainer>

            {/* MODAL OVERLAY - Centered List Card */}
            {Array.isArray(selectedTraining) && selectedTraining.length > 0 && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        zIndex: 10000, animation: 'fadeIn 0.3s ease-out'
                    }}
                    onClick={() => setSelectedTraining(null)}
                >
                    <div
                        style={{
                            background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '420px', maxHeight: '80vh', overflowY: 'auto',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.25)', position: 'relative',
                            animation: 'scaleIn 0.3s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedTraining(null)}
                            style={{
                                position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)',
                                border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
                                zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <X size={18} color="#334155" />
                        </button>

                        <div style={{ padding: '24px' }}>
                            {/* Header */}
                            <h3 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '1.2rem', fontWeight: '700' }}>
                                Trainings at This Location ({selectedTraining.length})
                            </h3>

                            {/* Common Location Info */}
                            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>Location</div>
                                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                                    <MapPin size={16} color="#9647bb" style={{ marginTop: '2px' }} />
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>
                                            {selectedTraining[0]?.location_details?.village || 'N/A'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {[selectedTraining[0]?.location_details?.block, selectedTraining[0]?.location_details?.district].filter(Boolean).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* List All Trainings */}
                            {selectedTraining.map((training, index) => (
                                <div key={training.id || index} style={{ padding: '14px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e5e7eb', marginBottom: '12px' }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                                        {training.subject_name || 'N/A'}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                                        Trainer: {training.trainer_name || 'Unknown'}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ ...getStatusStyle(training.status), padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                            {training.status}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569' }}>
                                            <Users size={14} />
                                            {training.total_participants || 0}
                                        </div>
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
        if (!map || !geoJsonData) return; if (!map._container) return;
        const layer = L.geoJSON(geoJsonData); const bounds = layer.getBounds(); if (!bounds.isValid()) return;
        const timeout = setTimeout(() => { if (map._container) { map.invalidateSize(); map.fitBounds(bounds, { paddingTopLeft: [20, 40], paddingBottomRight: [160, 40], maxZoom: 8 }); } }, 400);
        return () => clearTimeout(timeout);
    }, [geoJsonData, trigger, map]);
    return null;
};

const SummaryTab = ({ summary, viewData, locationsData, trainingLocations }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.md }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: THEME.gap.md }}>
            <StatCard title="Total Trainings" value={summary?.total_trainings || 0} icon={BookOpen} gradient={THEME.gradients.kpiA} />
            <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={User} gradient={THEME.gradients.kpiB} />
            <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.kpiC} />
            <StatCard title="Total Locations" value={summary?.total_locations || 0} icon={House} gradient={THEME.gradients.kpiD} />
        </div>
        <div style={{ width: '100%', height: '460px' }}>
            <TraineeLocationMap trainingLocations={trainingLocations} />
        </div>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" size="large" href="https://www.ibitf.co.in/ml/login" sx={{ borderRadius: 50, px: 4, background: "linear-gradient(90deg, #D4AF37 0%, #2E8B57 100%)", textTransform: "none", fontSize: "1rem", fontWeight: 600, boxShadow: "0 4px 12px rgba(46, 139, 87, 0.3)", "&:hover": { background: "linear-gradient(90deg, #C59237 0%, #257849 100%)", transform: "translateY(-2px)", boxShadow: "0 6px 16px rgba(46, 139, 87, 0.4)" }, transition: "all 0.3s ease" }}>
                Explore More
            </Button>
        </Box>
    </div>
);

const DetailedTab = ({ viewData }) => (
    <div style={{ ...THEME.glass, padding: THEME.pad.xl, minHeight: '500px' }}>
        <div style={{ marginBottom: THEME.pad.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}><Table size={24} color={THEME.primary} /> Training Directory</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Overview of all training sessions</p>
            </div>
            <div style={{ background: THEME.gradients.primary, padding: `6px ${THEME.pad.md}`, borderRadius: '8px', color: 'white', fontWeight: '700', fontSize: '0.85rem' }}>Total Records: {viewData?.data?.length || 0}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
            {viewData && viewData.data && viewData.data.length > 0 ? (
                viewData.data.map((row, i) => (
                    <div key={row.training_id || row.id || i} style={{ display: 'grid', gridTemplateColumns: '80px 2.5fr 1.5fr 100px 120px 160px', gap: THEME.gap.md, alignItems: 'center', padding: `${THEME.pad.md} ${THEME.pad.lg}`, background: '#ffffff', borderRadius: '12px', border: '1px solid #f3f4f6', transition: 'all 0.15s ease-in-out', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div><span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: THEME.primary, fontWeight: '700', background: '#eff6ff', padding: `4px ${THEME.pad.sm}`, borderRadius: '6px', display: 'inline-block' }}>#{row.training_id || row.id}</span></div>
                        <div><div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '2px', fontSize: '0.95rem' }}>{row.subject_name}</div><div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: THEME.gap.xs, fontWeight: '500' }}><User size={13} /> {row.trainer_name}</div></div>
                        <div><div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>{row.village || row.location_details?.village || '-'}</div><div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', fontWeight: '500' }}>{row.district || row.location_details?.district}</div></div>
                        <div><div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}><div style={{ width: '40px', height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${(row.total_participants / row.max_participants) * 100}%`, height: '100%', background: THEME.success, borderRadius: '2px' }}></div></div><span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{row.total_participants}</span></div></div>
                        <div><span style={{ padding: `4px ${THEME.pad.sm}`, borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block', ...(row.status === 'completed' ? { background: '#d1fae5', color: '#065f46' } : row.status === 'ongoing' ? { background: '#fef3c7', color: '#92400e' } : row.status === 'scheduled' ? { background: '#e0e7ff', color: '#3730a3' } : { background: '#fee2e2', color: '#991b1b' }) }}>{row.status}</span></div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{row.start_date ? new Date(row.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</div>
                    </div>
                ))
            ) : (<div style={{ padding: THEME.pad.xl, textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px dashed #f3f4f6', color: '#94a3b8', fontSize: '0.95rem' }}>No Training Data Available</div>)}
        </div>
    </div>
);

const StatCard = ({ title, value, icon: Icon, gradient }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '200px', padding: '16px 18px', borderRadius: '14px', position: 'relative', backgroundImage: `${gradient}`, backgroundSize: 'cover', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`, transition: 'transform 220ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 220ms ease', cursor: 'default', overflow: 'hidden', userSelect: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`; }}>
            <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, zIndex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{title}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.02em', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>{value}</div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.1)', zIndex: 1 }}><Icon size={20} color="#ffffff" strokeWidth={2.5} /></div>
        </div>
    );
};

export default MarketHeroSection;
