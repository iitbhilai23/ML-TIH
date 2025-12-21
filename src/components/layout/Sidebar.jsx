import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
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

      {/* Tooltip on hover - always visible */}
      <div className={styles.tooltip}>
        {item.label}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose, isCollapsed }) => {
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
        isCollapsed && styles.sidebarCollapsed,
        isOpen && styles.sidebarOpen
      )}
    >
      <div className={styles.brand}>
        {!isCollapsed && <span>{content.appTitle}</span>}
        <button onClick={onClose} className={styles.closeBtn}>
          <X size={24} />
        </button>
      </div>

      <nav className={styles.navMenu}>
        {topNav.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={location.pathname.startsWith(item.path)}
            onClick={handleItemClick}
          />
        ))}
      </nav>

      <div className={styles.bottomNav}>
        {bottomNav.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            onClick={handleItemClick}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;