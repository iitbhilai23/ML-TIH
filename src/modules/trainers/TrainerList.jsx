import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import TrainerForm from './TrainerForm';
import styles from './Trainers.module.css';
import { Plus, Search, Pencil, Trash2, Phone, Mail, User, Users } from 'lucide-react';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className={styles.container}>
      {/* Modern Header with Search and Add Button */}
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
          gap: '16px',
          background: '#FFFFFF',
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
              <Users size={26} color={THEME.primary} /> Trainer Management
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: 0,
              marginLeft: '42px'
            }}>
              Manage trainers and their profiles
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '520px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 44px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#334155',
                outline: 'none',
                transition: 'all 0.2s ease'
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
                Total Trainers
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                {trainers.length}
              </div>
            </div>

            <button
              onClick={openAddModal}
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
                  <div>Loading trainers...</div>
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
                trainers.map((trainer) => (
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
