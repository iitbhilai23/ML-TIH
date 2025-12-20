import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PublicReport.module.css';
import content from '../../utils/content'; // 👈 Importing content.js
import { Lock, Users, MapPin, BookOpen, BarChart2, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// --- MOCK DATA ---
const KPI_DATA = [
  { label: content.reports.kpi.beneficiaries, value: "12,450", color: "#4f46e5", icon: Users },
  { label: content.reports.kpi.completed, value: "345", color: "#10b981", icon: BookOpen },
  { label: content.reports.kpi.districts, value: "28", color: "#f59e0b", icon: MapPin },
  { label: content.reports.kpi.trainers, value: "85", color: "#ec4899", icon: Users },
];

const CHART_DATA = [
  { name: 'Raipur', trainees: 400 },
  { name: 'Bilaspur', trainees: 300 },
  { name: 'Durg', trainees: 200 },
  { name: 'Bastar', trainees: 278 },
  { name: 'Korba', trainees: 189 },
];

const PIE_DATA = [
  { name: 'Women', value: 60 },
  { name: 'Youth', value: 30 },
  { name: 'Others', value: 10 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const MAP_CENTER = [21.2787, 81.8661]; 

const PublicReport = () => {
  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logoArea}>
          <h1>{content.appTitle}</h1>
        </div>
        <Link to="/login" className={styles.loginBtn}>
          <Lock size={16} /> {content.common.adminLogin}
        </Link>
      </nav>

      <div className={styles.contentContainer}>
        
        {/* 2. Hero / Header */}
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
           <h2 style={{fontSize: '2rem', color: '#1e293b', fontWeight: 800}}>
             {content.reports.pageTitle}
           </h2>
           <p style={{color: '#64748b', fontSize: '1.1rem'}}>
             {content.reports.pageSubtitle}
           </p>
        </div>

        {/* 3. KPI Cards */}
        <div className={styles.statsGrid}>
          {KPI_DATA.map((item, index) => (
            <div key={index} className={styles.statCard} style={{borderBottomColor: item.color}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                 <div>
                    <div className={styles.statValue} style={{color: item.color}}>{item.value}</div>
                    <div className={styles.statLabel}>{item.label}</div>
                 </div>
                 <div style={{background: `${item.color}20`, padding: '10px', borderRadius: '50%'}}>
                    <item.icon size={24} color={item.color} />
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Charts Section */}
        <div className={styles.gridTwoCol}>
           
           {/* Bar Chart */}
           <div className={styles.chartBox}>
              <h3 className={styles.sectionTitle}>
                <BarChart2 size={20} color="#4f46e5"/> {content.reports.sections.charts}
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="trainees" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
           </div>

           {/* Pie Chart */}
           <div className={styles.chartBox}>
              <h3 className={styles.sectionTitle}>
                <Users size={20} color="#10b981"/> {content.reports.sections.demographics}
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 5. Map Section */}
        <div className={styles.chartBox} style={{height: '500px'}}>
            <h3 className={styles.sectionTitle}>
              <Globe size={20} color="#f59e0b"/> {content.reports.sections.map}
            </h3>
            <div className={styles.mapWrapper}>
                <MapContainer center={MAP_CENTER} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={[21.2514, 81.6296]}>
                    <Popup><strong>Raipur Center</strong></Popup>
                  </Marker>
                </MapContainer>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PublicReport;


