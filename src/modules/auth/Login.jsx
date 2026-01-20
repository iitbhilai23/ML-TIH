import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import content from '../../utils/content';
import { Lock, User, ArrowRight, Users, BookOpen, MapPin, TrendingUp, CheckCircle, Eye, EyeOff, Sparkles, Quote, Award, Heart } from 'lucide-react';
import styles from './Login.module.css';
import loginimg from '../../assets/loginimg.png'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
      {/* Left Side: Login Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <TrendingUp size={32} />
              </div>
            </div>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Please sign in to your account</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <div className={styles.inputWrapper}>
                <User size={20} className={styles.icon} />
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordLabel}>
                <label htmlFor="password" className={styles.label}>Password</label>
                {/* <a href="#" className={styles.forgotLink}>Forgot password?</a> */}
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={20} className={styles.icon} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

              </div>

            </div>
            <a href="#" className={styles.forgotLink}>Forgot password?</a>
            <div className={styles.checkboxGroup}>
              {/* <input id="remember" name="remember" type="checkbox" className={styles.checkbox} /> */}
              {/* <label htmlFor="remember" className={styles.checkboxLabel}>Remember me for 30 days</label> */}
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              {!isLoading && <ArrowRight size={20} className={styles.btnIcon} />}
            </button>
          </form>

          <div className={styles.footer}>
            &copy; 2025 Marketplace Literacy Chhattisgarh. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side: Branding & Info */}
      <div className={styles.brandSide}>
        <div className={styles.brandingContent}>
          <div className={styles.brandHeader}>
            <h1 className={styles.brandTitle}>Marketplace Literacy</h1>
            <h2 className={styles.brandSubtitle}>Chhattisgarh</h2>
          </div>

          <p className={styles.brandTagline}>Empowering women through financial education and entrepreneurship skills</p>

          <div className={styles.imageSection}>
            <div className={styles.imageDecorations}>

            </div>

            <div className={styles.imageContainer}>
              <div className={styles.imageFrame}>
                <div className={styles.imageGlow}></div>
                <div ></div>
                <img
                  src={loginimg}
                  alt="Women empowerment through education"
                  className={styles.brandImage}

                />
                <div className={styles.imageCornerDecor}>
                  <Sparkles size={20} className={styles.cornerIcon} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.featureHighlights}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <BookOpen size={24} />
              </div>
              <div className={styles.featureText}>
                <h4>Financial Education</h4>
                <p>Comprehensive training programs</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Users size={24} />
              </div>
              <div className={styles.featureText}>
                <h4>Community Building</h4>
                <p>Strong network of empowered women</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.animatedBg}></div>
      </div>
    </div>
  );
};

export default Login;