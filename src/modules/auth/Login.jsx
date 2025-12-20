import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import content from '../../utils/content'; 
import { Lock, User, ArrowRight } from 'lucide-react';
import styles from './Login.module.css'; 

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    
    try {
        const result = await login(credentials.username, credentials.password);
        if (result.success) {
          navigate('/admin/dashboard');
        } else {
          setError(result.message || 'Login failed. Please check credentials.');
        }
    } catch (err) {
        setError('Something went wrong. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginCard}>
        
        {/* === LEFT SIDE: FORM === */}
        <div className={styles.formSide}>
          <div className={styles.header}>
             <h2 className={styles.title}>{content.appTitle || 'Admin Portal'}</h2>
             <p className={styles.subtitle}>Welcome back! Please access your account.</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Username</label>
              <div className={styles.inputWrapper}>
                <User size={20} className={styles.icon} />
                <input 
                  type="text" 
                  name="username" 
                  value={credentials.username} 
                  onChange={handleChange}
                  placeholder="Enter username" 
                  required 
                  className={styles.input} 
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className={styles.label}>Password</label>
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={20} className={styles.icon} />
                <input 
                  type="password" 
                  name="password" 
                  value={credentials.password} 
                  onChange={handleChange}
                  placeholder="Enter password" 
                  required 
                  className={styles.input} 
                />
              </div>
              <div className={styles.forgotPass}>
                <a href="#" className={styles.forgotLink}>Forgot password?</a>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className={styles.footer}>
            &copy; 2025 Market Literacy Training System
          </div>
        </div>

        {/* === RIGHT SIDE: IMAGE === */}
        <div className={styles.imageSide}>
           <div className={styles.imageOverlay}>
              <h3 className={styles.imageTitle}>Empowering Communities</h3>
              <p className={styles.imageText}>
                {content.appSubtitle || 'Training Management System for Rural Development'}
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Login;