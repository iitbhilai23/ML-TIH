import React from 'react';
import { useAuth } from '../../context/AuthContext';
import content from '../../utils/content';
import styles from './Layout.module.css';
import { Sparkles, ShieldCheck } from 'lucide-react';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Sparkles size={16} color="#ffffff" />
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              margin: 0,
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            Marketplace Literacy{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
              }}
            >
              Chhattisgarh
            </span>
          </h3>
        </div>
      </div>

      {/* User Profile Badge */}
      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.92rem', whiteSpace: 'nowrap' }}>
            {user?.name || 'Super Admin'}
          </span>
          <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={11} color="#7c3aed" /> System Administrator
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;