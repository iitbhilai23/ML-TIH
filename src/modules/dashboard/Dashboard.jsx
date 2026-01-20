import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';

// Leaflet icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const Dashboard = () => {
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);

  // GeoJSON state
  const [districtGeoJSON, setDistrictGeoJSON] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://localhost:5058/api/reports/districts', { headers })
      .then(res => setDistricts(res.data));
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`http://localhost:5058/api/reports/blocks?district_cd=${selectedDistrict}`, { headers })
        .then(res => setBlocks(res.data));
    } else {
      setBlocks([]);
    }
    fetchReport();
  }, [selectedDistrict, selectedBlock, fromDate, toDate]);

  const fetchReport = () => {
    setLoading(true);
    const params = {};
    if (selectedDistrict) params.district_cd = selectedDistrict;
    if (selectedBlock) params.block_cd = selectedBlock;
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;

    axios.get('http://localhost:5058/api/reports/dashboard', { headers, params })
      .then(res => {
        setReportData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const toggleFullScreenMap = () => {
    setIsFullScreenMap(!isFullScreenMap);
  };

  // Load Chhattisgarh district GeoJSON (border ke liye)
  useEffect(() => {
    fetch('http://127.0.0.1:4001/files/Map/topojsons/states/District_geo.json') 
      .then(r => r.json())
      .then(data => setDistrictGeoJSON(data))
      .catch(err => console.error('GeoJSON load error:', err));
  }, []);

  // District GeoJSON style
  const districtStyle = {
    fillColor: '#bbdefb',
    fillOpacity: 0.4,
    color: '#1e293b',
    weight: 2,
  };

  const districtHoverStyle = {
    fillColor: '#90caf9',
    fillOpacity: 0.7,
    color: '#1976d2',
    weight: 4,
  };

  const onEachDistrict = (feature, layer) => {
    const districtName = feature.properties?.District_N || feature.properties?.District || 'Unknown';
    layer.bindTooltip(districtName, { sticky: true });

    layer.on({
      mouseover: () => layer.setStyle(districtHoverStyle),
      mouseout: () => layer.setStyle(districtStyle),
      click: () => {
        mapRef.current.fitBounds(layer.getBounds(), { padding: [50, 50] });
      },
    });
  };

  const attendanceRate = Math.round((reportData.attendanceStats?.[0]?.count / reportData.totalParticipants * 100) || 0);
  const avgParticipants = Math.round(reportData.totalParticipants / reportData.totalTrainings) || 0;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Training Dashboard - Chhattisgarh</h1>
        <div className="report-date">Report Date: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Filters */}
      {/* <div className="filter-bar">
        <div className="filter-group">
          <label>District</label>
          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
            <option value="">All Districts</option>
            {districts.map(d => <option key={d.district_cd} value={d.district_cd}>{d.district_name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Block</label>
          <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)} disabled={!selectedDistrict}>
            <option value="">All Blocks</option>
            {blocks.map(b => <option key={b.block_cd} value={b.block_cd}>{b.block_name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>To Date</label>
          <input 
  type="date" 
  value={toDate} 
  onChange={(e) => setToDate(e.target.value)} 
/>
        </div>
        <button onClick={fetchReport} className="apply-btn">Apply</button>
      </div> */}

      <div className="filter-bar">
  <div className="filter-group">
    <label>District</label>
    <select value={selectedDistrict} onChange={(e) => {
      setSelectedDistrict(e.target.value);
      setSelectedBlock('');
    }}>
      <option value="">All Districts</option>
      {districts.map(d => <option key={d.district_cd} value={d.district_cd}>{d.district_name}</option>)}
    </select>
  </div>

  <div className="filter-group">
    <label>Block</label>
    <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)} disabled={!selectedDistrict}>
      <option value="">All Blocks</option>
      {blocks.map(b => <option key={b.block_cd} value={b.block_cd}>{b.block_name}</option>)}
    </select>
  </div>

  <div className="filter-group">
    <label>From Date</label>
    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
  </div>

  <div className="filter-group">
    <label>To Date</label>
    <input 
      type="date" 
      value={toDate} 
      onChange={(e) => setToDate(e.target.value)}   // <-- Ye line sahi kar di
    />
  </div>

  <button onClick={fetchReport} className="apply-btn">
    Apply Filter
  </button>
</div>

      {/* KPI Row 1 */}
      <div className="kpi-row">
        <div className="kpi-card blue">
          <p>Total Users (Participants)</p>
          <h2>{reportData.totalParticipants || 0}</h2>
        </div>
        <div className="kpi-card cyan">
          <p>Sessions (Trainings)</p>
          <h2>{reportData.totalTrainings || 0}</h2>
        </div>
           <div className="kpi-card pink">
          <p>Total Trainers</p>
          <h2>{reportData.totalTrainers || 0}</h2>
        </div>
        <div className="kpi-card green">
          <p>Avg Engagement (Avg Participants)</p>
          <h2>{avgParticipants}</h2>
        </div>
        <div className="kpi-card light-green">
          <p>Attendance Rate</p>
          <h2>{attendanceRate}%</h2>
        </div>
     
        {/* <div className="kpi-card purple">
          <p>Revenue (ROAS Placeholder)</p>
          <h2>185.38%</h2>
        </div> */}
      </div>

      {/* KPI Row 2 */}
      {/* <div className="kpi-row">
        <div className="kpi-card blue">
          <p>Impressions</p>
          <h2>453.8K</h2>
        </div>
        <div className="kpi-card cyan">
          <p>Clicks</p>
          <h2>5.5K</h2>
        </div>
        <div className="kpi-card green">
          <p>CTR</p>
          <h2>1.22%</h2>
        </div>
        <div className="kpi-card light-green">
          <p>CPM</p>
          <h2>3.30</h2>
        </div>
        <div className="kpi-card pink">
          <p>CPC</p>
          <h2>0.27</h2>
        </div>
        <div className="kpi-card purple">
          <p>ROAS</p>
          <h2>185.38%</h2>
        </div>
      </div> */}

      {/* Main Row */}
      <div className="main-row">
        {/* Pie Chart */}
        {/* <div className="pie-card">
          <h3>Attendance by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportData.attendanceStats || []}
                dataKey="count"
                nameKey="attendance_status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                label
              >
                {reportData.attendanceStats?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div> */}


        {/* Map Card */}
      {/* <div className={`map-card${isFullScreenMap ? ' full-screen' : ''}`}>
        <h3>Reach by Country</h3> 
        <button onClick={toggleFullScreenMap} className="full-screen-btn">
          {isFullScreenMap ? 'Exit' : 'Full Screen'}
        </button>
        <div className="map-wrapper">
          <MapContainer center={[21.25, 81.62]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {reportData.mapData?.map((loc, index) => (
              loc.latitude && loc.longitude && (
                <Marker key={index} position={[loc.latitude, loc.longitude]}>
                  <Popup>
                    <div className="popup-content">
                     <img src={loc.photo_url || '/placeholder.jpg'} alt="Training" className="popup-photo" />
                      <h4>{loc.village}</h4>
                      <p><strong>Trainer:</strong> Placeholder</p>
                      <p><strong>Address:</strong> {loc.village}, {loc.block}, {loc.district}</p>
                      <p><strong>Total Participants:</strong> {loc.participants_count || 0}</p>
                      <p><strong>Trainings:</strong> {loc.trainings_count}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div> */}

      <div className={`map-card ${isFullScreenMap ? 'full-screen' : ''}`}>
  <div className="map-header">
    <h3>Training Locations Map</h3>
    <button onClick={toggleFullScreenMap} className="full-screen-btn">
      {isFullScreenMap ? '✕ Exit Full Screen' : '⛶ Full Screen'}
    </button>
  </div>
  <div className="map-wrapper">
    <MapContainer center={[21.25, 81.62]} zoom={7} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {reportData.mapData?.map((loc, index) => (
        loc.latitude && loc.longitude && (
          <Marker key={index} position={[loc.latitude, loc.longitude]}>
            <Popup>
              <div className="popup-content">
                <img src="/placeholder.jpg" alt="Training" className="popup-photo" />
                <h4>{loc.village || 'Unknown Village'}</h4>
                <p><strong>Trainer:</strong> Placeholder Trainer</p>
                <p><strong>Address:</strong> {loc.village}, {loc.block}, {loc.district}</p>
                <p><strong>Total Participants:</strong> {loc.participants_count || 0}</p>
                <p><strong>Trainings:</strong> {loc.trainings_count}</p>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  </div>
</div>

        {/* Bar Chart */}
        <div className="bar-card">
          <h3>Monthly Trainings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reportData.monthlyTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trainings" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="line-card">
          <h3>Avg Participants/Training</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reportData.monthlyTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="trainings" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="tables-row">
       
        <div className="table-card">
          <h3>Trainer Performance</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Trainings</th>
                <th>Avg Participants</th>
              </tr>
            </thead>
            <tbody>
              {reportData.trainerPerformance?.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.trainings_count}</td>
                  <td>{item.avg_participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         <div className="table-card">
          <h3>Participant Distribution</h3>
          <table>
            <thead>
              <tr>
                <th>Caste</th>
                <th>Education</th>
                <th>Category</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {reportData.participantDistribution?.map((item, i) => (
                <tr key={i}>
                  <td>{item.caste}</td>
                  <td>{item.education}</td>
                  <td>{item.category || 'N/A'}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;