
import React, { useState, useEffect } from 'react';
import { trainingService } from '../../services/trainingService';
import TrainingForm from './TrainingForm';
import styles from './Trainings.module.css';
import { Plus, Pencil, Trash2, Calendar, MapPin, User, BookOpen, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/shared.css';
import Spinner from '../../components/common/Spinner';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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
    // Reset to page 1 when filters change
    setCurrentPage(1);
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrainings = trainings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(trainings.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optional: scroll to top of table on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Modern Header Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {/* Header Card */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#FFFFFF',
          padding: '20px 32px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          //  marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', }}>
            <h2 style={{
              fontSize: '1.5rem', // Restored original font size
              fontWeight: 700,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              Trainings Management
            </h2>
            <p style={{
              fontSize: '0.95rem', // Restored original font size
              color: '#64748b',
              margin: 0,
              marginLeft: '2px'
            }}>
              Manage and oversee all training sessions
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                padding: '8px 16px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              {/* Icon */}
              <Calendar size={26} color="white" />

              {/* Label */}
              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Total Trainings
              </span>

              {/* Count */}
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'white'
                }}
              >
                {trainings.length}
              </span>
            </div>
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

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

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
              <Plus size={18} /> Add Trainings
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {/* <div className={styles.filterBar} style={{
          background: '#FFFFFF',
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
        </div> */}
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
                  <td colSpan="6" className="p-4 text-center">
                    <Spinner overlay={false} />
                  </td>
                </tr>
              ) : trainings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">No trainings found</td>
                </tr>
              ) : (
                currentTrainings.map(t => {
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
                            onClick={() => handleDelete(details.id)}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && trainings.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            marginTop: '0px'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, trainings.length)} of {trainings.length} entries
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#cbd5e1' : '#475569',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div style={{
                display: 'flex',
                gap: '4px',
                margin: '0 8px'
              }}>
                {/* Simple page indicator for mobile/compact view, or simplified list */}
                <span style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)'
                }}>
                  {currentPage}
                </span>
                <span style={{
                  padding: '8px 4px',
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  of {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === totalPages || totalPages === 0 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages || totalPages === 0 ? '#cbd5e1' : '#475569',
                  cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages && totalPages !== 0) e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages && totalPages !== 0) e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
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
