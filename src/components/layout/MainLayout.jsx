
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import content from '../../utils/content';
import { LogOut } from 'lucide-react';
import styles from './Layout.module.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // ← starts collapsed
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Auto-close sidebar on resize > mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.appContainer}>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className={styles.overlay} onClick={closeSidebar} />}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isCollapsed={sidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <Topbar onToggleSidebar={toggleSidebar} />

        <main className={styles.contentArea}>
          <Outlet />
        </main>

        {/* Logout Button in Bottom Nav */}
        {sidebarCollapsed && (
          <div className={styles.collapsedLogout}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              {/* <LogOut size={20} /> */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;