import React, { useState, useEffect } from 'react';
import { subjectService } from '../../services/subjectService';
import styles from './Masters.module.css';
import { Plus, Pencil, Trash2, Search, X, Book, AlertTriangle, Check } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State for the Edit/Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });

  // State for the Custom Confirmation Modal
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger' // 'danger' for delete, 'primary' for save
  });

  const THEME = {
    primary: '#6366f1',
    danger: '#ef4444',
  };

  useEffect(() => { loadSubjects(); }, [searchTerm]);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await subjectService.getAll(searchTerm);
      setSubjects(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subjects');
    }
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

  // --- ACTUAL API LOGIC (Executed after confirmation) ---

  const executeSave = async () => {
    try {
      const payload = cleanPayload(formData);

      if (formData.id) {
        await subjectService.update(formData.id, payload);
        toast.success('Subject updated successfully');
      } else {
        await subjectService.create(payload);
        toast.success('Subject created successfully');
      }

      setIsModalOpen(false);
      loadSubjects();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Operation Failed');
    }
  };

  const executeDelete = async (id) => {
    try {
      await subjectService.delete(id);
      toast.success('Subject deleted successfully');
      loadSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  // --- HANDLERS (Triggers Confirmation) ---

  const handleSubmit = (e) => {
    e.preventDefault();

    // If it's an edit, show confirmation before saving
    if (formData.id) {
      openConfirm(
        'Save Changes?',
        'Are you sure you want to update the details for this subject?',
        executeSave,
        'primary'
      );
    } else {
      // If it's new, just save directly
      executeSave();
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

  const handleDeleteClick = (id) => {
    openConfirm(
      'Delete Subject?',
      'This action cannot be undone. This will permanently remove the subject from the database.',
      () => executeDelete(id),
      'danger'
    );
  };

  // --- CONFIRMATION MODAL LOGIC ---

  const openConfirm = (title, message, onConfirm, type) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    });
  };

  const closeConfirm = () => {
    setConfirmState({ ...confirmState, isOpen: false });
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" richColors />

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
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#f1f5f9',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid transparent',
              alignSelf: 'flex-start',
              transition: 'all 0.2s ease'
            }}>
              <Book size={18} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Subjects
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                {subjects.length}
              </span>
            </div>
          </div>

          {/* Middle Section: Search Bar */}
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '520px' }}>
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
                        onClick={() => handleDeleteClick(sub.id)}
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

      {/* --- EDIT/ADD MODAL --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
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

      {/* --- ENHANCED CUSTOM CONFIRMATION MODAL --- */}
      {confirmState.isOpen && (
        <div
          className={styles.modalOverlay}
          style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
        >
          <div
            className={styles.modalBox}
            style={{
              maxWidth: '440px',
              width: '90%',
              padding: '36px 32px',
              textAlign: 'center',
              borderRadius: '24px',
              background: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: 'none',
              animation: 'modalPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Icon Container with Glow */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              backgroundColor: confirmState.type === 'danger' ? '#fef2f2' : '#eef2ff',
              color: confirmState.type === 'danger' ? '#ef4444' : '#6366f1',
              position: 'relative'
            }}>
              {/* Decorative outer ring */}
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: confirmState.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                borderStyle: 'dashed'
              }}></div>

              {confirmState.type === 'danger' ? (
                <Trash2 size={32} strokeWidth={1.5} />
              ) : (
                <AlertTriangle size={32} strokeWidth={1.5} />
              )}
            </div>

            {/* Text Content */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: '0 0 12px',
              letterSpacing: '-0.025em'
            }}>
              {confirmState.title}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              lineHeight: '1.6',
              margin: '0 0 32px',
              maxWidth: '340px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              {confirmState.message}
            </p>

            {/* Button Group */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={closeConfirm}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (confirmState.onConfirm) confirmState.onConfirm();
                  closeConfirm();
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: confirmState.type === 'danger' ? '#ef4444' : '#6366f1',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: confirmState.type === 'danger'
                    ? '0 4px 12px rgba(239, 68, 68, 0.25)'
                    : '0 4px 12px rgba(99, 102, 241, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {confirmState.type === 'danger' ? (
                  <>
                    <Trash2 size={18} /> Delete
                  </>
                ) : (
                  <>
                    <Check size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CSS ANIMATION FOR MODAL POP-IN --- */}
      <style>{`
        @keyframes modalPopIn {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Subjects;