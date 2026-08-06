import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, AlertCircle, KeyRound, ShieldCheck, User, ArrowLeft, Award, Sparkles } from 'lucide-react';
import api from '../../services/api';

// ===== LITERACY & EDUCATION THEMED FLOATING CANVAS (BOOKS, CAPS & WISDOM SPARKS) =====
const LiteracyThemeCanvas = () => {
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
            { x: width * 0.2, y: height * 0.3, radius: 290, hue: 245, vx: 0.12, vy: 0.08, pulseSpeed: 0.005 },
            { x: width * 0.8, y: height * 0.4, radius: 330, hue: 270, vx: -0.08, vy: 0.12, pulseSpeed: 0.004 },
            { x: width * 0.5, y: height * 0.7, radius: 360, hue: 280, vx: 0.08, vy: -0.1, pulseSpeed: 0.006 }
        ];

        // 2. Floating Literacy & Education Elements (Books, Caps, Sparks, Specks)
        const elements = [];
        const numElements = Math.min(Math.floor((width * height) / 24000), 30);
        const types = ['book', 'cap', 'spark', 'dot'];

        for (let i = 0; i < numElements; i++) {
            elements.push({
                type: types[i % types.length],
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 12 + 10,
                vy: - (Math.random() * 0.35 + 0.15),
                vx: (Math.random() - 0.5) * 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.008,
                alpha: Math.random() * 0.4 + 0.22,
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

        // Draw Open Book Symbol
        const drawBook = (x, y, size, alpha, rot) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
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

        // Draw Graduation Cap Symbol
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

        // Draw Spark of Wisdom
        const drawSpark = (x, y, size, alpha) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
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

            // A. Background Glowing Orbs
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

            // B. Mouse Knowledge Glow
            if (mouse.x !== null && mouse.y !== null) {
                const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 230);
                mouseGrad.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
                mouseGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
                mouseGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

                ctx.fillStyle = mouseGrad;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 230, 0, Math.PI * 2);
                ctx.fill();
            }

            // C. Liquid Waves
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

            // D. Literacy Symbols
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

// ===== HIGH-END ATTRACTIVE LIGHT THEME TOKENS =====
const THEME = {
    primary: '#4f46e5',
    primaryGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
    primaryLight: '#e0e7ff',
    success: '#10b981',
    danger: '#ef4444',

    bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 25%, #f5f3ff 60%, #f0fdf4 100%)',

    glass: {
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1.5px solid rgba(255, 255, 255, 0.95)',
        borderRadius: '26px',
        boxShadow: '0 25px 60px -15px rgba(99, 102, 241, 0.15), 0 10px 24px -10px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 10
    },

    inputWrapper: {
        width: '100%',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 16px',
        position: 'relative',
        border: '1.5px solid #e2e8f0',
        borderRadius: '14px',
        background: '#f8fafc',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
        color: '#0f172a',
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
        borderRadius: '8px',
        transition: 'all 0.2s ease'
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
            {/* Literacy & Education Themed Canvas Background */}
            <LiteracyThemeCanvas />

            {/* ===== CARD ===== */}
            <div style={{ ...THEME.glass, width: '100%', maxWidth: '480px', padding: '38px 32px' }}>

                {/* Top Portal Tag */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.73rem',
                        fontWeight: '700',
                        color: THEME.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        background: THEME.primaryLight,
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.08)'
                    }}>
                        <Award size={14} style={{ color: THEME.primary }} /> Marketplace Literacy Portal
                    </div>
                </div>

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
                            boxShadow: '0 10px 24px rgba(16, 185, 129, 0.3)'
                        }}>
                            <Check size={38} strokeWidth={2.5} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                            Password Reset Complete!
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0 0 28px 0', lineHeight: '1.5' }}>
                            {message}
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/login" style={{
                                color: 'white',
                                fontWeight: '700',
                                textDecoration: 'none',
                                padding: '13px 26px',
                                borderRadius: '14px',
                                background: THEME.primaryGradient,
                                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
                                transition: 'transform 0.2s ease'
                            }}>
                                Proceed to Login
                            </Link>

                            <button
                                onClick={handleResetForm}
                                style={{
                                    color: '#475569',
                                    fontWeight: '600',
                                    padding: '13px 20px',
                                    borderRadius: '14px',
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
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '20px',
                                background: THEME.primaryGradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 10px 24px rgba(99, 102, 241, 0.35)'
                            }}>
                                <KeyRound size={30} style={{ color: '#ffffff' }} />
                            </div>
                        </div>

                        {/* Form Header */}
                        <div>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: '800',
                                color: '#0f172a',
                                marginBottom: '6px',
                                textAlign: 'center',
                                letterSpacing: '-0.02em'
                            }}>
                                Reset Password
                            </h2>
                            <p style={{
                                fontSize: '0.9rem',
                                color: '#64748b',
                                textAlign: 'center',
                                marginBottom: '26px',
                                marginTop: '0'
                            }}>
                                Enter your registered details to update your password
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
                                    borderRadius: '14px',
                                    marginBottom: '20px',
                                    border: '1px solid #fecaca',
                                    fontWeight: '500',
                                    fontSize: '0.88rem',
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
                                        fontSize: '0.86rem',
                                        fontWeight: '700',
                                        color: '#334155',
                                        marginBottom: '6px',
                                        display: 'block',
                                        paddingLeft: '4px'
                                    }}>
                                        Username or Email Address
                                    </label>

                                    <div style={THEME.inputWrapper}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.14)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
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
                                        fontSize: '0.86rem',
                                        fontWeight: '700',
                                        color: '#334155',
                                        marginBottom: '6px',
                                        display: 'block',
                                        paddingLeft: '4px'
                                    }}>
                                        New Password
                                    </label>

                                    <div style={THEME.inputWrapper}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.14)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <ShieldCheck size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password (min. 6 chars)"
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
                                        fontSize: '0.86rem',
                                        fontWeight: '700',
                                        color: '#334155',
                                        marginBottom: '6px',
                                        display: 'block',
                                        paddingLeft: '4px'
                                    }}>
                                        Confirm New Password
                                    </label>

                                    <div style={THEME.inputWrapper}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.14)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
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
                                        height: '52px',
                                        background: loading ? '#cbd5e1' : THEME.primaryGradient,
                                        color: 'white',
                                        padding: '0 20px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        fontWeight: '800',
                                        fontSize: '0.98rem',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: loading ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.35)',
                                        transition: 'all 0.22s ease',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginTop: '8px',
                                        letterSpacing: '0.04em'
                                    }}
                                >
                                    {loading ? 'Resetting Password...' : 'Reset Password'}
                                    {!loading && <Lock size={18} />}
                                </button>
                            </form>

                            {/* Back to Login link */}
                            <div style={{ marginTop: '22px', textAlign: 'center' }}>
                                <Link to="/login" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: THEME.primary,
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
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
