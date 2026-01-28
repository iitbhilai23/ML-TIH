import React, { useState, useEffect } from 'react';
import { trainingService } from '../../services/trainingService';
import TrainingForm from './TrainingForm';
import styles from './Trainings.module.css';
import { Plus, Pencil, Trash2, Calendar, MapPin, User, BookOpen, Filter, ChevronLeft, ChevronRight, AlertTriangle, Check } from 'lucide-react';
import '../../styles/shared.css';
import Spinner from '../../components/common/Spinner';
import { toast, Toaster } from 'sonner';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);

  // State for the Custom Confirmation Modal
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger' // 'danger' for delete, 'primary' for save
  });

  // Saving State (moved here to handle API logic outside form)
  const [isSaving, setIsSaving] = useState(false);

  const THEME = {
    primary: '#6366f1',
    danger: '#ef4444',
    // ... other theme constants
  };

  useEffect(() => {
    loadTrainings();
    setCurrentPage(1);
  }, [filterStatus]);

  const loadTrainings = async () => {
    setLoading(true);
    try {
      const filters = filterStatus ? { status: filterStatus } : {};
      const data = await trainingService.getAll(filters);
      setTrainings(data);
    } catch (err) {
      console.error('Failed to load trainings:', err);
      toast.error('Failed to load trainings');
    }
    setLoading(false);
  };

  // --- API LOGIC (Executed after confirmation) ---

  const executeSave = async (data) => {
    setIsSaving(true);
    try {
      if (editingTraining) {
        await trainingService.update(editingTraining.id, data);
        toast.success('Training updated successfully');
      } else {
        await trainingService.create(data);
        toast.success('Training created successfully');
      }
      setIsModalOpen(false);
      setEditingTraining(null);
      loadTrainings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save training: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const executeDelete = async (id) => {
    try {
      await trainingService.delete(id);
      toast.success('Training deleted successfully');
      loadTrainings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete training: ' + (err.response?.data?.message || err.message));
    }
  };

  // --- HANDLERS (Triggers Confirmation) ---

  const handleSaveRequest = (data) => {
    if (editingTraining) {
      // If editing, show confirmation before saving
      openConfirm(
        'Save Changes?',
        'Are you sure you want to update the details for this training?',
        () => executeSave(data),
        'primary'
      );
    } else {
      // If new, save directly
      executeSave(data);
    }
  };

  const handleDeleteClick = (id) => {
    openConfirm(
      'Delete Training?',
      'This action cannot be undone. This will permanently remove the training from the database.',
      () => executeDelete(id),
      'danger'
    );
  };

  const openAdd = () => {
    setEditingTraining(null);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingTraining(item);
    setIsModalOpen(true);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" richColors />

      {/* --- Header & Controls --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1 1 250px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: 0, letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Trainings Management
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f5f9', padding: '6px 16px', borderRadius: '9999px', border: '1px solid transparent', alignSelf: 'flex-start', transition: 'all 0.2s ease' }}>
              <Calendar size={18} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Trainings</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{trainings.length}</span>
            </div>
          </div>

          {/* Filter */}
          <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              value={filterStatus}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#334155',
                backgroundColor: '#f8fafc',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                backgroundSize: '16px'
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
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Add Button */}
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
              <Plus size={18} /> Add Training
            </button>
          </div>
        </div>
      </div>

      {/* --- Table --- */}
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
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
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
                            onClick={() => handleDeleteClick(details.id)}
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

        {/* Pagination */}
        {!loading && trainings.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#ffffff', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', marginTop: '0px' }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, trainings.length)} of {trainings.length} entries
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: currentPage === 1 ? '#f1f5f9' : '#ffffff', color: currentPage === 1 ? '#cbd5e1' : '#475569', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseEnter={(e) => { if (currentPage !== 1) e.currentTarget.style.borderColor = '#6366f1'; }}
                onMouseLeave={(e) => { if (currentPage !== 1) e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <div style={{ display: 'flex', gap: '4px', margin: '0 8px' }}>
                <span style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)' }}>
                  {currentPage}
                </span>
                <span style={{ padding: '8px 4px', color: '#64748b', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                  of {totalPages}
                </span>
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: currentPage === totalPages || totalPages === 0 ? '#f1f5f9' : '#ffffff', color: currentPage === totalPages || totalPages === 0 ? '#cbd5e1' : '#475569', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseEnter={(e) => { if (currentPage !== totalPages && totalPages !== 0) e.currentTarget.style.borderColor = '#6366f1'; }}
                onMouseLeave={(e) => { if (currentPage !== totalPages && totalPages !== 0) e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- TRAINING FORM (Refactored) --- */}
      <TrainingForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRequest}
        initialData={editingTraining}
        isSaving={isSaving}
      />

      {/* --- ENHANCED CUSTOM CONFIRMATION MODAL --- */}
      {confirmState.isOpen && (
        <div
          className={styles.modalOverlay}
          style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 9999 }}
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
              animation: 'modalPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 9999
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

      <style>{`
        @keyframes modalPopIn {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Trainings;