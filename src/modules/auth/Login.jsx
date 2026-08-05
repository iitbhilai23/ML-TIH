import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, TrendingUp, Eye, EyeOff, Sparkles, Award, Users, MapPin, CheckCircle2, BookOpen } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import styles from './Login.module.css';
import loginimg from '../../assets/loginimg.png';

// Wavy Liquid Canvas + Interactive Purple Particle JS
const WavyParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create particles
    const numParticles = Math.min(Math.floor((width * height) / 18000), 70);
    const particles = [];

    const colors = [
      'rgba(124, 58, 237, ',
      'rgba(147, 51, 234, ',
      'rgba(168, 85, 247, ',
      'rgba(192, 132, 252, ',
      'rgba(217, 70, 239, '
    ];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 2.2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.25
      });
    }

    const mouse = { x: null, y: null, radius: 140 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.012;

      // 1. Draw Multi-Layered Wavy Liquid Bottom Gradients
      // Layer 1 (Deepest Wave)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.sin(x * 0.002 + step) * 28 + Math.cos(x * 0.001 + step * 0.6) * 18 + (height - 110);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(233, 213, 255, 0.45)';
      ctx.fill();

      // Layer 2 (Mid Soft Wave)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.sin(x * 0.003 - step * 1.1) * 32 + Math.sin(x * 0.0015 + step) * 22 + (height - 75);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(192, 132, 252, 0.22)';
      ctx.fill();

      // Layer 3 (Foreground Ultra Light Wave)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.cos(x * 0.0025 + step * 0.8) * 24 + (height - 45);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(243, 232, 255, 0.6)';
      ctx.fill();

      // 2. Draw Interactive Purple Particle JS Dots & Connecting Lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Mouse connection
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const lineAlpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `${p.color}${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Particle to particle connection
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
};

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(credentials.username, credentials.password);

      if (result.success) {
        toast.success('Login Successful', {
          duration: 2000,
          position: 'top-center'
        });

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 800);
      } else {
        toast.error(result.message || 'Login failed. Please check credentials.');
        setError(result.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Toaster richColors position="top-center" />
      <WavyParticleCanvas />

      {/* Main Content Layout Container */}
      <div className={styles.contentWrapper}>

        {/* Left Side: Prominent Hero Training Showcase Card */}
        <div className={styles.brandSide}>
          <div className={styles.heroCard}>
            
            {/* Top Branding Header */}
            <div className={styles.heroHeader}>
              <div className={styles.portalTag}>
                <Award size={14} color="#7c3aed" /> Women Empowerment & Training Portal
              </div>
              <h1 className={styles.brandTitle}>Marketplace Literacy</h1>
              <h2 className={styles.brandSubtitle}>Chhattisgarh</h2>
            </div>

            {/* Prominent Classroom Training Image Frame */}
            <div className={styles.imageFrame}>
              <img
                src={loginimg}
                alt="Women Marketplace Literacy Training Session in Chhattisgarh"
                className={styles.brandImage}
              />
              <div className={styles.imageOverlay} />
              <div className={styles.imageBadge}>
                <BookOpen size={15} color="#ffffff" /> Live Field Training Sessions
              </div>
            </div>

            {/* Feature Tagline & Metrics */}
            <p className={styles.brandTagline}>
              Empowering women through financial education, digital literacy & entrepreneurship skills across Chhattisgarh.
            </p>

            <div className={styles.metricGrid}>
              <div className={styles.metricChip}>
                <Users size={18} color="#7c3aed" />
                <div>
                  <div className={styles.chipNumber}>21,500+</div>
                  <div className={styles.chipLabel}>Women Trained</div>
                </div>
              </div>

              <div className={styles.metricChip}>
                <MapPin size={18} color="#9333ea" />
                <div>
                  <div className={styles.chipNumber}>33 Districts</div>
                  <div className={styles.chipLabel}>Statewide Reach</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Pristine Floating Login Card */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            
            <div className={styles.formHeader}>
              <div className={styles.cardLogo}>
                <TrendingUp size={28} color="#ffffff" />
              </div>
              <h2 className={styles.title}>Welcome Back</h2>
              <p className={styles.subtitle}>Login to continue</p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>Username</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.icon} />
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter Username"
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.icon} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className={styles.optionsRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/change-password" className={styles.forgotLink}>
                  Change Password?
                </Link>
              </div>

              <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
              </button>
            </form>

            <div className={styles.cardFooter}>
              <MapPin size={13} color="#7c3aed" /> &copy; 2026 Marketplace Literacy Chhattisgarh
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
