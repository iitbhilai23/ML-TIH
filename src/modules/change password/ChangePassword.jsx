import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

// ===== ELEGANT THEME =====
const THEME = {
    primary: '#6366f1',
    primaryLight: '#e0e7ff',
    success: '#10b981',
    danger: '#ef4444',

    bgGradient: 'linear-gradient(-45deg, #f8fafc, #f1f5f9, #fdfbf7, #f0fdf4)',

    glass: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 8px 30px -10px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },

    // Flex Layout Styles for Alignment
    inputWrapper: {
        width: '100%',
        height: '50px', // Matches the input height
        display: 'flex',
        alignItems: 'center', // Vertical Alignment
        justifyContent: 'space-between', // Horizontal separation
        gap: '12px',
        padding: '10px',
        position: 'relative',
        border: '1.5px solid #e2e8f0',
        borderRadius: '14px',
        background: 'white',
        transition: 'all 0.2s ease',
        overflow: 'hidden' // Keeps border radius clean
    },

    input: {
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#334155',
        paddingLeft: '0',
        paddingRight: '0'
    },

    // Icon Container to Fix Alignment Issues
    iconBox: {
        width: '24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '0',
        borderRadius: '4px',
        transition: 'background 0.2s ease'
    }
};

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsSuccess(true);
            setMessage('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '18px',
            alignItems: 'center',
            background: THEME.bgGradient,
        }}>

            {/* ===== CARD ===== */}
            <div style={{ ...THEME.glass, width: '100%', maxWidth: '580px', padding: '32px' }}>

                {/* Success State */}
                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: THEME.success,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                        }}>
                            <Check size={36} strokeWidth={2.5} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                            Password Updated!
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>
                            {message}
                        </p>
                        <Link to="/dashboard" style={{
                            marginTop: '32px',
                            color: THEME.primary,
                            fontWeight: '600',
                            textDecoration: 'none',
                            display: 'inline-block',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            background: 'white',
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Header Icon */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '30px'
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
                                <Lock size={32} style={{ color: THEME.primary }} />
                            </div>
                        </div>

                        {/* Form Content */}
                        <div style={{ padding: '0 10px' }}>
                            <h2 style={{
                                fontSize: '1.4rem',
                                fontWeight: '700',
                                color: '#1e293b',
                                marginBottom: '8px',
                                textAlign: 'center'
                            }}>
                                Change Password
                            </h2>
                            <p style={{
                                fontSize: '1rem',
                                color: '#64748b',
                                textAlign: 'center',
                                marginBottom: '32px',
                                marginTop: '0'
                            }}>
                                Enter your details below
                            </p>

                            {/* Error Message */}
                            {message && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: '#fef2f2',
                                    color: THEME.danger,
                                    padding: '14px 20px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    border: '1px solid #fecaca',
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)'
                                }}>
                                    <AlertCircle size={22} />
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                {/* 1. Current Password Row */}
                                <div>
                                    <label style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: '#334155',
                                        marginBottom: '8px',
                                        display: 'block',
                                        paddingLeft: '12px'
                                    }}>
                                        Current Password
                                    </label>

                                    {/* ROW: Lock - Input - Eye */}
                                    <div style={THEME.inputWrapper}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <div style={THEME.iconBox} onClick={() => setShowOld(!showOld)}>
                                            {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </div>
                                        <input
                                            type={showOld ? 'text' : 'password'}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            style={THEME.input}
                                        />
                                        <div style={THEME.iconBox}>
                                            <Lock size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. New Password Row */}
                                <div>
                                    <label style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: '#334155',
                                        marginBottom: '8px',
                                        display: 'block',
                                        paddingLeft: '12px'
                                    }}>
                                        New Password
                                    </label>

                                    {/* ROW: Lock - Input - Eye */}
                                    <div style={THEME.inputWrapper}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <div style={THEME.iconBox} onClick={() => setShowNew(!showNew)}>
                                            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </div>
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            style={THEME.input}
                                        />
                                        <div style={THEME.iconBox}>
                                            <Lock size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Confirm Password Row */}
                                <div>
                                    <label style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: '#334155',
                                        marginBottom: '8px',
                                        display: 'block',
                                        paddingLeft: '12px'
                                    }}>
                                        Confirm New Password
                                    </label>

                                    {/* ROW: Check - Input - Eye */}
                                    <div style={THEME.inputWrapper}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <div style={THEME.iconBox} onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </div>
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            style={THEME.input}
                                        />
                                        <div style={THEME.iconBox}>
                                            <Check size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        height: '54px',
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
                                        letterSpacing: '0.5px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                    {!loading && <Lock size={20} />}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;