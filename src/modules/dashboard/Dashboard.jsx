
import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import styles from './Dashboard.module.css';
import { Users, BookOpen, MapPin, Calendar, Filter, Eye, TrendingUp, Map, Table, BarChart2, PieChart, LineChart, Dot, ChevronDown, BarChart3, UserCheck, User } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [viewData, setViewData] = useState(null);
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

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-20">Loading Dashboard Data...</div>;
  if (error) return <div className="p-20 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-20">No Data Available</div>;

  const { summary, participant_stats } = data;

  // Generate colors for charts
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#fbbf24'];

  // Format data for charts
  const trainingStatusData = [
    { name: 'Scheduled', value: viewData?.by_status?.scheduled },
    { name: 'Ongoing', value: viewData?.by_status?.ongoing },
    { name: 'Completed', value: viewData?.by_status?.completed },
    { name: 'Cancelled', value: viewData?.by_status?.cancelled }
  ];

  const participantCategoryData = participant_stats?.by_category?.map(item => ({
    name: item.category,
    value: item.count
  }));

  const participantEducationData = participant_stats?.by_education?.map(item => ({
    name: item.education,
    value: item.count
  }));

  const locationData = viewData?.by_location?.map(item => ({
    name: item.district,
    value: item.count
  }));

  return (
    <div className={styles.dashboardGrid}>

      {/* ===== TAB NAVIGATION ===== */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '6px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(106, 13, 173, 0.08)',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveTab('summary')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'summary'
              ? 'linear-gradient(135deg, #7B3F99 0%, #9B59B6 100%)'
              : 'transparent',
            color: activeTab === 'summary' ? 'white' : '#64748b',
            boxShadow: activeTab === 'summary'
              ? '0 4px 12px rgba(106, 13, 173, 0.3)'
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'summary') {
              e.currentTarget.style.background = '#f5f0ff';
              e.currentTarget.style.color = '#7B3F99';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'summary') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }
          }}
        >
          <TrendingUp size={18} /> Summary
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'detailed'
              ? 'linear-gradient(135deg, #7B3F99 0%, #9B59B6 100%)'
              : 'transparent',
            color: activeTab === 'detailed' ? 'white' : '#64748b',
            boxShadow: activeTab === 'detailed'
              ? '0 4px 12px rgba(106, 13, 173, 0.3)'
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'detailed') {
              e.currentTarget.style.background = '#f5f0ff';
              e.currentTarget.style.color = '#7B3F99';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'detailed') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }
          }}
        >
          <Table size={18} /> Detailed View
        </button>
        {/* <button
          className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <Eye size={16} className="mr-2" /> Analytics
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'map' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <Map size={16} className="mr-2" /> Map View
        </button> */}
      </div>

      {/* ===== FILTERS ===== */}
      <div className={styles.filterBar}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingRight: '16px',
          borderRight: '2px solid #e2e8f0',
          minWidth: '100px'
        }}>
          <Filter size={18} style={{ color: '#7B3F99' }} />
          <span style={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#1e293b',
            letterSpacing: '0.5px'
          }}>FILTERS</span>
        </div>

        <select name="district" className={styles.selectInput} onChange={handleFilterChange} value={filters.district}>
          <option value="">All Districts</option>
          <option value="Khairagarh">Khairagarh</option>
          <option value="Raipur">Raipur</option>
          <option value="Bilaspur">Bilaspur</option>
          <option value="Durg">Durg</option>
        </select>

        <select name="block" className={styles.selectInput} onChange={handleFilterChange} value={filters.block}>
          <option value="">All Blocks</option>
          <option value="Khairagarh">Khairagarh</option>
          <option value="Dhamtari">Dhamtari</option>
          <option value="Bilaspur">Bilaspur Block</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} style={{ color: '#64748b' }} />
          <input
            type="date"
            name="start_date"
            className={styles.selectInput}
            onChange={handleFilterChange}
            value={filters.start_date}
          />
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>to</span>
          <input
            type="date"
            name="end_date"
            className={styles.selectInput}
            onChange={handleFilterChange}
            value={filters.end_date}
          />
        </div>

        <select name="status" className={styles.selectInput} onChange={handleFilterChange} value={filters.status}>
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ===== CONTENT BASED ON ACTIVE TAB ===== */}
      {activeTab === 'summary' && <SummaryTab summary={data} viewData={viewData} participant_stats={participant_stats} />}
      {activeTab === 'detailed' && <DetailedTab viewData={viewData} filters={filters} />}
      {/* {activeTab === 'analytics' && <AnalyticsTab data={data} filters={filters} COLORS={COLORS} trainingStatusData={trainingStatusData} participantCategoryData={participantCategoryData} participantEducationData={participantEducationData} locationData={locationData} />}
      {activeTab === 'map' && <MapTab viewData={viewData} />} */}
    </div>
  );
};

// Cards and Basic Stats =====
const SummaryTab = ({ summary, viewData, participant_stats }) => (
  <div className="space-y-6">

    <div className={styles.statsRow}>
      <StatCard
        title="Total Trainers"
        value={summary?.total_trainers}
        icon={Users}
        color="#4f46e5"

      />
      <StatCard
        title="Total Participants"
        value={summary?.total_participants}
        icon={Users}
        color="#10b981"

      />
      <StatCard
        title="Active Trainings"
        value={summary?.active_trainings}
        icon={BookOpen}
        color="#f59e0b"

      />
      <StatCard
        title="Locations Covered"
        value={summary?.total_locations}
        icon={MapPin}
        color="#ec4899"

      />
    </div>

    {/*  DETAILED STATS  */}
    <div className={styles.detailsGrid}>
      <TrainingStatusCard viewData={viewData} summary={summary} />
      <ParticipantDemographicsCard participant_stats={participant_stats} summary={summary} />
      <AttendanceOverviewCard participant_stats={participant_stats} />
    </div>
  </div>
);

// DETAILED TAB: Table View
const DetailedTab = ({ viewData, filters }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    {/* Header Section */}
    <div style={{
      background: 'white',
      padding: '20px 24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#1e293b',
          margin: 0,
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Table size={24} style={{ color: '#6366f1' }} />
          Training Data Directory
        </h3>
        <p style={{
          fontSize: '0.9rem',
          color: '#64748b',
          margin: 0
        }}>
          Complete list of all training sessions and participants
        </p>
      </div>
      <div style={{
        background: 'linear-gradient(135deg, #7B3F99 0%, #9B59B6 100%)',
        padding: '12px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.9)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '2px'
        }}>
          Total Records
        </div>
        <div style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1
        }}>
          {viewData?.data?.length || 0}
        </div>
      </div>
    </div>

    {/* Table Section */}
    <div className={styles.tableView}>
      {viewData && viewData.data && viewData.data.length > 0 ? (
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  ID
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} />
                  Trainer & Subject
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} />
                  Location
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} />
                  Participants
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} />
                  Status
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  Start Date
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {viewData.data.map((row, index) => (
              <tr key={row.training_id || index}>
                <td>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#6366f1',
                    fontWeight: 600,
                    background: '#eef2ff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    #{row.training_id}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    {row.subject_name}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <User size={12} />
                    {row.trainer_name}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
                    {row.village || '-'}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginTop: '2px'
                  }}>
                    {row.district}, {row.block}
                  </div>
                </td>
                <td>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '6px',
                      background: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(row.total_participants / row.max_participants) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '3px'
                      }}></div>
                    </div>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}>
                      {row.total_participants}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    ...(row.status === 'completed' ? {
                      background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                      color: '#166534',
                      border: '1px solid #86efac'
                    } : row.status === 'ongoing' ? {
                      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                      color: '#92400e',
                      border: '1px solid #fcd34d'
                    } : row.status === 'scheduled' ? {
                      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                      color: '#1e40af',
                      border: '1px solid #93c5fd'
                    } : {
                      background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                      color: '#475569',
                      border: '1px solid #cbd5e1'
                    })
                  }}>
                    {row.status}
                  </span>
                </td>
                <td style={{
                  fontSize: '0.9rem',
                  color: '#475569',
                  fontWeight: 500
                }}>
                  {new Date(row.start_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: '#94a3b8'
        }}>
          <Table size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#64748b',
            marginBottom: '8px'
          }}>
            No Training Data Available
          </div>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            No data matches your current filter criteria
          </div>
        </div>
      )}
    </div>
  </div>
);

//  ANALYTICS TAB: Charts and Graphs 
const AnalyticsTab = ({ data, filters, COLORS, trainingStatusData, participantCategoryData, participantEducationData, locationData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Training Status Pie Chart */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Training Status Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={trainingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trainingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Participant Category Bar Chart */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Participant Categories</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participantCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Education Level Bar Chart */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Education Levels</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participantEducationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location-wise Training Analysis */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>District-wise Training Analysis</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Attendance Overview */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Attendance Overview</h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {data.participant_stats?.attendance_stats.present}
            </div>
            <div className="text-sm text-gray-600">Present</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Absent: {data.participant_stats?.attendance_stats.absent}</span>
                <span className="w-20 bg-red-200 h-2 rounded"></span>
              </div>
              <div className="flex justify-between">
                <span>Late: {data.participant_stats?.attendance_stats.late}</span>
                <span className="w-20 bg-yellow-200 h-2 rounded"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trainer Performance */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Top Trainers</h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">John Doe</div>
            <div className="text-sm text-gray-600">5 trainings, 150 participants</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Rating: ★★★★☆</span>
                <span className="w-20 bg-yellow-200 h-2 rounded"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Most Popular Subjects</h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">Digital Literacy</div>
            <div className="text-sm text-gray-600">25 trainings, 500 participants</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Completion Rate: 85%</span>
                <span className="w-20 bg-green-200 h-2 rounded"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ===== MAP TAB: Map View =====
const MapTab = ({ viewData }) => (
  <div className={styles.mapView}>
    <h3 className={styles.cardTitle}>Training Locations Map</h3>
    <div className={styles.mapPlaceholder}>
      <Map size={48} className="text-gray-400" />
      <p>Interactive Map View (Coming Soon)</p>
      <div className="text-sm text-gray-500 mt-2">
        {viewData && viewData.data ?
          `${viewData.data.filter(row => row.latitude && row.longitude).length} locations with coordinates` :
          '0 locations available'
        }
      </div>
    </div>
  </div>
);

//  HELPER COMPONENTS 
const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div style={{
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    cursor: 'pointer'
  }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(106, 13, 173, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '150px',
      height: '150px',
      background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      borderRadius: '50%',
      transform: 'translate(30%, -30%)',
      pointerEvents: 'none'
    }}></div>
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px'
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color,
          lineHeight: 1,
          marginBottom: '8px'
        }}>
          {value}
        </div>
        {change && (
          <div style={{
            fontSize: '0.75rem',
            color: '#10b981',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ↗ {change}
          </div>
        )}
      </div>
      <div style={{
        width: '64px',
        height: '64px',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${color}30`,
        boxShadow: `0 4px 12px ${color}15`,
        transition: 'transform 0.3s ease'
      }}>
        <Icon size={32} color={color} strokeWidth={2} />
      </div>
    </div>
  </div>
);

const TrainingStatusCard = ({ viewData, summary }) => (
  <div style={{
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
    overflow: 'hidden'
  }}>
    <h3 className={styles.cardTitle}>
      <BarChart3 size={20} style={{ color: '#6366f1' }} />
      Training Status
    </h3>
    <div className={styles.statusList}>
      <StatusRow label="Scheduled" value={viewData?.by_status?.scheduled} color="#6366f1" total={summary?.total_trainings} />
      <StatusRow label="Ongoing" value={viewData?.by_status?.ongoing} color="#f59e0b" total={summary?.total_trainings} />
      <StatusRow label="Completed" value={viewData?.by_status?.completed} color="#10b981" total={summary?.total_trainings} />
      <StatusRow label="Cancelled" value={viewData?.by_status?.cancelled} color="#ef4444" total={summary?.total_trainings} />
    </div>
  </div>
);

const ParticipantDemographicsCard = ({ participant_stats, summary }) => (
  <div style={{
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
    overflow: 'hidden'
  }}>
    <h3 className={styles.cardTitle}>
      <Users size={20} style={{ color: '#8b5cf6' }} />
      Demographics
    </h3>

    <div style={{ marginBottom: '24px' }}>
      <div className={styles.sectionHeader} style={{ color: '#8b5cf6' }}>By Category</div>
      {participant_stats?.by_category?.slice(0, 3).map((item, idx) => (
        <ProgressBar key={idx} label={item.category} value={item.count} total={summary?.total_participants} color="#8b5cf6" />
      ))}
    </div>

    <div>
      <div className={styles.sectionHeader} style={{ color: '#ec4899' }}>By Education</div>
      {participant_stats?.by_education?.slice(0, 3).map((item, idx) => (
        <ProgressBar key={idx} label={item.education} value={item.count} total={summary?.total_participants} color="#ec4899" />
      ))}
    </div>
  </div>
);

const AttendanceOverviewCard = ({ participant_stats }) => {
  const totalAttendance = participant_stats?.attendance_stats.present +
    participant_stats?.attendance_stats.absent +
    participant_stats?.attendance_stats.late;

  const presentPercent = totalAttendance > 0 ? Math.round((participant_stats?.attendance_stats.present / totalAttendance) * 100) : 0;
  const absentPercent = totalAttendance > 0 ? Math.round((participant_stats?.attendance_stats.absent / totalAttendance) * 100) : 0;
  const latePercent = totalAttendance > 0 ? Math.round((participant_stats?.attendance_stats.late / totalAttendance) * 100) : 0;

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    }}>
      <h3 className={styles.cardTitle}>
        <UserCheck size={20} style={{ color: '#10b981' }} />
        Attendance Overview
      </h3>

      {/* Main Present Count with Circular Progress */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '24px',
        marginTop: '12px'
      }}>
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          {/* Background Circle */}
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {/* Progress Circle */}
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - presentPercent / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          {/* Center Text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#10b981',
              lineHeight: 1
            }}>
              {presentPercent}%
            </div>
            <div style={{
              fontSize: '0.5rem',
              color: '#64748b',
              fontWeight: 600,
              marginTop: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Present
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#94a3b8',
              fontWeight: 500,
              marginTop: '2px'
            }}>
              {participant_stats?.attendance_stats.present}/{totalAttendance}
            </div>
          </div>
        </div>
      </div>

      {/* Absent and Late Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginTop: 'auto'
      }}>
        {/* Absent */}
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          border: '2px solid #fecaca',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px'
          }}>
            <UserCheck size={20} style={{ color: '#dc2626' }} strokeWidth={2.5} />
          </div>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#dc2626',
            marginBottom: '4px'
          }}>
            {participant_stats?.attendance_stats.absent}
          </div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#991b1b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px'
          }}>
            Absent
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#b91c1c',
            background: 'white',
            borderRadius: '8px',
            padding: '4px 8px',
            display: 'inline-block'
          }}>
            {absentPercent}%
          </div>
        </div>

        {/* Late */}
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #fde68a',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(245, 158, 11, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px'
          }}>
            <Calendar size={20} style={{ color: '#f59e0b' }} strokeWidth={2.5} />
          </div>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#f59e0b',
            marginBottom: '4px'
          }}>
            {participant_stats?.attendance_stats.late}
          </div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#92400e',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px'
          }}>
            Late
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#d97706',
            background: 'white',
            borderRadius: '8px',
            padding: '4px 8px',
            display: 'inline-block'
          }}>
            {latePercent}%
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value, total, color }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressLabel}>
        <span style={{ color: '#475569', fontWeight: 600 }}>{label}</span>
        <span style={{ color: '#1e293b', fontWeight: 700 }}>{percent}%</span>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${percent}%`, background: color }}></div>
      </div>
    </div>
  );
};

const StatusRow = ({ label, value, color, total }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className={styles.statusRow}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className={styles.statusDot} style={{ background: color, color: color }}></div>
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>{label}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{percent}%</div>
      </div>
    </div>
  );
};

export default Dashboard;