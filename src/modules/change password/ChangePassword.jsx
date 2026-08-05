import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, AlertCircle, KeyRound, ShieldCheck, User, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${p.alpha})`;
                ctx.fill();

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

const ChangePassword = () => {
    const { user } = useAuth();
    const [usernameInput, setUsernameInput] = useState(user?.username || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const targetUsername = user?.username || usernameInput.trim();

        if (!user && !targetUsername) {
            setMessage('Please enter your username.');
            return;
        }

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage('Please fill in all required fields.');
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

        if (currentPassword === newPassword) {
            setMessage('New password must be different from your current password.');
            return;
        }

        try {
            setLoading(true);

            let response;
            if (user && user.id) {
                try {
                    response = await api.post('/admin/change-password', {
                        userId: user.id,
                        currentPassword,
                        newPassword
                    });
                } catch (authErr) {
                    if ((authErr.response?.status === 403 || authErr.response?.status === 401) && targetUsername) {
                        response = await api.post('/admin/change-password-public', {
                            username: targetUsername,
                            currentPassword,
                            newPassword
                        });
                    } else {
                        throw authErr;
                    }
                }
            } else {
                response = await api.post('/admin/change-password-public', {
                    username: targetUsername,
                    currentPassword,
                    newPassword
                });
            }

            setIsSuccess(true);
            setMessage(response.data?.message || 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Failed to update password. Please check your username and current password.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetForm = () => {
        setIsSuccess(false);
        setMessage('');
        setCurrentPassword('');
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
                            Password Updated!
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 28px 0', lineHeight: '1.5' }}>
                            {message}
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to={user ? "/admin/dashboard" : "/login"} style={{
                                color: 'white',
                                fontWeight: '600',
                                textDecoration: 'none',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: THEME.primary,
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                transition: 'transform 0.2s ease'
                            }}>
                                {user ? "Return to Dashboard" : "Proceed to Login"}
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
                                Change Again
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
                                Change Password
                            </h2>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#64748b',
                                textAlign: 'center',
                                marginBottom: '28px',
                                marginTop: '0'
                            }}>
                                {user ? (
                                    <>Update password for account <strong style={{ color: '#334155' }}>{user.username}</strong></>
                                ) : (
                                    'Enter your username and current password to update password'
                                )}
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

                                {/* 0. Username (shown if not logged in) */}
                                {!user && (
                                    <div>
                                        <label style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            color: '#334155',
                                            marginBottom: '6px',
                                            display: 'block',
                                            paddingLeft: '4px'
                                        }}>
                                            Username
                                        </label>

                                        <div style={THEME.inputWrapper}
                                            onFocus={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                            onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                        >
                                            <User size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                            <input
                                                type="text"
                                                value={usernameInput}
                                                onChange={(e) => setUsernameInput(e.target.value)}
                                                placeholder="Enter your username"
                                                style={THEME.input}
                                                autoComplete="username"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 1. Current Password Row */}
                                <div>
                                    <label style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: '#334155',
                                        marginBottom: '6px',
                                        display: 'block',
                                        paddingLeft: '4px'
                                    }}>
                                        Current Password
                                    </label>

                                    <div style={THEME.inputWrapper}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <Lock size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                        <input
                                            type={showCurrent ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            style={THEME.input}
                                            autoComplete="current-password"
                                        />
                                        <div style={THEME.iconBox} onClick={() => setShowCurrent(!showCurrent)}>
                                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </div>
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

                                {/* 3. Confirm Password Row */}
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
                                    {loading ? 'Updating Password...' : 'Update Password'}
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

export default ChangePassword;