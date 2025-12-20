
import React from 'react';
import { Menu } from 'lucide-react';
import styles from './Layout.module.css';
import content from '../../utils/content';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onToggleSidebar }) => {
    const { user } = useAuth();
    
    // Fallback initials
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'A';
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                {/* Mobile Hamburger Toggle */}
                <button className={styles.mobileToggle} onClick={onToggleSidebar}>
                    <Menu size={24} />
                </button>
                <h3 className={styles.headerTitle}>{content.appSubtitle}</h3>
            </div>

            <div className={styles.headerRight}>
                <div className="hidden md:block text-right mr-2">
                     <span className={styles.userName}>{user?.name || 'Administrator'}</span>
                     <span className={styles.userRole}>Super Admin</span>
                </div>
                <div className={styles.avatar}>
                    {getInitials(user?.name)}
                </div>
            </div>
        </header>
    );
};

export default Header;