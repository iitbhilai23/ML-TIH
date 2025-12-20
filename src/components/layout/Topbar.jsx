
import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import content from '../../utils/content';
import styles from './Layout.module.css';

const Topbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.mobileToggle} onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <h3 className={styles.headerTitle}>{content.appSubtitle}</h3>
      </div>
      <div className={styles.userProfile}>
        <span>{user?.name || 'Admin'}</span>
        <div className={styles.avatar}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
      </div>
    </header>
  );
};

export default Topbar;