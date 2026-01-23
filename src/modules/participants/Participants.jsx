import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participantService';
import { trainingService } from '../../services/trainingService';
import ParticipantForm from './ParticipantForm';
import styles from './Participants.module.css';
import { Plus, Pencil, Trash2, User, Phone, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import '../../styles/shared.css';
import Spinner from '../../components/common/Spinner';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter State
  const [selectedTrainingId, setSelectedTrainingId] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // 1. Load Filter Options (Trainings)
  useEffect(() => {
    loadTrainings();
  }, []);

  // 2. Load Participants when filter changes
  useEffect(() => {
    loadParticipants();
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [selectedTrainingId]);

  // 3. Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const loadTrainings = async () => {
    try {
      const data = await trainingService.getAll();
      setTrainings(data);
    } catch (e) { }
  };

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const filters = selectedTrainingId ? { training_id: selectedTrainingId } : {};
      const data = await participantService.getAll(filters);
      setParticipants(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSave = async (data) => {
    if (editingData) {
      const { training_id, ...updateData } = data; // 🔥 REMOVE
      await participantService.update(editingData.id, updateData);
    } else {
      await participantService.create(data);
    }

    setIsModalOpen(false);
    setEditingData(null);
    await loadParticipants();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are You Sure Delete?')) {
      await participantService.delete(id);
      await loadParticipants(); //  MUST
    }
  };

  // --- Filtering Logic ---
  // Filter participants by name based on searchQuery
  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic (Updated to use filteredParticipants)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipants = filteredParticipants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

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
          padding: '20px 32px', // Restored original padding
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          flexWrap: 'nowrap', // Keep in one row
          gap: '16px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '250px', flexShrink: 0 }}>
            <h2 style={{
              fontSize: '1.5rem', // Restored original font size
              fontWeight: 700,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              Participants / Beneficiaries
            </h2>
            <p style={{
              fontSize: '0.95rem', // Restored original font size
              color: '#64748b',
              margin: 0,
              marginLeft: '2px'
            }}>
              Manage participant registrations and attendance
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                padding: '6px 14px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              {/* Icon */}
              <User size={22} color="white" />

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
                Total Participants
              </span>

              {/* Count */}
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'white'
                }}
              >
                {participants.length}
              </span>
            </div>

          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px', // Reduced gap slightly to save space
            flexWrap: 'nowrap',
            flexGrow: 1,
            justifyContent: 'flex-end'
          }}>

            {/* Training Filter Dropdown - Reduced Width */}
            <div style={{ minWidth: '180px' }}> {/* Changed from 300px to 180px */}
              <select
                className={styles.select}
                value={selectedTrainingId}
                onChange={(e) => setSelectedTrainingId(e.target.value)}
                style={{
                  padding: '10px 14px', // Restored padding
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#334155',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  width: '100%',
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
                <option value="">-- Show All Participants --</option> {/* Shortened Text */}
                {trainings.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.subject_name} ({t.location_details?.district})
                  </option>
                ))}
              </select>
            </div>

            {/* Search By Name Input */}
            <div style={{ position: 'relative', minWidth: '220px' }}> {/* Moderate Width */}
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '10px 14px', // Restored padding
                  paddingLeft: '40px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#334155',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  background: 'white',
                  width: '100%'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {selectedTrainingId && (
              <span style={{ fontSize: '0.875rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                {filteredParticipants.length} found
              </span>
            )}

          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            {/* Total Participants Card */}
            {/* <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                padding: '6px 14px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              <span
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Total Participants
              </span>

              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'white'
                }}
              >
                {participants.length}
              </span>
            </div> */}

            {/* Add Button */}
            <button
              onClick={() => {
                setEditingData(null);
                setIsModalOpen(true);
              }}
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
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={18} /> Add Participant
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
                <th>Participant Name</th>
                <th>Training Program</th>
                <th>Category</th>
                <th>Attendance</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="p-4 text-center">
                <Spinner overlay={false} />
              </td></tr> :
                filteredParticipants.length === 0 ? <tr><td colSpan="5" className="p-4 text-center">No participants found</td></tr> : (
                  currentParticipants.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {p.profile_image_url ? (
                            <img
                              src={p.profile_image_url}
                              alt={p.name}
                              style={{
                                width: '36px',
                                height: '36px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '1px solid #e2e8f0'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: '#e0e7ff',
                              color: '#4338ca',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              border: '1px solid #e2e8f0'
                            }}>
                              {p.name.charAt(0)}
                            </div>
                          )}

                          <div>
                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={10} /> {p.phone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <b>{p.training_details?.subject_name}</b>
                        <div className="text-xs">
                          Trainer: {p.training_details?.trainer_name}
                        </div>
                        <div className="text-xs">
                          Village: {p.training_details?.location_details?.village}
                        </div>
                      </td>



                      <td>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {p.category} / {p.caste}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[p.attendance_status]}`}>
                          {p.attendance_status}
                        </span>
                      </td>
                      <td>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '10px'
                        }}>
                          <button
                            onClick={() => { setEditingData(p); setIsModalOpen(true); }}
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
                            onClick={() => handleDelete(p.id)}
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
                  ))
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && filteredParticipants.length > 0 && (
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredParticipants.length)} of {filteredParticipants.length} entries
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

      <ParticipantForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingData}
      />
    </div>
  );
};

export default Participants;
