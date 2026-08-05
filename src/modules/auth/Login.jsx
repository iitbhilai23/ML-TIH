import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, TrendingUp, Eye, EyeOff, Sparkles, Award, Users, MapPin, CheckCircle2, BookOpen } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import styles from './Login.module.css';
import loginimg from '../../assets/loginimg.png';

// Literacy & Education Themed Floating Canvas Background (Books, Caps & Knowledge Sparks)
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

    // 1. Soft Ambient Glowing Orbs
    const orbs = [
      { x: width * 0.2, y: height * 0.3, radius: 280, hue: 250, vx: 0.12, vy: 0.08, pulseSpeed: 0.005 },
      { x: width * 0.8, y: height * 0.4, radius: 320, hue: 270, vx: -0.08, vy: 0.12, pulseSpeed: 0.004 },
      { x: width * 0.5, y: height * 0.7, radius: 350, hue: 280, vx: 0.08, vy: -0.1, pulseSpeed: 0.006 }
    ];

    // 2. Floating Literacy & Education Elements (Books, Mortarboards, Knowledge Sparks)
    const elements = [];
    const numElements = Math.min(Math.floor((width * height) / 25000), 28);
    const types = ['book', 'cap', 'spark', 'dot'];

    for (let i = 0; i < numElements; i++) {
      elements.push({
        type: types[i % types.length],
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 10,
        vy: - (Math.random() * 0.35 + 0.15), // Slow upward drift
        vx: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        alpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Mouse Spotlight
    const mouse = { x: null, y: null, targetX: null, targetY: null };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = null;
      mouse.targetY = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let step = 0;

    // Helper: Draw Open Book Symbol
    const drawBook = (x, y, size, alpha, rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-size, -size * 0.3);
      ctx.quadraticCurveTo(-size * 0.4, -size * 0.6, 0, -size * 0.2);
      ctx.quadraticCurveTo(size * 0.4, -size * 0.6, size, -size * 0.3);
      ctx.lineTo(size, size * 0.4);
      ctx.quadraticCurveTo(size * 0.4, size * 0.1, 0, size * 0.5);
      ctx.quadraticCurveTo(-size * 0.4, size * 0.1, -size, size * 0.4);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -size * 0.2);
      ctx.lineTo(0, size * 0.5);
      ctx.stroke();
      ctx.restore();
    };

    // Helper: Draw Graduation Cap Symbol
    const drawCap = (x, y, size, alpha, rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.5);
      ctx.lineTo(size * 0.85, 0);
      ctx.lineTo(0, size * 0.5);
      ctx.lineTo(-size * 0.85, 0);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-size * 0.4, size * 0.25);
      ctx.quadraticCurveTo(0, size * 0.6, size * 0.4, size * 0.25);
      ctx.stroke();
      ctx.restore();
    };

    // Helper: Draw Spark / Star of Wisdom
    const drawSpark = (x, y, size, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(192, 132, 252, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.lineTo(0, -size);
        ctx.quadraticCurveTo(0, 0, size * 0.3, 0);
      }
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.01;

      // Mouse position smoothing
      if (mouse.targetX !== null && mouse.targetY !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.05;
          mouse.y += (mouse.targetY - mouse.y) * 0.05;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // --- A. Render Ambient Glowing Background Orbs ---
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -150) orb.vx *= -1;
        if (orb.x > width + 150) orb.vx *= -1;
        if (orb.y < -150) orb.vy *= -1;
        if (orb.y > height + 150) orb.vy *= -1;

        const pulse = Math.sin(step * orb.pulseSpeed * 60) * 30;
        const currentRadius = Math.max(50, orb.radius + pulse);

        const orbGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentRadius);
        orbGrad.addColorStop(0, `hsla(${orb.hue}, 75%, 75%, 0.12)`);
        orbGrad.addColorStop(0.5, `hsla(${orb.hue}, 70%, 70%, 0.05)`);
        orbGrad.addColorStop(1, `hsla(${orb.hue}, 60%, 60%, 0)`);

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- B. Render Soft Mouse Knowledge Glow ---
      if (mouse.x !== null && mouse.y !== null) {
        const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        mouseGrad.addColorStop(0, 'rgba(147, 51, 234, 0.12)');
        mouseGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
        mouseGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');

        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- C. Render Wavy Liquid Waves at Bottom ---
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.sin(x * 0.002 + step) * 22 + Math.cos(x * 0.001 + step * 0.6) * 16 + (height - 95);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(238, 242, 255, 0.5)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.sin(x * 0.0028 - step * 1.1) * 26 + Math.sin(x * 0.0015 + step) * 18 + (height - 65);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(224, 231, 255, 0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.cos(x * 0.0025 + step * 0.8) * 18 + (height - 40);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(243, 232, 255, 0.7)';
      ctx.fill();

      // --- D. Render Floating Educational & Literacy Symbols ---
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        el.y += el.vy;
        el.x += el.vx;
        el.rotation += el.rotationSpeed;

        if (el.y < -30) {
          el.y = height + 30;
          el.x = Math.random() * width;
        }
        if (el.x < 0 || el.x > width) el.vx *= -1;

        const currentAlpha = Math.sin(step * el.pulseSpeed * 50 + el.pulsePhase) * 0.15 + el.alpha;
        const validAlpha = Math.max(0.1, currentAlpha);

        if (el.type === 'book') {
          drawBook(el.x, el.y, el.size, validAlpha, el.rotation);
        } else if (el.type === 'cap') {
          drawCap(el.x, el.y, el.size, validAlpha, el.rotation);
        } else if (el.type === 'spark') {
          drawSpark(el.x, el.y, el.size * 0.8, validAlpha);
        } else {
          // Soft Glowing Speck
          ctx.beginPath();
          ctx.arc(el.x, el.y, el.size * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 51, 234, ${validAlpha})`;
          ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
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
                <Link to="/forgot-password" className={styles.forgotLink}>
                  Forgot Password?
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
