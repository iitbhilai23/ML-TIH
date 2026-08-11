import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import content from '../../utils/content';
import styles from './Layout.module.css';
import { useMatchPath } from '../../hooks/useMatchPath';

const SidebarItem = ({ item, onClick, isCollapsed }) => {
  const Icon = item.icon;
  const isActive = useMatchPath(item.path);

  return (
    <div className={styles.navItemWrapper}>
      <NavLink
        to={item.path}
        className={({ isActive: navActive }) =>
          clsx(styles.navItem, (isActive || navActive) && styles.navItemActive)
        }
        onClick={onClick}
      >
        <span className={styles.iconWrapper}>
          <Icon size={19} />
        </span>
        {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
      </NavLink>

      <div className={styles.tooltip}>{item.label}</div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose, onToggleSidebar, isCollapsed }) => {
  const location = useLocation();
  const topNav = content.nav.filter(item => !item.bottom);
  const bottomNav = content.nav.filter(item => item.bottom);

  const handleItemClick = () => {
    if (!isCollapsed) return;
    onClose();
  };

  return (
    <aside
      className={clsx(
        styles.sidebar,
        isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded,
        isOpen && styles.sidebarOpen
      )}
    >
      {/* Brand Header with Gradient Finish */}
      <div className={styles.brand}>
        <div className={styles.brandContent}>
          <div className={styles.logoBadge}>
            <Sparkles size={18} color="#ffffff" />
          </div>
          {!isCollapsed && (
            <div className={styles.titleWrap}>
              <span className={styles.portalTitle}>CG Portal</span>
              <span className={styles.portalSubtitle}>Training System</span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button className={styles.mobileToggle} onClick={onToggleSidebar} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className={styles.divider} />

      {/* Main Navigation */}
      <nav className={styles.navMenu}>
        {topNav.map(item => (
          <SidebarItem key={item.path} item={item} onClick={handleItemClick} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        {bottomNav.map(item => (
          <SidebarItem key={item.path} item={item} onClick={handleItemClick} isCollapsed={isCollapsed} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
