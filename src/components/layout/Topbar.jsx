import { useAuth } from '../../context/AuthContext';
import content from '../../utils/content';
import styles from './Layout.module.css';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header
      className={styles.header}
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderBottom: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 6px 24px -6px rgba(0,0,0,0.04)',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div className={styles.headerLeft} style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <h3
          className={styles.headerTitle}
          style={{
            fontSize: '1.29rem',
            fontWeight: '700',
            margin: 0,
            color: 'transparent',
            background: 'linear-gradient(135deg, #7b3f99 0%, #6a0dad 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {content.appSubtitle}
        </h3>
      </div>

      <div
        className={styles.userProfile}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '5px 18px 5px 8px',
          background: 'rgba(255,255,255,0.55)',
          borderRadius: '50px',
          border: '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.55)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div
          className={styles.avatar}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7b3f99, #f43f5e)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(0,0,0,0.12)'
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>

        <span style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.97rem', whiteSpace: 'nowrap' }}>
          {user?.name || 'Admin'}
        </span>
      </div>
    </header>

  );
};

export default Topbar;