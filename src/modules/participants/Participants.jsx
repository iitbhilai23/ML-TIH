import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participantService';
import { trainingService } from '../../services/trainingService';
import ParticipantForm from './ParticipantForm';
import styles from './Participants.module.css';
import { Plus, Pencil, Trash2, User, Phone, Filter } from 'lucide-react';
import '../../styles/shared.css';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [trainings, setTrainings] = useState([]); // Filter dropdown ke liye
  const [loading, setLoading] = useState(false);

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
  }, [selectedTrainingId]);

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
          background: '#FFF5E4',
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
              <User size={26} color={THEME.primary} /> Participants / Beneficiaries
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: 0,
              marginLeft: '42px'
            }}>
              Manage participant registrations and attendance
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
                Total Participants
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                {participants.length}
              </div>
            </div>

            <button
              onClick={() => { setEditingData(null); setIsModalOpen(true); }}
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
              <Plus size={18} /> Add Participant
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={styles.filterBar} style={{
          background: '#FFF5E4',
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
            value={selectedTrainingId}
            onChange={(e) => setSelectedTrainingId(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#334155',
              outline: 'none',
              transition: 'all 0.2s ease',
              minWidth: '300px',
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
            <option value="">-- Show All Participants --</option>
            {trainings.map(t => (
              <option key={t.id} value={t.id}>
                {t.subject_name} ({t.location_details?.district})
              </option>
            ))}
          </select>
          {selectedTrainingId && (
            <span style={{ fontSize: '0.875rem', color: '#64748b', marginLeft: '8px' }}>
              Showing {participants.length} students
            </span>
          )}
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
              {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> :
                participants.length === 0 ? <tr><td colSpan="5" className="p-4 text-center">No participants found</td></tr> : (
                  participants.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold">{p.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
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
                          gap: '8px'
                        }}>
                          <button
                            onClick={() => { setEditingData(p); setIsModalOpen(true); }}
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
                            onClick={() => handleDelete(p.id)}
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
                  ))
                )}
            </tbody>
          </table>
        </div>
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