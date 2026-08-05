import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, TrendingUp, Eye, EyeOff, Sparkles, Award, Users, MapPin, CheckCircle2, BookOpen } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import styles from './Login.module.css';
import loginimg from '../../assets/loginimg.png';

// Wavy Liquid Canvas + Glowing Constellation & Interactive Particle JS
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

    // 1. Background Glowing Bokeh Orbs
    const numOrbs = 8;
    const orbs = [];
    for (let i = 0; i < numOrbs; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 90 + 60,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        hue: 250 + Math.random() * 45,
        pulseSpeed: 0.008 + Math.random() * 0.012,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // 2. Interactive Constellation Particles
    const numParticles = Math.min(Math.floor((width * height) / 14000), 85);
    const particles = [];
    const colorPalette = [
      { r: 99, g: 102, b: 241 },   // Indigo
      { r: 139, g: 92, b: 246 },   // Violet
      { r: 168, g: 85, b: 247 },   // Purple
      { r: 217, g: 70, b: 239 },   // Fuchsia
      { r: 59, g: 130, b: 246 }    // Sky Blue accent
    ];

    for (let i = 0; i < numParticles; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: (Math.random() - 0.5) * 0.6,
        baseVy: (Math.random() - 0.5) * 0.6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 1.2,
        color,
        alpha: Math.random() * 0.5 + 0.35,
        pulse: Math.random() * Math.PI
      });
    }

    // Mouse & Click Interaction
    const mouse = { x: null, y: null, radius: 160 };
    const shockwaves = [];

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleClick = (e) => {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 180,
        alpha: 0.8
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.014;

      // --- A. Render Soft Glowing Bokeh Orbs ---
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100) orb.x = width + 100;
        if (orb.x > width + 100) orb.x = -100;
        if (orb.y < -100) orb.y = height + 100;
        if (orb.y > height + 100) orb.y = -100;

        const pulseAlpha = Math.sin(step * orb.pulseSpeed * 50 + orb.pulsePhase) * 0.06 + 0.12;

        const orbGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        orbGrad.addColorStop(0, `hsla(${orb.hue}, 80%, 70%, ${pulseAlpha})`);
        orbGrad.addColorStop(1, `hsla(${orb.hue}, 80%, 70%, 0)`);

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- B. Render Wavy Liquid Waves at Bottom ---
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.sin(x * 0.002 + step) * 26 + Math.cos(x * 0.0012 + step * 0.7) * 20 + (height - 110);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(233, 213, 255, 0.45)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.sin(x * 0.003 - step * 1.2) * 30 + Math.sin(x * 0.0018 + step) * 22 + (height - 75);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = Math.cos(x * 0.0028 + step * 0.9) * 22 + (height - 45);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(243, 232, 255, 0.65)';
      ctx.fill();

      // --- C. Render Shockwaves ---
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 5;
        sw.alpha -= 0.02;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${sw.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // --- D. Render Particles and Connections ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 0.8;
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }
        }

        p.vx = p.vx * 0.96 + p.baseVx * 0.04;
        p.vy = p.vy * 0.96 + p.baseVy * 0.04;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.baseVx *= -1;
        if (p.y < 0 || p.y > height) p.baseVy *= -1;

        const currentAlpha = Math.sin(step * 2 + p.pulse) * 0.15 + p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.6)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const lineAlpha = (1 - dist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${lineAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            const lineAlpha = (1 - dist / 125) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
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
      window.removeEventListener('click', handleClick);
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
