import React, { useState, useEffect } from 'react';
import { trainingService } from '../../services/trainingService';
import TrainingForm from './TrainingForm';
import styles from './Trainings.module.css';
import { Plus, Pencil, Trash2, Calendar, MapPin, User, BookOpen, Filter } from 'lucide-react';
import '../../styles/shared.css';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);

  useEffect(() => {
    loadTrainings();
  }, [filterStatus]);

  const loadTrainings = async () => {
    setLoading(true);
    try {
      // Pass filters to backend
      const filters = filterStatus ? { status: filterStatus } : {};
      const data = await trainingService.getAll(filters);
      setTrainings(data);
    } catch (err) {
      console.error('Failed to load trainings:', err);
    }
    setLoading(false);
  };

  const handleSave = async (data) => {
    try {
      if (editingTraining) {
        await trainingService.update(editingTraining.id, data);
      } else {
        await trainingService.create(data);
      }
      setIsModalOpen(false);
      loadTrainings();
    } catch (err) {
      alert('Failed to save training: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        await trainingService.delete(id);
        loadTrainings();
      } catch (err) {
        alert('Failed to delete training: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const openAdd = () => {
    setEditingTraining(null);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingTraining(item);
    setIsModalOpen(true);
  };

  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper to get training details safely
  const getTrainingDetails = (training) => {
    if (!training) return {
      subject_name: 'N/A',
      trainer_name: 'N/A',
      location_details: {},
      start_date: null,
      end_date: null,
      actual_participants: 0,
      max_participants: 0,
      status: 'scheduled',
      id: null
    };

    return {
      subject_name: training.subject_name || 'N/A',
      trainer_name: training.trainer_name || 'N/A',
      location_details: training.location_details || {},
      start_date: training.start_date,
      end_date: training.end_date,
      actual_participants: training.actual_participants || 0,
      max_participants: training.max_participants || 0,
      status: training.status || 'scheduled',
      id: training.id
    };
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
        {/* Header Card */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'white',
          padding: '20px 32px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          //  marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Calendar size={26} color={THEME.primary} />  Training Schedule
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: 0,
              marginLeft: '42px'
            }}>
              Manage all training sessions and programs
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Vibrant Total Trainer Card (Fixing "Light" look) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)' // Stronger shadow
            }}>
              <div style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '2px'
              }}>
                Total Trainings
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                {trainings.length}
              </div>
            </div>

            <button
              onClick={openAdd}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Plus size={18} /> Add Trainer
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={styles.filterBar} style={{
          background: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingRight: '16px',
            borderRight: '2px solid #e2e8f0',
            minWidth: '100px'
          }}>
            <Filter size={18} style={{ color: '#6366f1' }} />
            <span style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#1e293b',
              letterSpacing: '0.5px'
            }}>FILTER</span>
          </div>
          <select
            className={styles.select}
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
            style={{
              padding: '10px 14px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#334155',
              outline: 'none',
              transition: 'all 0.2s ease',
              minWidth: '200px',
              cursor: 'pointer',
              background: 'white'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Training Details (Subject/Trainer)</th>
                <th>Training Subject</th>
                <th>Location</th>
                <th>Dates</th>
                <th>Participants</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">Loading trainings...</td>
                </tr>
              ) : trainings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">No trainings found</td>
                </tr>
              ) : (
                trainings.map(t => {
                  const details = getTrainingDetails(t);
                  return (
                    <tr key={details.id}>
                      <td>

                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <User size={12} /> {details.trainer_name}
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-indigo-700 flex items-center gap-2">
                          <BookOpen size={14} /> {details.subject_name}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          {details.location_details?.village || 'N/A'}, {details.location_details?.block || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {details.location_details?.district || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(details.start_date)}
                        </div>
                        <div className="text-xs text-gray-400 ml-5">
                          to {formatDate(details.end_date)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <span className="font-bold">{details.actual_participants}</span> / {details.max_participants}
                        </div>
                        <div className="w-16 h-1 bg-gray-200 mt-1 rounded">
                          <div
                            style={{ width: `${details.max_participants > 0 ? (details.actual_participants / details.max_participants) * 100 : 0}%` }}
                            className="h-full bg-green-500 rounded"
                          ></div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[details.status]}`}>
                          {details.status}
                        </span>
                      </td>
                      <td>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '8px'
                        }}>
                          <button
                            onClick={() => openEdit(t)}
                            style={{
                              padding: '8px 12px',
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              borderRadius: '8px',
                              color: '#1e40af',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#dbeafe';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#eff6ff';
                            }}
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(details.id)}
                            style={{
                              padding: '8px 12px',
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: '8px',
                              color: '#991b1b',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#fef2f2';
                            }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TrainingForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingTraining}
      />
    </div>
  );
};

export default Trainings;