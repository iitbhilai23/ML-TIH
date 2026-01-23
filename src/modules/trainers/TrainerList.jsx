
import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import TrainerForm from './TrainerForm';
import styles from './Trainers.module.css';
import { Plus, Search, Pencil, Trash2, Phone, Mail, User, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

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


  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on search change
    fetchTrainers();
  }, [searchTerm]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const data = await trainerService.getAllTrainers(searchTerm);

      //  FORCE RE-RENDER (NO MANUAL REFRESH NEEDED)
      //setTrainers(Array.isArray(data) ? [...data] : []);
      const sortedData = Array.isArray(data)
        ? [...data].sort((a, b) => a.name.localeCompare(b.name))
        : [];

      setTrainers(sortedData);
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
      alert('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetchTrainers(); // list refresh
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await trainerService.deleteTrainer(id);
        fetchTrainers();
        alert('Trainer deleted successfully!');
      } catch (error) {
        console.error('Could not delete trainer:', error);
        alert('Could not delete trainer: ' + error.message);
      }
    }
  };

  const openAddModal = () => {
    setEditingTrainer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (trainer) => {
    setEditingTrainer(trainer);
    setIsModalOpen(true);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrainers = trainers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(trainers.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optional: scroll to top of table on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Modern Header with Search and Add Button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',

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
          border: '1px solid rgba(255, 255, 255, 0.8)', // Adds subtle depth
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
              letterSpacing: '-0.025em', // Modern typography tweak
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              Trainers Management
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
              <Users size={18} color="#6366f1" strokeWidth={2} />

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
                Total Trainers
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
                {trainers.length}
              </span>
            </div>
          </div>

          {/* Middle Section: Search Bar */}
          <div style={{
            position: 'relative',
            flex: '1 1 300px',
            maxWidth: '520px'
          }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none', // Prevents icon from blocking input clicks
              transition: 'color 0.2s'
            }} />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#334155',
                backgroundColor: '#f8fafc', // Light grey bg initially
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
              onClick={openAddModal}
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
                // Changed shadow color to match button gradient
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
              <Plus size={18} /> Add Trainer
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} />
                    Trainer
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} />
                    Email
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} />
                    Contact
                  </div>
                </th>
                <th>Bio / Specialization</th>
                <th style={{ textAlign: 'center' }}>Profile</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  <Spinner overlay={false} />
                </td></tr>
              ) : trainers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '60px' }}>
                  <Users size={64} style={{ margin: '0 auto 16px', opacity: 0.2, color: '#94a3b8' }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                    No Trainers Found
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    {searchTerm ? 'Try adjusting your search' : 'Add your first trainer to get started'}
                  </div>
                </td></tr>
              ) : (
                currentTrainers.map((trainer) => (
                  <tr key={trainer.id}>
                    <td>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        {trainer.profile_image_url ? (
                          <img
                            src={`${trainer.profile_image_url}?t=${Date.now()}`}
                            alt={trainer.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #e2e8f0'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7B3F99, #9B59B6)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '1.1rem'
                          }}>
                            {trainer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{trainer.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Mail size={14} style={{ color: '#94a3b8' }} />
                        {trainer.email}
                      </div>
                    </td>
                    <td>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Phone size={14} style={{ color: '#94a3b8' }} />
                        {trainer.phone || 'N/A'}
                      </div>
                    </td>
                    <td style={{
                      maxWidth: '250px',
                      fontSize: '0.85rem',
                      color: '#64748b',
                      lineHeight: '1.4'
                    }}>
                      {trainer.bio || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>No bio provided</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {trainer.profile_image_url && (
                        <span style={{
                          background: 'linear-gradient(135deg, #ecfdf3 0%, #d1fae5 100%)',
                          color: '#065f46',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          border: '1px solid #a7f3d0',
                          boxShadow: '0 2px 6px rgba(5, 150, 105, 0.15)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap'
                        }}>
                          ✓ Set
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px'
                      }}>
                        <button
                          onClick={() => openEditModal(trainer)}
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
                          onClick={() => handleDelete(trainer.id)}
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
        {!loading && trainers.length > 0 && (
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, trainers.length)} of {trainers.length} entries
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
                {/* Simple page indicator */}
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

      <TrainerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingTrainer}
      />
    </div>
  );
};

export default TrainerList;
