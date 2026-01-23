import React, { useState, useEffect } from 'react';
import { subjectService } from '../../services/subjectService';
import styles from './Masters.module.css';
import { Plus, Pencil, Trash2, Search, X, Book } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const THEME = {
    primary: '#7c3aed',
    primaryLight: '#ddd6fe',
    secondary: '#ec4899',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',

    bgGradient: 'linear-gradient(-45deg, #f8fafc, #f1f5f9, #fdfbf7, #f0fdf4)',

    glass: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },

    softShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    mediumShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    hoverShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  };

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });

  useEffect(() => { loadSubjects(); }, [searchTerm]);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await subjectService.getAll(searchTerm);
      setSubjects(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const cleanPayload = (data) => {
    const cleaned = {};
    Object.keys(data).forEach(key => {
      if (
        data[key] !== '' &&
        data[key] !== null &&
        data[key] !== undefined &&
        key !== 'id'
      ) {
        cleaned[key] = data[key];
      }
    });
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = cleanPayload(formData);

      if (formData.id) {
        await subjectService.update(formData.id, payload);
        alert('Subject updated successfully');
      } else {
        await subjectService.create(payload);
        alert('Subject created successfully');
      }

      setIsModalOpen(false);
      loadSubjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Operation Failed');
    }
  };

  const openEdit = (sub) => {
    setFormData({
      id: sub.id,
      name: sub.name,
      description: sub.description || ''
    });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setFormData({ id: null, name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;

    try {
      await subjectService.delete(id);
      alert('Subject deleted successfully');
      loadSubjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Delete failed');
    }
  };


  return (
    <div className={styles.container}>
      {/* Modern Header Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          background: '#FFFFFF',
          padding: '24px 32px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}>

          {/* Left Section: Title & Stat */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: '1 1 250px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              letterSpacing: '-0.025em',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              Subjects / Topics
            </h2>

            {/* Modern Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#f1f5f9',
                padding: '6px 16px',
                borderRadius: '9999px', // Fully rounded (Pill)
                border: '1px solid transparent',
                alignSelf: 'flex-start',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Icon */}
              <Book size={18} color="#6366f1" strokeWidth={2} />

              {/* Label */}
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Total Subjects
              </span>

              {/* Count */}
              <span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  lineHeight: 1
                }}
              >
                {subjects.length}
              </span>
            </div>
          </div>

          {/* Middle Section: Search Bar */}
          <div style={{
            position: 'relative',
            flex: '1 1 320px',
            maxWidth: '520px'
          }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none',
              transition: 'color 0.2s'
            }} />
            <input
              type="text"
              placeholder="Search subjects..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 46px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#334155',
                backgroundColor: '#f8fafc',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Right Section: Action Button */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: '0 0 auto' }}>
            <button
              onClick={openAdd}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
              }}
            >
              <Plus size={18} /> Add Subject
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th style={{ width: '250px' }}>Subject Name</th>
                <th>Description</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => (
                <tr key={sub.id}>
                  <td><span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>#{sub.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{sub.name}</td>
                  <td style={{ color: '#64748b' }}>{sub.description || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        onClick={() => openEdit(sub)}
                        style={{
                          padding: '8px 14px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          color: '#1e293b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#6366f1';
                          e.currentTarget.style.color = '#4338ca';
                          e.currentTarget.style.boxShadow = '0 6px 14px rgba(99, 102, 241, 0.18)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.color = '#1e293b';
                          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                        }}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        style={{
                          padding: '8px 14px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          color: '#991b1b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#fecaca';
                          e.currentTarget.style.boxShadow = '0 6px 14px rgba(239, 68, 68, 0.18)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- UPDATED MODAL SECTION START --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>

            {/* Modern Modal Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {formData.id ? 'Edit Subject' : 'New Subject'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.closeIconBtn}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Subject Name *</label>
                <input
                  required
                  className={styles.input}
                  value={formData.name}
                  placeholder="e.g. Advanced Agriculture"
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  rows="3"
                  className={`${styles.input} ${styles.textarea}`}
                  value={formData.description}
                  placeholder="Brief description of the subject..."
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- UPDATED MODAL SECTION END --- */}
    </div>
  );
};

export default Subjects;

