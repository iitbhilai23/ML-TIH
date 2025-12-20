
import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import styles from './Dashboard.module.css';
import { Users, BookOpen, MapPin, Calendar, Filter, Eye, TrendingUp, Map, Table, BarChart2, PieChart, LineChart, Dot, ChevronDown } from 'lucide-react';
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

  const { summary, training_stats, participant_stats } = data;

  // Generate colors for charts
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#fbbf24'];

  // Format data for charts
  const trainingStatusData = [
    { name: 'Scheduled', value: training_stats.by_status.scheduled },
    { name: 'Ongoing', value: training_stats.by_status.ongoing },
    { name: 'Completed', value: training_stats.by_status.completed },
    { name: 'Cancelled', value: training_stats.by_status.cancelled }
  ];

  const participantCategoryData = participant_stats.by_category.map(item => ({
    name: item.category,
    value: item.count
  }));

  const participantEducationData = participant_stats.by_education.map(item => ({
    name: item.education,
    value: item.count
  }));

  const locationData = training_stats.by_location.map(item => ({
    name: item.district,
    value: item.count
  }));

  return (
    <div className={styles.dashboardGrid}>
      
      {/* ===== TAB NAVIGATION ===== */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'summary' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <TrendingUp size={16} className="mr-2" /> Summary
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'detailed' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('detailed')}
        >
          <Table size={16} className="mr-2" /> Detailed View
        </button>
        <button 
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
        </button>
      </div>

      {/* ===== FILTERS ===== */}
      <div className={styles.filterBar}>
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <span className="font-bold">Filters:</span>
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

        <input 
          type="date" 
          name="start_date" 
          className={styles.selectInput} 
          onChange={handleFilterChange} 
          value={filters.start_date}
          placeholder="Start Date"
        />

        <input 
          type="date" 
          name="end_date" 
          className={styles.selectInput} 
          onChange={handleFilterChange} 
          value={filters.end_date}
          placeholder="End Date"
        />

        <select name="status" className={styles.selectInput} onChange={handleFilterChange} value={filters.status}>
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ===== CONTENT BASED ON ACTIVE TAB ===== */}
      {activeTab === 'summary' && <SummaryTab summary={summary} training_stats={training_stats} participant_stats={participant_stats} />}
      {activeTab === 'detailed' && <DetailedTab viewData={viewData} filters={filters} />}
      {activeTab === 'analytics' && <AnalyticsTab data={data} filters={filters} COLORS={COLORS} trainingStatusData={trainingStatusData} participantCategoryData={participantCategoryData} participantEducationData={participantEducationData} locationData={locationData} />}
      {activeTab === 'map' && <MapTab viewData={viewData} />}
    </div>
  );
};

// Cards and Basic Stats =====
const SummaryTab = ({ summary, training_stats, participant_stats }) => (
  <div className="space-y-6">

    <div className={styles.statsRow}>
      <StatCard 
        title="Total Trainers" 
        value={summary.total_trainers} 
        icon={Users} 
        color="#4f46e5" 
        change="+5% from last month"
      />
      <StatCard 
        title="Total Participants" 
        value={summary.total_participants} 
        icon={Users} 
        color="#10b981" 
        change="+12% from last month"
      />
      <StatCard 
        title="Active Trainings" 
        value={summary.active_trainings} 
        icon={BookOpen} 
        color="#f59e0b" 
        change="+3 from last month"
      />
      <StatCard 
        title="Locations Covered" 
        value={summary.total_locations} 
        icon={MapPin} 
        color="#ec4899" 
        change="+2 from last month"
      />
    </div>

    {/*  DETAILED STATS  */}
    <div className={styles.detailsGrid}>
      <TrainingStatusCard training_stats={training_stats} summary={summary} />
      <ParticipantDemographicsCard participant_stats={participant_stats} summary={summary} />
      <AttendanceOverviewCard participant_stats={participant_stats} />
    </div>
  </div>
);

// DETAILED TAB: Table View
const DetailedTab = ({ viewData, filters }) => (
  <div className={styles.detailedView}>
    <h3 className={styles.cardTitle}>Training Data Table</h3>
    <div className={styles.tableView}>
      {viewData && viewData.data && viewData.data.length > 0 ? (
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Training ID</th>
              <th>Trainer</th>
              <th>Subject</th>
              <th>Location</th>
              <th>District</th>
              <th>Block</th>
              <th>Participants</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {viewData.data.map((row, index) => (
              <tr key={row.training_id || index}>
                <td>{row.training_id}</td>
                <td>{row.trainer_name}</td>
                <td>{row.subject_name}</td>
                <td>{row.village || 'N/A'}, {row.block || 'N/A'}</td>
                <td>{row.district}</td>
                <td>{row.block}</td>
                <td>{row.total_participants}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    row.status === 'completed' ? 'bg-green-100 text-green-800' :
                    row.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                    row.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td>{new Date(row.start_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center p-10 text-gray-500">No data available for current filters</div>
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
              {data.participant_stats.attendance_stats.present}
            </div>
            <div className="text-sm text-gray-600">Present</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Absent: {data.participant_stats.attendance_stats.absent}</span>
                <span className="w-20 bg-red-200 h-2 rounded"></span>
              </div>
              <div className="flex justify-between">
                <span>Late: {data.participant_stats.attendance_stats.late}</span>
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
  <div className={styles.statCard} style={{ borderLeft: `4px solid ${color}` }}>
    <div>
      <div className={styles.statValue} style={{ color }}>{value}</div>
      <div className={styles.statTitle}>{title}</div>
      {change && <div className="text-xs text-green-600 mt-1">{change}</div>}
    </div>
    <Icon size={24} color={color} opacity={0.2} />
  </div>
);

const TrainingStatusCard = ({ training_stats, summary }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>Training Status</h3>
    <div className={styles.statusList}>
      <StatusRow label="Scheduled" value={training_stats.by_status.scheduled} color="#6366f1" total={summary.total_trainings} />
      <StatusRow label="Ongoing" value={training_stats.by_status.ongoing} color="#f59e0b" total={summary.total_trainings} />
      <StatusRow label="Completed" value={training_stats.by_status.completed} color="#10b981" total={summary.total_trainings} />
      <StatusRow label="Cancelled" value={training_stats.by_status.cancelled} color="#ef4444" total={summary.total_trainings} />
    </div>
  </div>
);

const ParticipantDemographicsCard = ({ participant_stats, summary }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>Participant Demographics</h3>
    
    <div className="mb-4">
      <h4 className="text-xs text-gray-500 mb-2 uppercase">By Category</h4>
      {participant_stats.by_category.slice(0, 3).map((item, idx) => (
         <ProgressBar key={idx} label={item.category} value={item.count} total={summary.total_participants} color="#8b5cf6" />
      ))}
    </div>

    <div>
      <h4 className="text-xs text-gray-500 mb-2 uppercase">By Education</h4>
      {participant_stats.by_education.slice(0, 3).map((item, idx) => (
         <ProgressBar key={idx} label={item.education} value={item.count} total={summary.total_participants} color="#ec4899" />
      ))}
    </div>
  </div>
);

const AttendanceOverviewCard = ({ participant_stats }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>Attendance Overview</h3>
    <div className="flex justify-center items-center h-full flex-col gap-4">
      <div className={styles.bigStat}>
         <span style={{color: '#166534'}}>{participant_stats.attendance_stats.present}</span>
         <small>Present</small>
      </div>
      <div className="flex gap-4">
        <div className="text-center">
          <div className="font-bold text-red-600">{participant_stats.attendance_stats.absent}</div>
          <div className="text-xs text-gray-500">Absent</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-orange-500">{participant_stats.attendance_stats.late}</div>
          <div className="text-xs text-gray-500">Late</div>
        </div>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, value, total, color }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-bold">{value} ({percent}%)</span>
      </div>
      <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, background: color, height: '100%' }}></div>
      </div>
    </div>
  );
};

const StatusRow = ({ label, value, color, total }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }}></div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm">{value}</div>
        <div className="text-xs text-gray-400">{percent}%</div>
      </div>
    </div>
  );
};

export default Dashboard;