import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
        <Icon size={20} />
        {!isCollapsed && <span>{item.label}</span>}
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
      <div className={styles.brand}>
        {/* CG title when open */}
        {!isCollapsed && <span className={styles.portalTitle}>CG Training Portal</span>}

        {/* Toggle button shows Menu or X based on state */}
        <button className={styles.mobileToggle} onClick={onToggleSidebar}>
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>


      <nav className={styles.navMenu}>
        {topNav.map(item => (
          <SidebarItem key={item.path} item={item} onClick={handleItemClick} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <div className={styles.bottomNav}>
        {bottomNav.map(item => (
          <SidebarItem key={item.path} item={item} onClick={handleItemClick} isCollapsed={isCollapsed} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
