
// // // import React, { useState, useEffect } from 'react';
// // // import { dashboardService } from '../../services/dashboardService';
// // // import styles from './Dashboard.module.css';
// // // import { Users, BookOpen, MapPin, Calendar, Filter, Eye, TrendingUp, Map, Table, BarChart2, PieChart, LineChart, Dot, ChevronDown, BarChart3, UserCheck, User } from 'lucide-react';
// // // import {
// // //   BarChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // //   Legend,
// // //   PieChart as RechartsPieChart,
// // //   Pie,
// // //   Cell,
// // //   LineChart as RechartsLineChart,
// // //   Line,
// // //   ResponsiveContainer
// // // } from 'recharts';

// // // const Dashboard = () => {
// // //   const [data, setData] = useState(null);
// // //   const [viewData, setViewData] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [activeTab, setActiveTab] = useState('summary');
// // //   const [filters, setFilters] = useState({
// // //     district: '',
// // //     block: '',
// // //     village: '',
// // //     start_date: '',
// // //     end_date: '',
// // //     subject: '',
// // //     status: ''
// // //   });

// // //   useEffect(() => {
// // //     fetchData();
// // //   }, [filters]);

// // //   const fetchData = async () => {
// // //     setLoading(true);
// // //     setError(null);

// // //     try {
// // //       const [summaryData, viewDataResult] = await Promise.all([
// // //         dashboardService.getDashboardData(filters),
// // //         dashboardService.getDashboardViewData(filters)
// // //       ]);

// // //       setData(summaryData);
// // //       setViewData(viewDataResult);
// // //     } catch (error) {
// // //       console.error("Dashboard Fetch Error:", error);
// // //       setError(error.message || "Failed to load dashboard data");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleFilterChange = (e) => {
// // //     setFilters({ ...filters, [e.target.name]: e.target.value });
// // //   };

// // //   if (loading) return <div className="p-20">Loading Dashboard Data...</div>;
// // //   if (error) return <div className="p-20 text-red-500">Error: {error}</div>;
// // //   if (!data) return <div className="p-20">No Data Available</div>;

// // //   const { summary, participant_stats } = data;

// // //   // Generate colors for charts
// // //   const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#fbbf24'];

// // //   // Format data for charts
// // //   const trainingStatusData = [
// // //     { name: 'Scheduled', value: viewData?.by_status?.scheduled },
// // //     { name: 'Ongoing', value: viewData?.by_status?.ongoing },
// // //     { name: 'Completed', value: viewData?.by_status?.completed },
// // //     { name: 'Cancelled', value: viewData?.by_status?.cancelled }
// // //   ];

// // //   const participantCategoryData = participant_stats?.by_category?.map(item => ({
// // //     name: item.category,
// // //     value: item.count
// // //   }));

// // //   const participantEducationData = participant_stats?.by_education?.map(item => ({
// // //     name: item.education,
// // //     value: item.count
// // //   }));

// // //   const locationData = viewData?.by_location?.map(item => ({
// // //     name: item.district,
// // //     value: item.count
// // //   }));

// // //   return (
// // //     <div className={styles.dashboardGrid}>

// // //       {/* ===== TAB NAVIGATION ===== */}
// // //       <div style={{
// // //         display: 'flex',
// // //         gap: '12px',
// // //         padding: '6px',
// // //         background: 'white',
// // //         borderRadius: '12px',
// // //         boxShadow: '0 2px 8px rgba(106, 13, 173, 0.08)',
// // //         width: 'fit-content'
// // //       }}>
// // //         <button
// // //           onClick={() => setActiveTab('summary')}
// // //           style={{
// // //             display: 'flex',
// // //             alignItems: 'center',
// // //             gap: '8px',
// // //             padding: '12px 24px',
// // //             border: 'none',
// // //             borderRadius: '8px',
// // //             fontSize: '0.95rem',
// // //             fontWeight: 600,
// // //             cursor: 'pointer',
// // //             transition: 'all 0.2s ease',
// // //             background: activeTab === 'summary'
// // //               ? 'linear-gradient(135deg, #7B3F99 0%, #9B59B6 100%)'
// // //               : 'transparent',
// // //             color: activeTab === 'summary' ? 'white' : '#64748b',
// // //             boxShadow: activeTab === 'summary'
// // //               ? '0 4px 12px rgba(106, 13, 173, 0.3)'
// // //               : 'none'
// // //           }}
// // //           onMouseEnter={(e) => {
// // //             if (activeTab !== 'summary') {
// // //               e.currentTarget.style.background = '#f5f0ff';
// // //               e.currentTarget.style.color = '#7B3F99';
// // //             }
// // //           }}
// // //           onMouseLeave={(e) => {
// // //             if (activeTab !== 'summary') {
// // //               e.currentTarget.style.background = 'transparent';
// // //               e.currentTarget.style.color = '#64748b';
// // //             }
// // //           }}
// // //         >
// // //           <TrendingUp size={18} /> Summary
// // //         </button>
// // //         <button
// // //           onClick={() => setActiveTab('detailed')}
// // //           style={{
// // //             display: 'flex',
// // //             alignItems: 'center',
// // //             gap: '8px',
// // //             padding: '12px 24px',
// // //             border: 'none',
// // //             borderRadius: '8px',
// // //             fontSize: '0.95rem',
// // //             fontWeight: 600,
// // //             cursor: 'pointer',
// // //             transition: 'all 0.2s ease',
// // //             background: activeTab === 'detailed'
// // //               ? 'linear-gradient(135deg, #7B3F99 0%, #9B59B6 100%)'
// // //               : 'transparent',
// // //             color: activeTab === 'detailed' ? 'white' : '#64748b',
// // //             boxShadow: activeTab === 'detailed'
// // //               ? '0 4px 12px rgba(106, 13, 173, 0.3)'
// // //               : 'none'
// // //           }}
// // //           onMouseEnter={(e) => {
// // //             if (activeTab !== 'detailed') {
// // //               e.currentTarget.style.background = '#f5f0ff';
// // //               e.currentTarget.style.color = '#7B3F99';
// // //             }
// // //           }}
// // //           onMouseLeave={(e) => {
// // //             if (activeTab !== 'detailed') {
// // //               e.currentTarget.style.background = 'transparent';
// // //               e.currentTarget.style.color = '#64748b';
// // //             }
// // //           }}
// // //         >
// // //           <Table size={18} /> Detailed View
// // //         </button>
// // //         {/* <button
// // //           className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
// // //           onClick={() => setActiveTab('analytics')}
// // //         >
// // //           <Eye size={16} className="mr-2" /> Analytics
// // //         </button>
// // //         <button
// // //           className={`${styles.tabButton} ${activeTab === 'map' ? styles.activeTab : ''}`}
// // //           onClick={() => setActiveTab('map')}
// // //         >
// // //           <Map size={16} className="mr-2" /> Map View
// // //         </button> */}
// // //       </div>

// // //       {/* ===== FILTERS ===== */}
// // //       <div className={styles.filterBar}>
// // //         <div style={{
// // //           display: 'flex',
// // //           alignItems: 'center',
// // //           gap: '8px',
// // //           paddingRight: '16px',
// // //           borderRight: '2px solid #e2e8f0',
// // //           minWidth: '100px'
// // //         }}>
// // //           <Filter size={18} style={{ color: '#7B3F99' }} />
// // //           <span style={{
// // //             fontWeight: 700,
// // //             fontSize: '0.95rem',
// // //             color: '#1e293b',
// // //             letterSpacing: '0.5px'
// // //           }}>FILTERS</span>
// // //         </div>

// // //         <select name="district" className={styles.selectInput} onChange={handleFilterChange} value={filters.district}>
// // //           <option value="">All Districts</option>
// // //           <option value="Khairagarh">Khairagarh</option>
// // //           <option value="Raipur">Raipur</option>
// // //           <option value="Bilaspur">Bilaspur</option>
// // //           <option value="Durg">Durg</option>
// // //         </select>

// // //         <select name="block" className={styles.selectInput} onChange={handleFilterChange} value={filters.block}>
// // //           <option value="">All Blocks</option>
// // //           <option value="Khairagarh">Khairagarh</option>
// // //           <option value="Dhamtari">Dhamtari</option>
// // //           <option value="Bilaspur">Bilaspur Block</option>
// // //         </select>

// // //         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// // //           <Calendar size={16} style={{ color: '#64748b' }} />
// // //           <input
// // //             type="date"
// // //             name="start_date"
// // //             className={styles.selectInput}
// // //             onChange={handleFilterChange}
// // //             value={filters.start_date}
// // //           />
// // //           <span style={{ color: '#94a3b8', fontWeight: 600 }}>to</span>
// // //           <input
// // //             type="date"
// // //             name="end_date"
// // //             className={styles.selectInput}
// // //             onChange={handleFilterChange}
// // //             value={filters.end_date}
// // //           />
// // //         </div>

// // //         <select name="status" className={styles.selectInput} onChange={handleFilterChange} value={filters.status}>
// // //           <option value="">All Status</option>
// // //           <option value="scheduled">Scheduled</option>
// // //           <option value="ongoing">Ongoing</option>
// // //           <option value="completed">Completed</option>
// // //           <option value="cancelled">Cancelled</option>
// // //         </select>
// // //       </div>

// // //       {/* ===== CONTENT BASED ON ACTIVE TAB ===== */}
// // //       {activeTab === 'summary' && <SummaryTab summary={data} viewData={viewData} participant_stats={participant_stats} />}
// // //       {activeTab === 'detailed' && <DetailedTab viewData={viewData} filters={filters} />}
// // //       {/* {activeTab === 'analytics' && <AnalyticsTab data={data} filters={filters} COLORS={COLORS} trainingStatusData={trainingStatusData} participantCategoryData={participantCategoryData} participantEducationData={participantEducationData} locationData={locationData} />}
// // //       {activeTab === 'map' && <MapTab viewData={viewData} />} */}
// // //     </div>
// // //   );
// // // };

// // // // Cards and Basic Stats =====
// // // const SummaryTab = ({ summary, viewData, participant_stats }) => (
// // //   <div className="space-y-6">

// // //     <div className={styles.statsRow}>
// // //       <StatCard
// // //         title="Total Trainers"
// // //         value={summary?.total_trainers}
// // //         icon={Users}
// // //         color="#4f46e5"

// // //       />
// // //       <StatCard
// // //         title="Total Participants"
// // //         value={summary?.total_participants}
// // //         icon={Users}
// // //         color="#10b981"

// // //       />
// // //       <StatCard
// // //         title="Active Trainings"
// // //         value={summary?.active_trainings}
// // //         icon={BookOpen}
// // //         color="#f59e0b"

// // //       />
// // //       <StatCard
// // //         title="Locations Covered"
// // //         value={summary?.total_locations}
// // //         icon={MapPin}
// // //         color="#ec4899"

// // //       />
// // //     </div>

// // //     {/*  DETAILED STATS  */}
// // //     <div className={styles.detailsGrid}>
// // //       <TrainingStatusCard viewData={viewData} summary={summary} />
// // //       <ParticipantDemographicsCard participant_stats={participant_stats} summary={summary} />
// // //       <AttendanceOverviewCard participant_stats={participant_stats} />
// // //     </div>
// // //   </div>
// // // );

// // // // DETAILED TAB: Table View
// // // const DetailedTab = ({ viewData, filters }) => (
// // //   <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
// // //     {/* Header Section */}
// // //     <div style={{
// // //       background: 'white',
// // //       padding: '20px 24px',
// // //       borderRadius: '12px',
// // //       boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
// // //       display: 'flex',
// // //       justifyContent: 'space-between',
// // //       alignItems: 'center'
// // //     }}>
// // //       <div>
// // //         <h3 style={{
// // //           fontSize: '1.3rem',
// // //           fontWeight: 700,
// // //           color: '#1e293b',
// // //           margin: 0,
// // //           marginBottom: '4px',
// // //           display: 'flex',
// // //           alignItems: 'center',
// // //           gap: '10px'
// // //         }}>
// // //           <Table size={24} style={{ color: '#6366f1' }} />
// // //           Training Data Directory
// // //         </h3>
// // //         <p style={{
// // //           fontSize: '0.9rem',
// // //           color: '#64748b',
// // //           margin: 0
// // //         }}>
// // //           Complete list of all training sessions and participants
// // //         </p>
// // //       </div>
// // //       <div style={{
// // //         background: 'linear-gradient(135deg, #7B3F99 0%, #9B59B6 100%)',
// // //         padding: '12px 20px',
// // //         borderRadius: '10px',
// // //         boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
// // //       }}>
// // //         <div style={{
// // //           fontSize: '0.75rem',
// // //           color: 'rgba(255,255,255,0.9)',
// // //           fontWeight: 600,
// // //           textTransform: 'uppercase',
// // //           letterSpacing: '0.5px',
// // //           marginBottom: '2px'
// // //         }}>
// // //           Total Records
// // //         </div>
// // //         <div style={{
// // //           fontSize: '1.8rem',
// // //           fontWeight: 800,
// // //           color: 'white',
// // //           lineHeight: 1
// // //         }}>
// // //           {viewData?.data?.length || 0}
// // //         </div>
// // //       </div>
// // //     </div>

// // //     {/* Table Section */}
// // //     <div className={styles.tableView}>
// // //       {viewData && viewData.data && viewData.data.length > 0 ? (
// // //         <table className={styles.dataTable}>
// // //           <thead>
// // //             <tr>
// // //               <th style={{ width: '80px' }}>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <Calendar size={14} />
// // //                   ID
// // //                 </div>
// // //               </th>
// // //               <th>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <Users size={14} />
// // //                   Trainer & Subject
// // //                 </div>
// // //               </th>
// // //               <th>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <MapPin size={14} />
// // //                   Location
// // //                 </div>
// // //               </th>
// // //               <th>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <Users size={14} />
// // //                   Participants
// // //                 </div>
// // //               </th>
// // //               <th>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <TrendingUp size={14} />
// // //                   Status
// // //                 </div>
// // //               </th>
// // //               <th>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
// // //                   <Calendar size={14} />
// // //                   Start Date
// // //                 </div>
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {viewData.data.map((row, index) => (
// // //               <tr key={row.training_id || index}>
// // //                 <td>
// // //                   <span style={{
// // //                     fontFamily: 'monospace',
// // //                     fontSize: '0.85rem',
// // //                     color: '#6366f1',
// // //                     fontWeight: 600,
// // //                     background: '#eef2ff',
// // //                     padding: '4px 8px',
// // //                     borderRadius: '6px',
// // //                     display: 'inline-block'
// // //                   }}>
// // //                     #{row.training_id}
// // //                   </span>
// // //                 </td>
// // //                 <td>
// // //                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
// // //                     {row.subject_name}
// // //                   </div>
// // //                   <div style={{
// // //                     fontSize: '0.85rem',
// // //                     color: '#64748b',
// // //                     display: 'flex',
// // //                     alignItems: 'center',
// // //                     gap: '4px'
// // //                   }}>
// // //                     <User size={12} />
// // //                     {row.trainer_name}
// // //                   </div>
// // //                 </td>
// // //                 <td>
// // //                   <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
// // //                     {row.village || '-'}
// // //                   </div>
// // //                   <div style={{
// // //                     fontSize: '0.8rem',
// // //                     color: '#94a3b8',
// // //                     marginTop: '2px'
// // //                   }}>
// // //                     {row.district}, {row.block}
// // //                   </div>
// // //                 </td>
// // //                 <td>
// // //                   <div style={{
// // //                     display: 'flex',
// // //                     alignItems: 'center',
// // //                     gap: '8px'
// // //                   }}>
// // //                     <div style={{
// // //                       width: '50px',
// // //                       height: '6px',
// // //                       background: '#e5e7eb',
// // //                       borderRadius: '3px',
// // //                       overflow: 'hidden'
// // //                     }}>
// // //                       <div style={{
// // //                         width: `${(row.total_participants / row.max_participants) * 100}%`,
// // //                         height: '100%',
// // //                         background: 'linear-gradient(90deg, #10b981, #059669)',
// // //                         borderRadius: '3px'
// // //                       }}></div>
// // //                     </div>
// // //                     <span style={{
// // //                       fontSize: '0.9rem',
// // //                       fontWeight: 700,
// // //                       color: '#0f172a'
// // //                     }}>
// // //                       {row.total_participants}
// // //                     </span>
// // //                   </div>
// // //                 </td>
// // //                 <td>
// // //                   <span style={{
// // //                     padding: '6px 12px',
// // //                     borderRadius: '20px',
// // //                     fontSize: '0.75rem',
// // //                     fontWeight: 700,
// // //                     textTransform: 'uppercase',
// // //                     letterSpacing: '0.5px',
// // //                     display: 'inline-block',
// // //                     ...(row.status === 'completed' ? {
// // //                       background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
// // //                       color: '#166534',
// // //                       border: '1px solid #86efac'
// // //                     } : row.status === 'ongoing' ? {
// // //                       background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
// // //                       color: '#92400e',
// // //                       border: '1px solid #fcd34d'
// // //                     } : row.status === 'scheduled' ? {
// // //                       background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
// // //                       color: '#1e40af',
// // //                       border: '1px solid #93c5fd'
// // //                     } : {
// // //                       background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
// // //                       color: '#475569',
// // //                       border: '1px solid #cbd5e1'
// // //                     })
// // //                   }}>
// // //                     {row.status}
// // //                   </span>
// // //                 </td>
// // //                 <td style={{
// // //                   fontSize: '0.9rem',
// // //                   color: '#475569',
// // //                   fontWeight: 500
// // //                 }}>
// // //                   {new Date(row.start_date).toLocaleDateString('en-US', {
// // //                     month: 'short',
// // //                     day: 'numeric',
// // //                     year: 'numeric'
// // //                   })}
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       ) : (
// // //         <div style={{
// // //           display: 'flex',
// // //           flexDirection: 'column',
// // //           alignItems: 'center',
// // //           justifyContent: 'center',
// // //           padding: '60px 20px',
// // //           color: '#94a3b8'
// // //         }}>
// // //           <Table size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
// // //           <div style={{
// // //             fontSize: '1.1rem',
// // //             fontWeight: 600,
// // //             color: '#64748b',
// // //             marginBottom: '8px'
// // //           }}>
// // //             No Training Data Available
// // //           </div>
// // //           <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
// // //             No data matches your current filter criteria
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   </div>
// // // );

// // // //  ANALYTICS TAB: Charts and Graphs 
// // // const AnalyticsTab = ({ data, filters, COLORS, trainingStatusData, participantCategoryData, participantEducationData, locationData }) => (
// // //   <div className="space-y-6">
// // //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //       {/* Training Status Pie Chart */}
// // //       <div className={styles.card}>
// // //         <h3 className={styles.cardTitle}>Training Status Distribution</h3>
// // //         <div className="h-64 flex items-center justify-center">
// // //           <ResponsiveContainer width="100%" height="100%">
// // //             <RechartsPieChart>
// // //               <Pie
// // //                 data={trainingStatusData}
// // //                 cx="50%"
// // //                 cy="50%"
// // //                 labelLine={false}
// // //                 outerRadius={80}
// // //                 fill="#8884d8"
// // //                 dataKey="value"
// // //               >
// // //                 {trainingStatusData.map((entry, index) => (
// // //                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //                 ))}
// // //               </Pie>
// // //               <Tooltip />
// // //               <Legend />
// // //             </RechartsPieChart>
// // //           </ResponsiveContainer>
// // //         </div>
// // //       </div>

// // //       {/* Participant Category Bar Chart */}
// // //       <div className={styles.card}>
// // //         <h3 className={styles.cardTitle}>Participant Categories</h3>
// // //         <div className="h-64 flex items-center justify-center">
// // //           <ResponsiveContainer width="100%" height="100%">
// // //             <BarChart data={participantCategoryData}>
// // //               <CartesianGrid strokeDasharray="3 3" />
// // //               <XAxis dataKey="name" />
// // //               <YAxis />
// // //               <Tooltip />
// // //               <Legend />
// // //               <Bar dataKey="value" fill="#8b5cf6" />
// // //             </BarChart>
// // //           </ResponsiveContainer>
// // //         </div>
// // //       </div>
// // //     </div>

// // //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //       {/* Education Level Bar Chart */}
// // //       <div className={styles.card}>
// // //         <h3 className={styles.cardTitle}>Education Levels</h3>
// // //         <div className="h-64 flex items-center justify-center">
// // //           <ResponsiveContainer width="100%" height="100%">
// // //             <BarChart data={participantEducationData}>
// // //               <CartesianGrid strokeDasharray="3 3" />
// // //               <XAxis dataKey="name" />
// // //               <YAxis />
// // //               <Tooltip />
// // //               <Legend />
// // //               <Bar dataKey="value" fill="#ec4899" />
// // //             </BarChart>
// // //           </ResponsiveContainer>
// // //         </div>
// // //       </div>

// // //       {/* Location-wise Training Analysis */}
// // //       <div className={styles.card}>
// // //         <h3 className={styles.cardTitle}>District-wise Training Analysis</h3>
// // //         <div className="h-64 flex items-center justify-center">
// // //           <ResponsiveContainer width="100%" height="100%">
// // //             <RechartsLineChart data={locationData}>
// // //               <CartesianGrid strokeDasharray="3 3" />
// // //               <XAxis dataKey="name" />
// // //               <YAxis />
// // //               <Tooltip />
// // //               <Legend />
// // //               <Line type="monotone" dataKey="value" stroke="#4f46e5" />
// // //             </RechartsLineChart>
// // //           </ResponsiveContainer>
// // //         </div>
// // //       </div>
// // //     </div>

// // //     {/* Attendance Overview */}
// // //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //       <div className={styles.card}>
// // //         <h3 className={styles.cardTitle}>Attendance Overview</h3>
// // //         <div className="h-48 flex items-center justify-center">
// // //           <div className="text-center">
// // //             <div className="text-4xl font-bold mb-2">
// // //               {data.participant_stats?.attendance_stats.present}
// // //             </div>
// // //             <div className="text-sm text-gray-600">Present</div>
// // //             <div className="mt-4 space-y-2">
// // //               <div className="flex justify-between">
// // //                 <span>Absent: {data.participant_stats?.attendance_stats.absent}</span>
// // //                 <span className="w-20 bg-red-200 h-2 rounded"></span>
// // //               </div>
// // //               <div className="flex justify-between">
// // //                 <span>Late: {data.participant_stats?.attendance_stats.late}</span>
// // //                 <span className="w-20 bg-yellow-200 h-2 rounded"></span>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Trainer Performance */}
// // //       <div className={styles.card}>
// // //         <h3 className={styles.cardTitle}>Top Trainers</h3>
// // //         <div className="h-48 flex items-center justify-center">
// // //           <div className="text-center">
// // //             <div className="text-4xl font-bold mb-2">John Doe</div>
// // //             <div className="text-sm text-gray-600">5 trainings, 150 participants</div>
// // //             <div className="mt-4 space-y-2">
// // //               <div className="flex justify-between">
// // //                 <span>Rating: ★★★★☆</span>
// // //                 <span className="w-20 bg-yellow-200 h-2 rounded"></span>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Subject Performance */}
// // //       <div className={styles.card}>
// // //         <h3 className={styles.cardTitle}>Most Popular Subjects</h3>
// // //         <div className="h-48 flex items-center justify-center">
// // //           <div className="text-center">
// // //             <div className="text-4xl font-bold mb-2">Digital Literacy</div>
// // //             <div className="text-sm text-gray-600">25 trainings, 500 participants</div>
// // //             <div className="mt-4 space-y-2">
// // //               <div className="flex justify-between">
// // //                 <span>Completion Rate: 85%</span>
// // //                 <span className="w-20 bg-green-200 h-2 rounded"></span>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   </div>
// // // );

// // // // ===== MAP TAB: Map View =====
// // // const MapTab = ({ viewData }) => (
// // //   <div className={styles.mapView}>
// // //     <h3 className={styles.cardTitle}>Training Locations Map</h3>
// // //     <div className={styles.mapPlaceholder}>
// // //       <Map size={48} className="text-gray-400" />
// // //       <p>Interactive Map View (Coming Soon)</p>
// // //       <div className="text-sm text-gray-500 mt-2">
// // //         {viewData && viewData.data ?
// // //           `${viewData.data.filter(row => row.latitude && row.longitude).length} locations with coordinates` :
// // //           '0 locations available'
// // //         }
// // //       </div>
// // //     </div>
// // //   </div>
// // // );

// // // //  HELPER COMPONENTS 
// // // const StatCard = ({ title, value, icon: Icon, color, change }) => (
// // //   <div style={{
// // //     position: 'relative',
// // //     background: 'rgba(255, 255, 255, 0.7)',
// // //     backdropFilter: 'blur(20px)',
// // //     WebkitBackdropFilter: 'blur(20px)',
// // //     border: '1px solid rgba(255, 255, 255, 0.3)',
// // //     borderRadius: '20px',
// // //     padding: '20px',
// // //     boxShadow: '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
// // //     transition: 'all 0.3s ease',
// // //     overflow: 'hidden',
// // //     cursor: 'pointer'
// // //   }}
// // //     onMouseEnter={(e) => {
// // //       e.currentTarget.style.transform = 'translateY(-8px)';
// // //       e.currentTarget.style.boxShadow = '0 12px 40px rgba(106, 13, 173, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
// // //     }}
// // //     onMouseLeave={(e) => {
// // //       e.currentTarget.style.transform = 'translateY(0)';
// // //       e.currentTarget.style.boxShadow = '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
// // //     }}
// // //   >
// // //     <div style={{
// // //       position: 'absolute',
// // //       top: 0,
// // //       right: 0,
// // //       width: '150px',
// // //       height: '150px',
// // //       background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
// // //       borderRadius: '50%',
// // //       transform: 'translate(30%, -30%)',
// // //       pointerEvents: 'none'
// // //     }}></div>
// // //     <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
// // //       <div>
// // //         <div style={{
// // //           fontSize: '0.75rem',
// // //           fontWeight: 600,
// // //           color: '#64748b',
// // //           textTransform: 'uppercase',
// // //           letterSpacing: '0.5px',
// // //           marginBottom: '8px'
// // //         }}>
// // //           {title}
// // //         </div>
// // //         <div style={{
// // //           fontSize: '1.75rem',
// // //           fontWeight: 800,
// // //           color,
// // //           lineHeight: 1,
// // //           marginBottom: '8px'
// // //         }}>
// // //           {value}
// // //         </div>
// // //         {change && (
// // //           <div style={{
// // //             fontSize: '0.75rem',
// // //             color: '#10b981',
// // //             fontWeight: 600,
// // //             display: 'flex',
// // //             alignItems: 'center',
// // //             gap: '4px'
// // //           }}>
// // //             ↗ {change}
// // //           </div>
// // //         )}
// // //       </div>
// // //       <div style={{
// // //         width: '64px',
// // //         height: '64px',
// // //         background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
// // //         borderRadius: '16px',
// // //         display: 'flex',
// // //         alignItems: 'center',
// // //         justifyContent: 'center',
// // //         border: `1px solid ${color}30`,
// // //         boxShadow: `0 4px 12px ${color}15`,
// // //         transition: 'transform 0.3s ease'
// // //       }}>
// // //         <Icon size={32} color={color} strokeWidth={2} />
// // //       </div>
// // //     </div>
// // //   </div>
// // // );

// // // const TrainingStatusCard = ({ viewData, summary }) => (
// // //   <div style={{
// // //     position: 'relative',
// // //     background: 'rgba(255, 255, 255, 0.7)',
// // //     backdropFilter: 'blur(20px)',
// // //     WebkitBackdropFilter: 'blur(20px)',
// // //     border: '1px solid rgba(255, 255, 255, 0.3)',
// // //     borderRadius: '20px',
// // //     padding: '24px',
// // //     boxShadow: '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
// // //     transition: 'all 0.3s ease',
// // //     overflow: 'hidden'
// // //   }}>
// // //     <h3 className={styles.cardTitle}>
// // //       <BarChart3 size={20} style={{ color: '#6366f1' }} />
// // //       Training Status
// // //     </h3>
// // //     <div className={styles.statusList}>
// // //       <StatusRow label="Scheduled" value={viewData?.by_status?.scheduled} color="#6366f1" total={summary?.total_trainings} />
// // //       <StatusRow label="Ongoing" value={viewData?.by_status?.ongoing} color="#f59e0b" total={summary?.total_trainings} />
// // //       <StatusRow label="Completed" value={viewData?.by_status?.completed} color="#10b981" total={summary?.total_trainings} />
// // //       <StatusRow label="Cancelled" value={viewData?.by_status?.cancelled} color="#ef4444" total={summary?.total_trainings} />
// // //     </div>
// // //   </div>
// // // );

// // // const ParticipantDemographicsCard = ({ participant_stats, summary }) => (
// // //   <div style={{
// // //     position: 'relative',
// // //     background: 'rgba(255, 255, 255, 0.7)',
// // //     backdropFilter: 'blur(20px)',
// // //     WebkitBackdropFilter: 'blur(20px)',
// // //     border: '1px solid rgba(255, 255, 255, 0.3)',
// // //     borderRadius: '20px',
// // //     padding: '24px',
// // //     boxShadow: '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
// // //     transition: 'all 0.3s ease',
// // //     overflow: 'hidden'
// // //   }}>
// // //     <h3 className={styles.cardTitle}>
// // //       <Users size={20} style={{ color: '#8b5cf6' }} />
// // //       Demographics
// // //     </h3>

// // //     <div style={{ marginBottom: '24px' }}>
// // //       <div className={styles.sectionHeader} style={{ color: '#8b5cf6' }}>By Category</div>
// // //       {participant_stats?.by_category?.slice(0, 3).map((item, idx) => (
// // //         <ProgressBar key={idx} label={item.category} value={item.count} total={summary?.total_participants} color="#8b5cf6" />
// // //       ))}
// // //     </div>

// // //     <div>
// // //       <div className={styles.sectionHeader} style={{ color: '#ec4899' }}>By Education</div>
// // //       {participant_stats?.by_education?.slice(0, 3).map((item, idx) => (
// // //         <ProgressBar key={idx} label={item.education} value={item.count} total={summary?.total_participants} color="#ec4899" />
// // //       ))}
// // //     </div>
// // //   </div>
// // // );

// // // const AttendanceOverviewCard = ({ participant_stats }) => {
// // //   const totalAttendance = participant_stats?.attendance_stats.present +
// // //     participant_stats?.attendance_stats.absent +
// // //     participant_stats?.attendance_stats.late;

// // //   const presentPercent = totalAttendance > 0 ? Math.round((participant_stats?.attendance_stats.present / totalAttendance) * 100) : 0;
// // //   const absentPercent = totalAttendance > 0 ? Math.round((participant_stats?.attendance_stats.absent / totalAttendance) * 100) : 0;
// // //   const latePercent = totalAttendance > 0 ? Math.round((participant_stats?.attendance_stats.late / totalAttendance) * 100) : 0;

// // //   return (
// // //     <div style={{
// // //       position: 'relative',
// // //       background: 'rgba(255, 255, 255, 0.7)',
// // //       backdropFilter: 'blur(20px)',
// // //       WebkitBackdropFilter: 'blur(20px)',
// // //       border: '1px solid rgba(255, 255, 255, 0.3)',
// // //       borderRadius: '20px',
// // //       padding: '24px',
// // //       boxShadow: '0 8px 32px rgba(106, 13, 173, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
// // //       transition: 'all 0.3s ease',
// // //       overflow: 'hidden'
// // //     }}>
// // //       <h3 className={styles.cardTitle}>
// // //         <UserCheck size={20} style={{ color: '#10b981' }} />
// // //         Attendance Overview
// // //       </h3>

// // //       {/* Main Present Count with Circular Progress */}
// // //       <div style={{
// // //         display: 'flex',
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         marginBottom: '24px',
// // //         marginTop: '12px'
// // //       }}>
// // //         <div style={{ position: 'relative', width: '140px', height: '140px' }}>
// // //           {/* Background Circle */}
// // //           <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
// // //             <circle
// // //               cx="70"
// // //               cy="70"
// // //               r="60"
// // //               fill="none"
// // //               stroke="#e5e7eb"
// // //               strokeWidth="12"
// // //             />
// // //             {/* Progress Circle */}
// // //             <circle
// // //               cx="70"
// // //               cy="70"
// // //               r="60"
// // //               fill="none"
// // //               stroke="#10b981"
// // //               strokeWidth="12"
// // //               strokeDasharray={`${2 * Math.PI * 60}`}
// // //               strokeDashoffset={`${2 * Math.PI * 60 * (1 - presentPercent / 100)}`}
// // //               strokeLinecap="round"
// // //               style={{ transition: 'stroke-dashoffset 1s ease' }}
// // //             />
// // //           </svg>
// // //           {/* Center Text */}
// // //           <div style={{
// // //             position: 'absolute',
// // //             top: '50%',
// // //             left: '50%',
// // //             transform: 'translate(-50%, -50%)',
// // //             textAlign: 'center'
// // //           }}>
// // //             <div style={{
// // //               fontSize: '1.5rem',
// // //               fontWeight: 800,
// // //               color: '#10b981',
// // //               lineHeight: 1
// // //             }}>
// // //               {presentPercent}%
// // //             </div>
// // //             <div style={{
// // //               fontSize: '0.5rem',
// // //               color: '#64748b',
// // //               fontWeight: 600,
// // //               marginTop: '6px',
// // //               textTransform: 'uppercase',
// // //               letterSpacing: '0.5px'
// // //             }}>
// // //               Present
// // //             </div>
// // //             <div style={{
// // //               fontSize: '0.9rem',
// // //               color: '#94a3b8',
// // //               fontWeight: 500,
// // //               marginTop: '2px'
// // //             }}>
// // //               {participant_stats?.attendance_stats.present}/{totalAttendance}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Absent and Late Stats */}
// // //       <div style={{
// // //         display: 'grid',
// // //         gridTemplateColumns: '1fr 1fr',
// // //         gap: '12px',
// // //         marginTop: 'auto'
// // //       }}>
// // //         {/* Absent */}
// // //         <div style={{
// // //           padding: '16px',
// // //           borderRadius: '12px',
// // //           background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
// // //           border: '2px solid #fecaca',
// // //           textAlign: 'center',
// // //           transition: 'all 0.3s ease',
// // //           cursor: 'pointer'
// // //         }}
// // //           onMouseEnter={(e) => {
// // //             e.currentTarget.style.transform = 'translateY(-4px)';
// // //             e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.15)';
// // //           }}
// // //           onMouseLeave={(e) => {
// // //             e.currentTarget.style.transform = 'translateY(0)';
// // //             e.currentTarget.style.boxShadow = 'none';
// // //           }}>
// // //           <div style={{
// // //             width: '40px',
// // //             height: '40px',
// // //             borderRadius: '50%',
// // //             background: 'white',
// // //             display: 'flex',
// // //             alignItems: 'center',
// // //             justifyContent: 'center',
// // //             margin: '0 auto 8px'
// // //           }}>
// // //             <UserCheck size={20} style={{ color: '#dc2626' }} strokeWidth={2.5} />
// // //           </div>
// // //           <div style={{
// // //             fontSize: '1.8rem',
// // //             fontWeight: 800,
// // //             color: '#dc2626',
// // //             marginBottom: '4px'
// // //           }}>
// // //             {participant_stats?.attendance_stats.absent}
// // //           </div>
// // //           <div style={{
// // //             fontSize: '0.7rem',
// // //             fontWeight: 700,
// // //             color: '#991b1b',
// // //             textTransform: 'uppercase',
// // //             letterSpacing: '0.5px',
// // //             marginBottom: '4px'
// // //           }}>
// // //             Absent
// // //           </div>
// // //           <div style={{
// // //             fontSize: '0.75rem',
// // //             fontWeight: 600,
// // //             color: '#b91c1c',
// // //             background: 'white',
// // //             borderRadius: '8px',
// // //             padding: '4px 8px',
// // //             display: 'inline-block'
// // //           }}>
// // //             {absentPercent}%
// // //           </div>
// // //         </div>

// // //         {/* Late */}
// // //         <div style={{
// // //           padding: '16px',
// // //           borderRadius: '12px',
// // //           background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
// // //           border: '2px solid #fde68a',
// // //           textAlign: 'center',
// // //           transition: 'all 0.3s ease',
// // //           cursor: 'pointer'
// // //         }}
// // //           onMouseEnter={(e) => {
// // //             e.currentTarget.style.transform = 'translateY(-4px)';
// // //             e.currentTarget.style.boxShadow = '0 8px 16px rgba(245, 158, 11, 0.15)';
// // //           }}
// // //           onMouseLeave={(e) => {
// // //             e.currentTarget.style.transform = 'translateY(0)';
// // //             e.currentTarget.style.boxShadow = 'none';
// // //           }}>
// // //           <div style={{
// // //             width: '40px',
// // //             height: '40px',
// // //             borderRadius: '50%',
// // //             background: 'white',
// // //             display: 'flex',
// // //             alignItems: 'center',
// // //             justifyContent: 'center',
// // //             margin: '0 auto 8px'
// // //           }}>
// // //             <Calendar size={20} style={{ color: '#f59e0b' }} strokeWidth={2.5} />
// // //           </div>
// // //           <div style={{
// // //             fontSize: '1.8rem',
// // //             fontWeight: 800,
// // //             color: '#f59e0b',
// // //             marginBottom: '4px'
// // //           }}>
// // //             {participant_stats?.attendance_stats.late}
// // //           </div>
// // //           <div style={{
// // //             fontSize: '0.7rem',
// // //             fontWeight: 700,
// // //             color: '#92400e',
// // //             textTransform: 'uppercase',
// // //             letterSpacing: '0.5px',
// // //             marginBottom: '4px'
// // //           }}>
// // //             Late
// // //           </div>
// // //           <div style={{
// // //             fontSize: '0.75rem',
// // //             fontWeight: 600,
// // //             color: '#d97706',
// // //             background: 'white',
// // //             borderRadius: '8px',
// // //             padding: '4px 8px',
// // //             display: 'inline-block'
// // //           }}>
// // //             {latePercent}%
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const ProgressBar = ({ label, value, total, color }) => {
// // //   const percent = total > 0 ? Math.round((value / total) * 100) : 0;
// // //   return (
// // //     <div className={styles.progressContainer}>
// // //       <div className={styles.progressLabel}>
// // //         <span style={{ color: '#475569', fontWeight: 600 }}>{label}</span>
// // //         <span style={{ color: '#1e293b', fontWeight: 700 }}>{percent}%</span>
// // //       </div>
// // //       <div className={styles.progressBar}>
// // //         <div className={styles.progressFill} style={{ width: `${percent}%`, background: color }}></div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const StatusRow = ({ label, value, color, total }) => {
// // //   const percent = total > 0 ? Math.round((value / total) * 100) : 0;
// // //   return (
// // //     <div className={styles.statusRow}>
// // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
// // //         <div className={styles.statusDot} style={{ background: color, color: color }}></div>
// // //         <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>{label}</span>
// // //       </div>
// // //       <div style={{ textAlign: 'right' }}>
// // //         <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
// // //         <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{percent}%</div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // import React, { useState, useEffect } from 'react';
// // import { dashboardService } from '../../services/dashboardService';
// // import { Users, BookOpen, MapPin, Calendar, Filter, TrendingUp, Table, BarChart2, UserCheck, User } from 'lucide-react';
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   PieChart as RechartsPieChart,
// //   Pie,
// //   Cell,
// //   LineChart as RechartsLineChart,
// //   Line,
// //   ResponsiveContainer
// // } from 'recharts';

// // // ===== COLORFUL THEME CONFIGURATION =====
// // const THEME = {
// //   bgGradient: 'linear-gradient(-45deg, #f8fafc, #f1f5f9, #fdfbf7, #f0fdf4)',

// //   // General Glass Style for outer containers (Filters, Table Container)
// //   glass: {
// //     background: 'rgba(255, 255, 255, 0.75)',
// //     backdropFilter: 'blur(16px)',
// //     WebkitBackdropFilter: 'blur(16px)',
// //     border: '1px solid rgba(255, 255, 255, 0.9)',
// //     boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
// //     borderRadius: '20px',
// //     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
// //   },

// //   primary: '#6366f1',
// //   secondary: '#ec4899',
// //   success: '#10b981',
// //   warning: '#f59e0b',
// //   danger: '#ef4444',

// //   gradients: {
// //     primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
// //     success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
// //     warning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
// //     secondary: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
// //   },

// //   // New: Subtle gradients for table rows
// //   rowGradient: 'linear-gradient(to right, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.8) 100%)',

// //   input: {
// //     padding: '10px 16px',
// //     border: '1px solid #e2e8f0',
// //     borderRadius: '10px',
// //     fontSize: '0.9rem',
// //     fontWeight: 500,
// //     color: '#334155',
// //     background: 'white',
// //     outline: 'none',
// //     cursor: 'pointer',
// //     transition: 'all 0.2s ease'
// //   }
// // };

// // const Dashboard = () => {
// //   const [data, setData] = useState(null);
// //   const [viewData, setViewData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [activeTab, setActiveTab] = useState('summary');
// //   const [filters, setFilters] = useState({
// //     district: '',
// //     block: '',
// //     village: '',
// //     start_date: '',
// //     end_date: '',
// //     subject: '',
// //     status: ''
// //   });

// //   useEffect(() => {
// //     fetchData();
// //   }, [filters]);

// //   const fetchData = async () => {
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const [summaryData, viewDataResult] = await Promise.all([
// //         dashboardService.getDashboardData(filters),
// //         dashboardService.getDashboardViewData(filters)
// //       ]);

// //       setData(summaryData);
// //       setViewData(viewDataResult);
// //     } catch (error) {
// //       console.error("Dashboard Fetch Error:", error);
// //       setError(error.message || "Failed to load dashboard data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleFilterChange = (e) => {
// //     setFilters({ ...filters, [e.target.name]: e.target.value });
// //   };

// //   if (loading) return (
// //     <div style={{
// //       height: '100vh',
// //       display: 'flex',
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       background: THEME.bgGradient,
// //       color: THEME.primary,
// //       fontSize: '1.1rem',
// //       fontWeight: '500'
// //     }}>
// //       Loading Dashboard Data...
// //     </div>
// //   );

// //   if (error) return <div style={{ padding: '20px', color: THEME.danger }}>Error: {error}</div>;
// //   if (!data) return <div style={{ padding: '20px', color: '#64748b' }}>No Data Available</div>;

// //   const { summary, participant_stats } = data;

// //   // Safe Data Mappings
// //   const COLORS = [THEME.primary, THEME.success, THEME.warning, THEME.secondary];

// //   const trainingStatusData = [
// //     { name: 'Scheduled', value: viewData?.by_status?.scheduled || 0 },
// //     { name: 'Ongoing', value: viewData?.by_status?.ongoing || 0 },
// //     { name: 'Completed', value: viewData?.by_status?.completed || 0 },
// //     { name: 'Cancelled', value: viewData?.by_status?.cancelled || 0 }
// //   ];

// //   const participantCategoryData = participant_stats?.by_category?.map(item => ({
// //     name: item.category,
// //     value: item.count
// //   })) || [];

// //   const participantEducationData = participant_stats?.by_education?.map(item => ({
// //     name: item.education,
// //     value: item.count
// //   })) || [];

// //   const locationData = viewData?.by_location?.map(item => ({
// //     name: item.district,
// //     value: item.count
// //   })) || [];

// //   return (
// //     <div style={{
// //       padding: '20px',
// //       display: 'flex',
// //       flexDirection: 'column',
// //       gap: '32px',
// //       minHeight: '100vh',
// //       background: THEME.bgGradient
// //     }}>

// //       {/* ===== HEADER & TABS ===== */}
// //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
// //         <div>
// //           <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.5px' }}>
// //             Dashboard Overview
// //           </h1>
// //           <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
// //             Welcome back, here is your training summary.
// //           </p>
// //         </div>

// //         <div style={{
// //           display: 'flex',
// //           gap: '10px',
// //           padding: '6px',
// //           background: 'white',
// //           borderRadius: '14px',
// //           boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
// //         }}>
// //           <button
// //             onClick={() => setActiveTab('summary')}
// //             style={{
// //               ...getTabStyle(activeTab === 'summary', THEME.gradients.primary)
// //             }}
// //           >
// //             <TrendingUp size={18} /> <span>Summary</span>
// //           </button>
// //           <button
// //             onClick={() => setActiveTab('detailed')}
// //             style={{
// //               ...getTabStyle(activeTab === 'detailed', THEME.gradients.primary)
// //             }}
// //           >
// //             <Table size={18} /> <span>Detailed View</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* ===== FILTERS ===== */}
// //       <div style={{ ...THEME.glass, padding: '16px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '20px', borderRight: '1px solid #e2e8f0', color: THEME.primary, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
// //           <Filter size={16} /> Filters
// //         </div>

// //         <select name="district" style={THEME.input} onChange={handleFilterChange} value={filters.district}>
// //           <option value="">All Districts</option>
// //           <option value="Khairagarh">Khairagarh</option>
// //           <option value="Raipur">Raipur</option>
// //           <option value="Bilaspur">Bilaspur</option>
// //         </select>

// //         <select name="block" style={THEME.input} onChange={handleFilterChange} value={filters.block}>
// //           <option value="">All Blocks</option>
// //           <option value="Khairagarh">Khairagarh</option>
// //           <option value="Dhamtari">Dhamtari</option>
// //         </select>

// //         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //           <Calendar size={16} style={{ color: '#94a3b8' }} />
// //           <input type="date" name="start_date" style={THEME.input} onChange={handleFilterChange} value={filters.start_date} />
// //           <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.85rem' }}>to</span>
// //           <input type="date" name="end_date" style={THEME.input} onChange={handleFilterChange} value={filters.end_date} />
// //         </div>

// //         <select name="status" style={THEME.input} onChange={handleFilterChange} value={filters.status}>
// //           <option value="">All Status</option>
// //           <option value="completed">Completed</option>
// //           <option value="ongoing">Ongoing</option>
// //           <option value="scheduled">Scheduled</option>
// //           <option value="cancelled">Cancelled</option>
// //         </select>
// //       </div>

// //       {/* ===== CONTENT ===== */}
// //       {activeTab === 'summary' && <SummaryTab summary={data} viewData={viewData} participant_stats={participant_stats} />}
// //       {activeTab === 'detailed' && <DetailedTab viewData={viewData} />}
// //     </div>
// //   );
// // };

// // // Helper for Button Styles
// // const getTabStyle = (isActive, gradient) => ({
// //   display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease',
// //   background: isActive ? gradient : 'transparent',
// //   color: isActive ? 'white' : '#64748b',
// //   boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
// // });

// // // ===== SUB COMPONENTS =====

// // const SummaryTab = ({ summary, viewData, participant_stats }) => (
// //   <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

// //     {/* Top Stats Grid - Using Colorful Gradients with White Content Containers */}
// //     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
// //       <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={Users} gradient={THEME.gradients.primary} />
// //       <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.success} />
// //       <StatCard title="Active Trainings" value={summary?.active_trainings || 0} icon={BookOpen} gradient={THEME.gradients.warning} />
// //       <StatCard title="Locations Covered" value={summary?.total_locations || 0} icon={MapPin} gradient={THEME.gradients.secondary} />
// //     </div>

// //     {/* Detailed Metrics Grid - Using Colorful Gradients for Cards */}
// //     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
// //       <TrainingStatusCard viewData={viewData} summary={summary} />
// //       <ParticipantDemographicsCard participant_stats={participant_stats} summary={summary} />
// //       <AttendanceOverviewCard participant_stats={participant_stats} />
// //     </div>
// //   </div>
// // );

// // const DetailedTab = ({ viewData }) => (
// //   <div style={{ ...THEME.glass, padding: '28px', minHeight: '500px' }}>
// //     <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //       <div>
// //         <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
// //           <Table size={24} color={THEME.primary} /> Training Directory
// //         </h2>
// //         <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
// //           Overview of all training sessions
// //         </p>
// //       </div>
// //       <div style={{
// //         background: THEME.gradients.primary, padding: '8px 16px', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
// //       }}>
// //         Total Records: {viewData?.data?.length || 0}
// //       </div>
// //     </div>

// //     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
// //       {viewData && viewData.data && viewData.data.length > 0 ? (
// //         viewData.data.map((row, i) => (
// //           <div
// //             key={row.training_id || i}
// //             style={{
// //               display: 'grid',
// //               gridTemplateColumns: '90px 2.5fr 1.5fr 110px 140px 160px',
// //               gap: '20px',
// //               alignItems: 'center',
// //               padding: '18px 24px',
// //               background: THEME.rowGradient,
// //               borderRadius: '16px',
// //               border: '1px solid rgba(255,255,255,0.8)',
// //               transition: 'all 0.2s ease',
// //               cursor: 'pointer'
// //             }}
// //             onMouseEnter={(e) => {
// //               e.currentTarget.style.transform = 'translateY(-2px)';
// //               e.currentTarget.style.background = 'white';
// //               e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.04)';
// //             }}
// //             onMouseLeave={(e) => {
// //               e.currentTarget.style.transform = 'translateY(0)';
// //               e.currentTarget.style.background = THEME.rowGradient;
// //               e.currentTarget.style.boxShadow = 'none';
// //             }}
// //           >
// //             {/* ID */}
// //             <div>
// //               <span style={{
// //                 fontFamily: 'monospace', fontSize: '0.85rem', color: THEME.primary, fontWeight: 700,
// //                 background: '#e0e7ff', padding: '4px 10px', borderRadius: '8px', display: 'inline-block'
// //               }}>
// //                 #{row.training_id}
// //               </span>
// //             </div>

// //             {/* Topic & Trainer */}
// //             <div>
// //               <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '4px', fontSize: '1rem' }}>{row.subject_name}</div>
// //               <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
// //                 <User size={13} /> {row.trainer_name}
// //               </div>
// //             </div>

// //             {/* Location */}
// //             <div>
// //               <div style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 500 }}>{row.village || '-'}</div>
// //               <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{row.district}</div>
// //             </div>

// //             {/* Participants */}
// //             <div>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //                 <div style={{ width: '50px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
// //                   <div style={{ width: `${(row.total_participants / row.max_participants) * 100}%`, height: '100%', background: THEME.success, borderRadius: '3px' }}></div>
// //                 </div>
// //                 <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{row.total_participants}</span>
// //               </div>
// //             </div>

// //             {/* Status */}
// //             <div>
// //               <span style={{
// //                 padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'inline-block', letterSpacing: '0.5px',
// //                 ...(row.status === 'completed' ? { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' } :
// //                   row.status === 'ongoing' ? { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' } :
// //                     row.status === 'scheduled' ? { background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' } :
// //                       { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' })
// //               }}>
// //                 {row.status}
// //               </span>
// //             </div>

// //             {/* Date */}
// //             <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
// //               {new Date(row.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
// //             </div>
// //           </div>
// //         ))
// //       ) : (
// //         <div style={{
// //           padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', color: '#94a3b8', fontSize: '0.95rem'
// //         }}>
// //           No Training Data Available
// //         </div>
// //       )}
// //     </div>
// //   </div>
// // );

// // // ===== DASHBOARD CARDS =====

// // const StatCard = ({ title, value, icon: Icon, gradient }) => (
// //   <div
// //     style={{
// //       // Colorful Gradient Background
// //       background: gradient,
// //       borderRadius: '24px',
// //       padding: '0', // Padding handled by inner container
// //       position: 'relative',
// //       overflow: 'hidden',
// //       boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
// //       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
// //     }}
// //     onMouseEnter={(e) => {
// //       e.currentTarget.style.transform = 'translateY(-4px)';
// //       e.currentTarget.style.boxShadow = '0 12px 30px 0 rgba(0, 0, 0, 0.2)';
// //     }}
// //     onMouseLeave={(e) => {
// //       e.currentTarget.style.transform = 'translateY(0)';
// //       e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
// //     }}
// //   >
// //     {/* Inner White Container for Clear Readability */}
// //     <div style={{
// //       background: 'rgba(255, 255, 255, 0.9)',
// //       backdropFilter: 'blur(4px)',
// //       margin: '4px', // Border effect
// //       borderRadius: '20px',
// //       padding: '24px',
// //       display: 'flex',
// //       flexDirection: 'column',
// //       gap: '12px',
// //       position: 'relative',
// //       zIndex: 1
// //     }}>
// //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
// //         <div>
// //           <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
// //             {title}
// //           </div>
// //           <div style={{
// //             fontSize: '2.2rem', fontWeight: 800, lineHeight: 1,
// //             // Gradient Text for the number, contrasting with white background
// //             background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
// //           }}>
// //             {value}
// //           </div>
// //         </div>
// //         <div style={{
// //           width: '52px', height: '52px', background: gradient, borderRadius: '14px',
// //           display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
// //         }}>
// //           <Icon size={26} strokeWidth={2.5} />
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // );

// // const TrainingStatusCard = ({ viewData, summary }) => (
// //   <div style={{
// //     // Colorful Gradient Background
// //     background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%)',
// //     borderRadius: '24px',
// //     padding: '28px',
// //     boxShadow: '0 8px 20px rgba(99, 102, 241, 0.15)',
// //     border: '1px solid rgba(255,255,255,0.6)'
// //   }}>
// //     <h3 style={{ fontWeight: 700, color: '#4338ca', marginBottom: '24px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
// //       <BarChart2 color={THEME.primary} /> Training Status
// //     </h3>
// //     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
// //       {['Scheduled', 'Ongoing', 'Completed', 'Cancelled'].map((status, i) => {
// //         const key = status.toLowerCase();
// //         const val = viewData?.by_status?.[key] || 0;
// //         const colors = [THEME.primary, THEME.warning, THEME.success, THEME.danger];
// //         const c = colors[i];
// //         const total = summary?.total_trainings || 1;
// //         const pct = Math.round((val / total) * 100);

// //         return (
// //           <div key={i} style={{
// //             // White background card for clear readability
// //             display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px',
// //             background: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)',
// //             backdropFilter: 'blur(4px)'
// //           }}>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
// //               <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, boxShadow: `0 0 0 4px ${c}20` }}></div>
// //               <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>{status}</span>
// //             </div>
// //             <div style={{ textAlign: 'right' }}>
// //               <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{val}</div>
// //               <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{pct}%</div>
// //             </div>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   </div>
// // );

// // const ParticipantDemographicsCard = ({ participant_stats, summary }) => (
// //   <div style={{
// //     // Colorful Gradient Background
// //     background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
// //     borderRadius: '24px',
// //     padding: '28px',
// //     boxShadow: '0 8px 20px rgba(236, 72, 153, 0.15)',
// //     border: '1px solid rgba(255,255,255,0.6)'
// //   }}>
// //     <h3 style={{ fontWeight: 700, color: '#be185d', marginBottom: '24px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
// //       <Users color={THEME.secondary} /> Demographics
// //     </h3>
// //     <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
// //       {participant_stats?.by_category?.slice(0, 3).map((item, i) => {
// //         const total = summary?.total_participants || 1;
// //         const pct = Math.round((item.count / total) * 100);
// //         const colors = [THEME.primary, THEME.secondary, THEME.warning];
// //         const color = colors[i % colors.length];

// //         return (
// //           <div key={i}>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
// //               <span style={{ color: '#475569' }}>{item.category}</span>
// //               <span style={{ color: color }}>{pct}%</span>
// //             </div>
// //             <div style={{ height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.4)' }}>
// //               <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '10px', boxShadow: `0 0 10px ${color}40` }}></div>
// //             </div>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   </div>
// // );

// // const AttendanceOverviewCard = ({ participant_stats }) => {
// //   const total = (participant_stats?.attendance_stats?.present || 0) +
// //     (participant_stats?.attendance_stats?.absent || 0) +
// //     (participant_stats?.attendance_stats?.late || 0);

// //   const present = participant_stats?.attendance_stats?.present || 0;
// //   const presentPercent = total > 0 ? Math.round((present / total) * 100) : 0;
// //   const radius = 50;
// //   const circumference = 2 * Math.PI * radius;
// //   const offset = circumference - (presentPercent / 100) * circumference;

// //   return (
// //     <div style={{
// //       // Colorful Gradient Background
// //       background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
// //       borderRadius: '24px',
// //       padding: '28px',
// //       boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)',
// //       border: '1px solid rgba(255,255,255,0.6)',
// //       display: 'flex', flexDirection: 'column', alignItems: 'center'
// //     }}>
// //       <h3 style={{ fontWeight: 700, color: '#065f46', marginBottom: '28px', width: '100%', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
// //         <UserCheck color={THEME.success} /> Attendance Overview
// //       </h3>

// //       <div style={{ position: 'relative', width: '170px', height: '170px', marginBottom: '28px' }}>
// //         <svg width="170" height="170" style={{ transform: 'rotate(-90deg)' }}>
// //           <circle cx="85" cy="85" r={radius} fill="none" stroke="#ffffff" strokeWidth="16" opacity="0.6" />
// //           <circle cx="85" cy="85" r={radius} fill="none" stroke={THEME.success} strokeWidth="16"
// //             strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
// //             style={{ transition: 'stroke-dashoffset 1s ease' }} />
// //         </svg>
// //         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
// //           <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065f46', lineHeight: 1 }}>{presentPercent}%</div>
// //           <div style={{ fontSize: '0.75rem', color: '#064e3b', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Present</div>
// //         </div>
// //       </div>

// //       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
// //         <div style={{
// //           // White background for clear readability
// //           padding: '18px', borderRadius: '14px', textAlign: 'center',
// //           background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)',
// //           color: THEME.danger, fontWeight: 700, border: '1px solid rgba(255,255,255,0.6)'
// //         }}>
// //           <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{participant_stats?.attendance_stats?.absent || 0}</div>
// //           <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginTop: '4px', opacity: 0.8 }}>Absent</div>
// //         </div>
// //         <div style={{
// //           // White background for clear readability
// //           padding: '18px', borderRadius: '14px', textAlign: 'center',
// //           background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)',
// //           color: THEME.warning, fontWeight: 700, border: '1px solid rgba(255,255,255,0.6)'
// //         }}>
// //           <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{participant_stats?.attendance_stats?.late || 0}</div>
// //           <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginTop: '4px', opacity: 0.8 }}>Late</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
// import { dashboardService } from '../../services/dashboardService';
// import { Users, BookOpen, MapPin, Calendar, Filter, TrendingUp, Table, BarChart2, UserCheck, User } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   LineChart as RechartsLineChart,
//   Line,
//   ResponsiveContainer
// } from 'recharts';

// // ===== CLEAN & ELEGANT THEME =====
// const THEME = {
//   // Unified Gap Sizes
//   gap: {
//     xs: '8px',
//     sm: '12px',
//     md: '16px',
//     lg: '24px',
//     xl: '32px'
//   },

//   // Unified Padding Sizes
//   pad: {
//     sm: '12px',
//     md: '16px',
//     lg: '20px',
//     xl: '28px'
//   },

//   bgGradient: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',

//   // Elegant Thin Border Style
//   glass: {
//     background: '#ffffff',
//     border: '1px solid #f3f4f6', // Very subtle light gray border
//     borderRadius: '16px',
//     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', // Soft shadow to replace thick border feel
//     transition: 'all 0.2s ease-in-out'
//   },

//   primary: '#4f46e5',
//   secondary: '#db2777',
//   success: '#059669',
//   warning: '#d97706',
//   danger: '#dc2626',

//   gradients: {
//     primary: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
//     success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//     warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
//     secondary: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
//   },

//   input: {
//     padding: '10px 16px',
//     border: '1px solid #e5e7eb', // Thinner border
//     borderRadius: '8px',
//     fontSize: '0.9rem',
//     fontWeight: '500',
//     color: '#1e293b',
//     background: '#ffffff',
//     outline: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//     height: '40px',
//     display: 'flex',
//     alignItems: 'center'
//   }
// };

// const Dashboard = () => {
//   const [data, setData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [locationsData, setLocationsData] = useState([]);
//   const [trainingLocations, setTrainingLocations] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('summary');
//   const [filters, setFilters] = useState({
//     district: '',
//     block: '',
//     village: '',
//     start_date: '',
//     end_date: '',
//     subject: '',
//     status: ''
//   });

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [summaryData, viewDataResult] = await Promise.all([
//         dashboardService.getDashboardData(filters),
//         dashboardService.getDashboardViewData(filters)
//       ]);
//       setData(summaryData);
//       setViewData(viewDataResult);
//     } catch (error) {
//       console.error("Dashboard Fetch Error:", error);
//       setError(error.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchMapLocation = async () => {
//       try {
//         const data = await locationService.getAll();
//         setLocationsData(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching locations for map:", error);
//       }
//     };
//     fetchMapLocation();
//   }, [])

//   useEffect(() => {
//     const fetchTrainingsForMap = async () => {
//       try {
//         const trainings = await trainingService.getAll();

//         console.log("Training data loaded:", trainings);

//         setTrainingLocations(
//           Array.isArray(trainings) ? trainings : trainings?.data || []
//         );
//       } catch (error) {
//         console.error("Error fetching trainings for map:", error);
//       }
//     };

//     fetchTrainingsForMap();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   if (loading) return (
//     <div style={{
//       height: '100vh',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       background: THEME.bgGradient,
//       color: THEME.primary,
//       fontSize: '1rem',
//       fontWeight: '600'
//     }}>
//       Loading Dashboard Data...
//     </div>
//   );

//   if (error) return <div style={{ padding: THEME.pad.xl, color: THEME.danger, textAlign: 'center' }}>Error: {error}</div>;
//   if (!data) return <div style={{ padding: THEME.pad.xl, color: '#64748b', textAlign: 'center' }}>No Data Available</div>;

//   if (error) return <div style={{ padding: THEME.pad.xl, color: THEME.danger, textAlign: 'center' }}>Error: {error}</div>;
//   if (!data) return <div style={{ padding: THEME.pad.xl, color: '#64748b', textAlign: 'center' }}>No Data Available</div>;

//   const COLORS = [THEME.primary, THEME.success, THEME.warning, THEME.secondary];

//   const trainingStatusData = [
//     { name: 'Scheduled', value: viewData?.by_status?.scheduled || 0 },
//     { name: 'Ongoing', value: viewData?.by_status?.ongoing || 0 },
//     { name: 'Completed', value: viewData?.by_status?.completed || 0 },
//     { name: 'Cancelled', value: viewData?.by_status?.cancelled || 0 }
//   ];

//   // const participantCategoryData = participant_stats?.by_category?.map(item => ({
//   //   name: item.category,
//   //   value: item.count
//   // })) || [];

//   // const participantEducationData = participant_stats?.by_education?.map(item => ({
//   //   name: item.education,
//   //   value: item.count
//   // })) || [];

//   const locationData = viewData?.by_location?.map(item => ({
//     name: item.district,
//     value: item.count
//   })) || [];

//   return (
//     <div style={{
//       padding: 20,
//       display: 'flex',
//       flexDirection: 'column',
//       gap: THEME.gap.xl,
//       minHeight: '100vh',
//       background: THEME.bgGradient
//     }}>

//       {/* ===== HEADER & TABS ===== */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: THEME.gap.md }}>
//         <div>
//           <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
//             Dashboard Overview
//           </h1>
//           <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
//             Welcome back, here is your training summary.
//           </p>
//         </div>
//         <div style={{
//           display: 'flex',
//           gap: THEME.gap.xs,
//           padding: '4px',
//           background: '#ffffff',
//           borderRadius: '10px',
//           border: '1px solid #f3f4f6' // Attractive thin border
//         }}>
//           <button
//             onClick={() => setActiveTab('summary')}
//             style={{
//               ...getTabStyle(activeTab === 'summary', THEME.gradients.primary)
//             }}
//           >
//             <TrendingUp size={18} /> <span>Summary</span>
//           </button>
//           <button
//             onClick={() => setActiveTab('detailed')}
//             style={{
//               ...getTabStyle(activeTab === 'detailed', THEME.gradients.primary)
//             }}
//           >
//             <Table size={18} /> <span>Detailed View</span>
//           </button>
//         </div>
//       </div>

//       {/* ===== FILTERS ===== */}
//       <div style={{ ...THEME.glass, padding: `${THEME.pad.md} ${THEME.pad.lg}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: THEME.gap.md }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs, paddingRight: THEME.pad.md, borderRight: '1px solid #f3f4f6', color: THEME.primary, fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
//           <Filter size={16} /> Filters
//         </div>
//         <select name="district" style={THEME.input} onChange={handleFilterChange} value={filters.district}>
//           <option value="">All Districts</option>
//           <option value="Khairagarh">Khairagarh</option>
//           <option value="Raipur">Raipur</option>
//           <option value="Bilaspur">Bilaspur</option>
//         </select>
//         <select name="block" style={THEME.input} onChange={handleFilterChange} value={filters.block}>
//           <option value="">All Blocks</option>
//           <option value="Khairagarh">Khairagarh</option>
//           <option value="Dhamtari">Dhamtari</option>
//         </select>
//         <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.xs }}>
//           <Calendar size={16} style={{ color: '#94a3b8' }} />
//           <input type="date" name="start_date" style={THEME.input} onChange={handleFilterChange} value={filters.start_date} />
//           <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', margin: `0 ${THEME.gap.xs}` }}>to</span>
//           <input type="date" name="end_date" style={THEME.input} onChange={handleFilterChange} value={filters.end_date} />
//         </div>
//         <select name="status" style={THEME.input} onChange={handleFilterChange} value={filters.status}>
//           <option value="">All Status</option>
//           <option value="completed">Completed</option>
//           <option value="ongoing">Ongoing</option>
//           <option value="scheduled">Scheduled</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* ===== CONTENT ===== */}
//       {/* {activeTab === 'summary' && <SummaryTab summary={data} viewData={viewData} participant_stats={participant_stats} />}
//       {activeTab === 'detailed' && <DetailedTab viewData={viewData} />} */}
//     </div>
//   );
// };

// // Helper for Button Styles
// const getTabStyle = (isActive, gradient) => ({
//   display: 'flex', alignItems: 'center', gap: THEME.gap.xs, padding: `8px ${THEME.pad.md}`, border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease-in-out',
//   background: isActive ? gradient : 'transparent',
//   color: isActive ? 'white' : '#64748b',
//   letterSpacing: '0.01em'
// });

// // ===== SUB COMPONENTS =====

// const SummaryTab = ({ summary, viewData, participant_stats }) => (
//   <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.xl }}>

//     {/* Top Stats Grid */}
//     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: THEME.gap.lg }}>
//       <StatCard title="Total Trainers" value={summary?.total_trainers || 0} icon={Users} gradient={THEME.gradients.primary} />
//       <StatCard title="Total Participants" value={summary?.total_participants || 0} icon={Users} gradient={THEME.gradients.success} />
//       <StatCard title="Active Trainings" value={summary?.active_trainings || 0} icon={BookOpen} gradient={THEME.gradients.warning} />
//       <StatCard title="Locations Covered" value={summary?.total_locations || 0} icon={MapPin} gradient={THEME.gradients.secondary} />
//     </div>

//     {/* Detailed Metrics Grid */}
//     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: THEME.gap.lg }}>
//       <TrainingStatusCard viewData={viewData} summary={summary} />
//       <ParticipantDemographicsCard participant_stats={participant_stats} summary={summary} />
//       <AttendanceOverviewCard participant_stats={participant_stats} />
//     </div>

//   </div>
// );

// const DetailedTab = ({ viewData }) => (
//   <div style={{ ...THEME.glass, padding: THEME.pad.xl, minHeight: '500px' }}>
//     <div style={{ marginBottom: THEME.pad.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//       <div>
//         <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}>
//           <Table size={24} color={THEME.primary} /> Training Directory
//         </h2>
//         <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
//           Overview of all training sessions
//         </p>
//       </div>
//       <div style={{
//         background: THEME.gradients.primary, padding: `6px ${THEME.pad.md}`, borderRadius: '8px', color: 'white', fontWeight: '700', fontSize: '0.85rem',
//         boxShadow: '0 2px 4px rgba(79, 70, 229, 0.1)'
//       }}>
//         Total Records: {viewData?.data?.length || 0}
//       </div>
//     </div>

//     <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
//       {viewData && viewData.data && viewData.data.length > 0 ? (
//         viewData.data.map((row, i) => (
//           <div
//             key={row.training_id || i}
//             style={{
//               display: 'grid',
//               gridTemplateColumns: '80px 2.5fr 1.5fr 100px 120px 160px',
//               gap: THEME.gap.md,
//               alignItems: 'center',
//               padding: `${THEME.pad.md} ${THEME.pad.lg}`,
//               background: '#ffffff',
//               borderRadius: '12px',
//               border: '1px solid #f3f4f6', // Attractive thin border
//               transition: 'all 0.15s ease-in-out',
//               cursor: 'pointer'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = THEME.primary;
//               e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = '#f3f4f6';
//               e.currentTarget.style.boxShadow = 'none';
//             }}
//           >
//             {/* ID */}
//             <div>
//               <span style={{
//                 fontFamily: 'monospace', fontSize: '0.85rem', color: THEME.primary, fontWeight: '700',
//                 background: '#eff6ff', padding: `4px ${THEME.pad.sm}`, borderRadius: '6px', display: 'inline-block', letterSpacing: '-0.03em'
//               }}>
//                 #{row.training_id}
//               </span>
//             </div>

//             {/* Topic & Trainer */}
//             <div>
//               <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '2px', fontSize: '0.95rem', lineHeight: '1.4' }}>{row.subject_name}</div>
//               <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: THEME.gap.xs, fontWeight: '500' }}>
//                 <User size={13} /> {row.trainer_name}
//               </div>
//             </div>

//             {/* Location */}
//             <div>
//               <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>{row.village || '-'}</div>
//               <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', fontWeight: '500' }}>{row.district}</div>
//             </div>

//             {/* Participants */}
//             <div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}>
//                 <div style={{ width: '40px', height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
//                   <div style={{ width: `${(row.total_participants / row.max_participants) * 100}%`, height: '100%', background: THEME.success, borderRadius: '2px' }}></div>
//                 </div>
//                 <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{row.total_participants}</span>
//               </div>
//             </div>

//             {/* Status */}
//             <div>
//               <span style={{
//                 padding: `4px ${THEME.pad.sm}`, borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block', letterSpacing: '0.05em',
//                 ...(row.status === 'completed' ? { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' } :
//                   row.status === 'ongoing' ? { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' } :
//                     row.status === 'scheduled' ? { background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' } :
//                       { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' })
//               }}>
//                 {row.status}
//               </span>
//             </div>

//             {/* Date */}
//             <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
//               {new Date(row.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//             </div>
//           </div>
//         ))
//       ) : (
//         <div style={{
//           padding: THEME.pad.xl, textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px dashed #f3f4f6', color: '#94a3b8', fontSize: '0.95rem'
//         }}>
//           No Training Data Available
//         </div>
//       )}
//     </div>
//   </div>
// );

// // ===== DASHBOARD CARDS =====

// const StatCard = ({ title, value, icon: Icon, gradient }) => (
//   <div
//     style={{
//       // Colorful Gradient Background
//       background: gradient,
//       borderRadius: '16px',
//       padding: '3px', // Thin gap for border effect
//       boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
//       transition: 'all 0.2s ease-in-out'
//     }}
//     onMouseEnter={(e) => {
//       e.currentTarget.style.transform = 'translateY(-2px)';
//       e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
//     }}
//     onMouseLeave={(e) => {
//       e.currentTarget.style.transform = 'translateY(0)';
//       e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
//     }}
//   >
//     {/* Inner White Container */}
//     <div style={{
//       background: '#ffffff',
//       borderRadius: '13px',
//       padding: THEME.pad.lg,
//       display: 'flex',
//       flexDirection: 'column',
//       gap: THEME.gap.sm,
//       position: 'relative',
//       zIndex: 1
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <div>
//           <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
//             {title}
//           </div>
//           <div style={{
//             fontSize: '2.2rem', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.02em',
//             background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
//           }}>
//             {value}
//           </div>
//         </div>
//         <div style={{
//           width: '48px', height: '48px', background: gradient, borderRadius: '10px',
//           display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//         }}>
//           <Icon size={24} strokeWidth={2.5} />
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const TrainingStatusCard = ({ viewData, summary }) => (
//   <div style={{
//     background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
//     borderRadius: '16px',
//     padding: '3px', // Thin border gap
//     boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)'
//   }}>
//     <div style={{ background: '#ffffff', borderRadius: '13px', padding: THEME.pad.lg }}>
//       <h3 style={{ fontWeight: '700', color: '#3730a3', marginBottom: THEME.pad.md, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}>
//         <BarChart2 color={THEME.primary} /> Training Status
//       </h3>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.sm }}>
//         {['Scheduled', 'Ongoing', 'Completed', 'Cancelled'].map((status, i) => {
//           const key = status.toLowerCase();
//           const val = viewData?.by_status?.[key] || 0;
//           const colors = [THEME.primary, THEME.warning, THEME.success, THEME.danger];
//           const c = colors[i];
//           const total = summary?.total_trainings || 1;
//           const pct = Math.round((val / total) * 100);

//           return (
//             <div key={i} style={{
//               display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${THEME.pad.sm} ${THEME.pad.md}`,
//               background: '#f8fafc', borderRadius: '8px', border: '1px solid #f3f4f6'
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: THEME.gap.sm }}>
//                 <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: c }}></div>
//                 <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{status}</span>
//               </div>
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>{val}</div>
//                 <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', marginTop: '1px' }}>{pct}%</div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   </div>
// );

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { dashboardService } from '../../services/dashboardService';
import { locationService } from '../../services/locationService';
import { Users, BookOpen, MapPin, Calendar, Filter, TrendingUp, Table, BarChart2, User, Map as MapIcon } from 'lucide-react';
import { trainingService } from '../../services/trainingService';

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

// ===== ENHANCED SMOOTH MAP COMPONENT WITH GEOJSON =====
const TraineeLocationMap = ({ locationsData, trainingLocations }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
          width: 24px;
          height: 24px;
          background: ${THEME.primary};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

  return (
    <div style={{ ...THEME.glass, padding: THEME.pad.lg, height: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: THEME.gap.xl }}>

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

