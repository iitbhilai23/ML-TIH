import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, AlertCircle, KeyRound, ShieldCheck, User, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

// ===== WAVY LIQUID CANVAS + INTERACTIVE PURPLE PARTICLE JS =====
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

            // Render Soft Glowing Bokeh Orbs
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

            // Render Wavy Liquid Waves
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

            // Render Shockwaves
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

            // Render Particles & Web
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

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
};

// ===== ELEGANT THEME =====
const THEME = {
    primary: '#6366f1',
    primaryLight: '#e0e7ff',
    success: '#10b981',
    danger: '#ef4444',

    bgGradient: 'linear-gradient(-45deg, #f8fafc, #f1f5f9, #fdfbf7, #f0fdf4)',

    glass: {
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.12), 0 8px 24px -10px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 10
    },

    inputWrapper: {
        width: '100%',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 16px',
        position: 'relative',
        border: '1.5px solid #e2e8f0',
        borderRadius: '14px',
        background: 'white',
        transition: 'all 0.2s ease',
        overflow: 'hidden'
    },

    input: {
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: '0.95rem',
        fontWeight: '500',
        color: '#334155',
        paddingLeft: '0',
        paddingRight: '0'
    },

    iconBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '6px',
        transition: 'color 0.2s ease, background 0.2s ease'
    }
};

const ForgotPassword = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!usernameOrEmail.trim()) {
            setMessage('Please enter your Username or Email address.');
            return;
        }

        if (!newPassword || !confirmPassword) {
            setMessage('Please enter and confirm your new password.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('New password and confirm password do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('New password must be at least 6 characters long.');
            return;
        }

        try {
            setLoading(true);

            const response = await api.post('/admin/forgot-password', {
                usernameOrEmail: usernameOrEmail.trim(),
                newPassword
            });

            setIsSuccess(true);
            setMessage(response.data?.message || 'Password reset successfully!');
            setUsernameOrEmail('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Failed to reset password. Please check your username or email address.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetForm = () => {
        setIsSuccess(false);
        setMessage('');
        setUsernameOrEmail('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 16px',
            background: THEME.bgGradient,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Interactive Particle JS Canvas Background */}
            <WavyParticleCanvas />

            {/* ===== CARD ===== */}
            <div style={{ ...THEME.glass, width: '100%', maxWidth: '520px', padding: '36px' }}>

                {/* Success State */}
                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '50%',
                            background: THEME.success,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                        }}>
                            <Check size={38} strokeWidth={2.5} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                            Password Reset Complete!
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 28px 0', lineHeight: '1.5' }}>
                            {message}
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/login" style={{
                                color: 'white',
                                fontWeight: '600',
                                textDecoration: 'none',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: THEME.primary,
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                transition: 'transform 0.2s ease'
                            }}>
                                Proceed to Login
                            </Link>

                            <button
                                onClick={handleResetForm}
                                style={{
                                    color: '#475569',
                                    fontWeight: '600',
                                    padding: '12px 20px',
                                    borderRadius: '12px',
                                    background: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Reset Another
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header Icon */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: THEME.primaryLight,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
                            }}>
                                <KeyRound size={32} style={{ color: THEME.primary }} />
                            </div>
                        </div>

                        {/* Form Header */}
                        <div style={{ padding: '0 10px' }}>
                            <h2 style={{
                                fontSize: '1.4rem',
                                fontWeight: '700',
                                color: '#1e293b',
                                marginBottom: '6px',
                                textAlign: 'center'
                            }}>
                                Forgot Password
                            </h2>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#64748b',
                                textAlign: 'center',
                                marginBottom: '28px',
                                marginTop: '0'
                            }}>
                                Enter your username or email address and set your new password
                            </p>

                            {/* Error Alert Message */}
                            {message && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: '#fef2f2',
                                    color: THEME.danger,
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    marginBottom: '20px',
                                    border: '1px solid #fecaca',
                                    fontWeight: '500',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.05)'
                                }}>
                                    <AlertCircle size={20} style={{ flexShrink: 0 }} />
                                    <span>{message}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                                {/* 1. Username or Email Row */}
                                <div>
                                    <label style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: '#334155',
                                        marginBottom: '6px',
                                        display: 'block',
                                        paddingLeft: '4px'
                                    }}>
                                        Username or Email Address
                                    </label>

                                    <div style={THEME.inputWrapper}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <User size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                        <input
                                            type="text"
                                            value={usernameOrEmail}
                                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                                            placeholder="Enter username or registered email"
                                            style={THEME.input}
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>

                                {/* 2. New Password Row */}
                                <div>
                                    <label style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: '#334155',
                                        marginBottom: '6px',
                                        display: 'block',
                                        paddingLeft: '4px'
                                    }}>
                                        New Password
                                    </label>

                                    <div style={THEME.inputWrapper}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <ShieldCheck size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password (min. 6 characters)"
                                            style={THEME.input}
                                            autoComplete="new-password"
                                        />
                                        <div style={THEME.iconBox} onClick={() => setShowNew(!showNew)}>
                                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Confirm New Password Row */}
                                <div>
                                    <label style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: '#334155',
                                        marginBottom: '6px',
                                        display: 'block',
                                        paddingLeft: '4px'
                                    }}>
                                        Confirm New Password
                                    </label>

                                    <div style={THEME.inputWrapper}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <ShieldCheck size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter new password"
                                            style={THEME.input}
                                            autoComplete="new-password"
                                        />
                                        <div style={THEME.iconBox} onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        height: '50px',
                                        background: loading ? '#cbd5e1' : `linear-gradient(135deg, ${THEME.primary} 0%, #8b5cf6 100%)`,
                                        color: 'white',
                                        padding: '0 20px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: loading ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginTop: '10px',
                                        letterSpacing: '0.3px'
                                    }}
                                >
                                    {loading ? 'Resetting Password...' : 'Reset Password'}
                                    {!loading && <Lock size={18} />}
                                </button>
                            </form>

                            {/* Back to Login link */}
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <Link to="/login" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: THEME.primary,
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    textDecoration: 'none'
                                }}>
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
