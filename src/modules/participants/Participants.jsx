
import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participantService';
import { trainingService } from '../../services/trainingService';
import ParticipantForm from './ParticipantForm';
import styles from './Participants.module.css';
import { Plus, Pencil, Trash2, User, Phone, ChevronLeft, ChevronRight, Search, AlertTriangle, Check, MapPin, BookOpen } from 'lucide-react';
import '../../styles/shared.css';
import Spinner from '../../components/common/Spinner';
import { toast, Toaster } from 'sonner';
import { useExport } from '../../features/export/useExport';
import ExportButtons from '../../features/export/ExportButton';

// --- PURPLE THEME & TABLE STYLES ---
const THEME_COLORS = {
  primary: '#6366f1',   // Indigo 500
  secondary: '#8b5cf6', // Violet 500
  bgLight: '#f8fafc',
  textMain: '#1e293b',
  textMuted: '#64748b',
  border: '#e2e8f0',
  purpleLight: '#e0e7ff',
  purpleTint: '#eef2ff'
};

const TABLE_STYLES = {
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
    border: '1px solid #e0e7ff',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  wrapper: {
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
  },
  thead: {
    background: THEME_COLORS.bgLight,
  },
  th: {
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#701FA5', // UPDATED: Specific Purple Color
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '2px solid #e0e7ff',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.2s ease',
    cursor: 'default',
  },
  td: {
    padding: '16px 20px',
    verticalAlign: 'middle',
    color: THEME_COLORS.textMain,
    fontSize: '0.9rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  }
};

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Filter State
  const [selectedTrainingId, setSelectedTrainingId] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // State for the Custom Confirmation Modal
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  });

  const [isSaving, setIsSaving] = useState(false);

  const participantColumns = [
    { header: "No", dataKey: "index" },
    { header: "Name", dataKey: "name" },
    { header: "Phone", dataKey: "phone" },
    { header: "Training", dataKey: "training" },
    { header: "Village", dataKey: "village" },
    { header: "Category", dataKey: "category" },
    { header: "Attendance", dataKey: "attendance" }
  ];

  useEffect(() => { loadTrainings(); }, []);

  useEffect(() => {
    loadParticipants();
    setCurrentPage(1);
  }, [selectedTrainingId]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const loadTrainings = async () => {
    try {
      const data = await trainingService.getAll();
      setTrainings(data);
    } catch (e) { toast.error('Failed to load trainings list'); }
  };

  // const loadParticipants = async () => {
  //   setLoading(true);
  //   try {
  //     const filters = selectedTrainingId ? { training_id: selectedTrainingId } : {};
  //     const data = await participantService.getAll(filters);
  //     setParticipants(data);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error('Failed to load participants');
  //   }
  //   setLoading(false);
  // };

  // --- API LOGIC (Executed after confirmation) ---

  const loadParticipants = async () => {
    setLoading(true);
    try {
      // Temporary: always load all participants
      const data = await participantService.getAll();
      setParticipants(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const executeSave = async (data) => {
    setIsSaving(true);
    try {
      if (editingData) {
        const { training_id, ...updateData } = data;
        await participantService.update(editingData.id, updateData);
        toast.success('Participant updated successfully');
      } else {
        await participantService.create(data);
        toast.success('Participant registered successfully');
      }
      setIsModalOpen(false);
      setEditingData(null);
      await loadParticipants();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save participant');
    } finally { setIsSaving(false); }
  };

  const executeDelete = async (id) => {
    try {
      await participantService.delete(id);
      toast.success('Participant deleted successfully');
      await loadParticipants();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete participant');
    }
  };

  const handleSaveRequest = (data) => {
    if (editingData) {
      openConfirm('Save Changes?', 'Are you sure you want to update the details for this participant?', () => executeSave(data), 'primary');
    } else {
      executeSave(data);
    }
  };

  const handleDeleteClick = (id) => {
    openConfirm('Delete Participant?', 'This action cannot be undone. This will permanently remove this participant from the database.', () => executeDelete(id), 'danger');
  };

  const openAdd = () => { setEditingData(null); setIsModalOpen(true); };
  const openEdit = (item) => { setEditingData(item); setIsModalOpen(true); };

  const openConfirm = (title, message, onConfirm, type) => {
    setConfirmState({ isOpen: true, title, message, onConfirm, type });
  };

  const closeConfirm = () => { setConfirmState({ ...confirmState, isOpen: false }); };

  // --- Filtering Logic ---
  // const filteredParticipants = participants.filter(p =>
  //   p.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const selectedTraining = trainings.find(
    (t) => String(t.id) === String(selectedTrainingId)
  );

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = p.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Show all if no training is selected
    if (!selectedTraining) {
      return matchesSearch;
    }

    const participantDistrict =
      p.training_details?.location_details?.district_cd;

    const participantBlock =
      p.training_details?.location_details?.block_cd;

    // const matchesDistrict =
    //   String(participantDistrict) ===
    //   String(selectedTraining.location_details?.district_cd);

    // const matchesBlock =
    //   String(participantBlock) ===
    //   String(selectedTraining.location_details?.block_cd);

    const selectedDistrictCd =
      selectedTraining?.location_details?.district_cd;

    const selectedBlockCd =
      selectedTraining?.location_details?.block_cd;

    const matchesDistrict =
      String(participantDistrict) === String(selectedDistrictCd);

    const matchesBlock =
      String(participantBlock) === String(selectedBlockCd);

    return matchesSearch && matchesDistrict && matchesBlock;
  });


  const { exportPDF, exportExcel } = useExport(filteredParticipants);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipants = filteredParticipants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getAttendanceStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'present') return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
    if (s === 'absent') return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
    return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
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
          gap: '20px',
          background: '#FFFFFF',
          padding: '24px 32px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.1)',
          border: '1px solid #e0e7ff',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: THEME_COLORS.textMain,
              margin: 0,
              letterSpacing: '-0.025em',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ color: THEME_COLORS.primary }}>Participants</span> / Beneficiaries
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: THEME_COLORS.purpleTint, padding: '6px 16px', borderRadius: '9999px', border: '1px solid #e0e7ff', alignSelf: 'flex-start' }}>
              <User size={18} color={THEME_COLORS.primary} strokeWidth={2} />
              <span style={{ fontSize: '0.75rem', color: THEME_COLORS.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Participants</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: THEME_COLORS.primary, lineHeight: 1 }}>{participants.length}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Training Filter Dropdown */}
            <div style={{ minWidth: '220px' }}>
              <select
                value={selectedTrainingId}
                onChange={(e) => setSelectedTrainingId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#334155',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="">Show All Trainings</option>
                {trainings.map(t => (
                  <option key={t.id} value={t.id}>{t.subject_name} ({t.location_details?.district})</option>
                ))}
              </select>
            </div>

            <ExportButtons
              onPDF={() => exportPDF({
                title: "Participants Report",
                columns: participantColumns,
                fileName: "participants_report.pdf",
                mapper: (p, index) => ({
                  index: index + 1, name: p.name, phone: p.phone,
                  training: p.training_details?.subject_name,
                  village: p.training_details?.location_details?.village,
                  category: `${p.category} / ${p.caste}`,
                  attendance: p.attendance_status
                })
              })}
              onExcel={() => exportExcel({
                fileName: "participants_report.csv",
                mapper: (p, index) => ({
                  No: index + 1, Name: p.name, Phone: p.phone,
                  Training: p.training_details?.subject_name,
                  Village: p.training_details?.location_details?.village,
                  Category: `${p.category} / ${p.caste}`,
                  Attendance: p.attendance_status
                })
              })}
            />
            
            <button
              onClick={openAdd}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)'; }}
            >
              <Plus size={18} /> Add Participant
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div style={TABLE_STYLES.card}>
        <div style={TABLE_STYLES.wrapper}>
          <table style={TABLE_STYLES.table}>
            <thead style={TABLE_STYLES.thead}>
              {/* SEARCH ROW IN HEADER */}
              <tr>
                {/* colSpan updated to 5 because Village column removed */}
                <th colSpan="5" style={{ 
                  padding: '12px 20px', 
                  borderBottom: '1px solid #e0e7ff', 
                  background: '#ffffff',
                  verticalAlign: 'middle'
                }}>
                  <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={18} color={THEME_COLORS.primary} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder="Search participants by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 16px 10px 44px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: '#334155',
                        backgroundColor: '#f8fafc',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = THEME_COLORS.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${THEME_COLORS.purpleTint}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </th>
              </tr>
              {/* COLUMN HEADERS */}
              <tr>
                <th style={{ ...TABLE_STYLES.th, width: '25%' }}>Participant Name</th>
                <th style={{ ...TABLE_STYLES.th, width: '25%' }}>Training Program</th>
                {/* Village Column Removed */}
                <th style={{ ...TABLE_STYLES.th, width: '25%' }}>Village</th>
                <th style={{ ...TABLE_STYLES.th, width: '15%' }}>Attendance</th>
                <th style={{ ...TABLE_STYLES.th, width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  {/* colSpan updated to 5 */}
                  <td colSpan="5" style={{ ...TABLE_STYLES.td, height: '300px', textAlign: 'center' }}>
                    <Spinner overlay={false} />
                  </td>
                </tr>
              ) : filteredParticipants.length === 0 ? (
                <tr>
                  {/* colSpan updated to 5 */}
                  <td colSpan="5" style={{ ...TABLE_STYLES.td, height: '300px', textAlign: 'center', color: '#94a3b8', fontSize: '1rem' }}>
                    No participants found
                  </td>
                </tr>
              ) : (
                currentParticipants.map((p) => (
                  <tr 
                    key={p.id} 
                    style={TABLE_STYLES.tr}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME_COLORS.purpleTint; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* Name Column */}
                    <td style={TABLE_STYLES.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {p.profile_image_url ? (
                          <img src={p.profile_image_url} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #e0e7ff', backgroundColor: '#f1f5f9' }} />
                        ) : (
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
                            color: THEME_COLORS.primary,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold', fontSize: '15px', border: '2px solid #e0e7ff'
                          }}>
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '700', color: THEME_COLORS.textMain, fontSize: '0.95rem', marginBottom: '2px' }}>{p.name}</div>
                          <div style={{ fontSize: '0.8rem', color: THEME_COLORS.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} strokeWidth={2.5} /> {p.phone || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Training Column - HARDCODED */}
                    <td style={TABLE_STYLES.td}>
                      <div style={{ fontWeight: '600', color: THEME_COLORS.textMain, marginBottom: '4px', fontSize: '0.9rem' }}>
                        Marketplace Literacy
                      </div>
                      <div style={{ fontSize: '0.8rem', color: THEME_COLORS.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                     {p.training_details?.trainer_name || ''}
                      </div>
                    </td>

                    {/* Category Column (Includes Village, Gender, Caste) */}
                    <td style={TABLE_STYLES.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        
                        {/* 1. Village */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {/* <MapPin size={14} color={THEME_COLORS.primary} strokeWidth={2} /> */}
                          <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.85rem' }}>
                            {p.training_details?.location_details?.village || ''}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* 2. Gender */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: p.gender?.toLowerCase() === 'female' ? '#db2777' : (p.gender?.toLowerCase() === 'male' ? '#2563eb' : '#64748b'), fontSize: '0.8rem', fontWeight: '500' }}>
                            {/* <User size={12} /> */}
                            {p.gender || ''}
                          </div>
                          
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></div>

                          {/* 3. Caste/Category Badge */}
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: '#f1f5f9',
                            color: '#475569',
                            border: '1px solid #e2e8f0'
                          }}>
                            {p.category || ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Attendance Column */}
                    <td style={TABLE_STYLES.td}>
                      <span style={{ ...TABLE_STYLES.badge, ...getAttendanceStyle(p.attendance_status) }}>
                        {p.attendance_status || 'N/A'}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td style={{ ...TABLE_STYLES.td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button onClick={() => openEdit(p)} style={{
                          padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: THEME_COLORS.textMuted,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME_COLORS.primary; e.currentTarget.style.color = THEME_COLORS.primary; e.currentTarget.style.backgroundColor = THEME_COLORS.purpleTint; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = THEME_COLORS.textMuted; e.currentTarget.style.backgroundColor = '#ffffff'; }} title="Edit">
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        <button onClick={() => handleDeleteClick(p.id)} style={{
                          padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#ef4444',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.backgroundColor = '#fef2f2'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#ffffff'; }} title="Delete">
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredParticipants.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e0e7ff', background: '#ffffff' }}>
            <div style={{ fontSize: '0.85rem', color: THEME_COLORS.textMuted }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredParticipants.length)} of {filteredParticipants.length} entries
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{ 
                padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: currentPage === 1 ? '#f1f5f9' : '#ffffff', color: currentPage === 1 ? '#cbd5e1' : '#475569', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s ease' 
              }} onMouseEnter={(e) => { if (currentPage !== 1) e.currentTarget.style.borderColor = THEME_COLORS.primary; }}>
                <ChevronLeft size={16} /> Prev
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '0 8px' }}>
                <span style={{ padding: '6px 12px', background: `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.secondary} 100%)`, color: 'white', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', minWidth: '32px', textAlign: 'center' }}>{currentPage}</span>
                <span style={{ fontSize: '0.9rem', color: THEME_COLORS.textMuted, fontWeight: 500 }}>/ {totalPages}</span>
              </div>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} style={{ 
                padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: (currentPage === totalPages || totalPages === 0) ? '#f1f5f9' : '#ffffff', color: (currentPage === totalPages || totalPages === 0) ? '#cbd5e1' : '#475569', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s ease' 
              }} onMouseEnter={(e) => { if (currentPage !== totalPages && totalPages !== 0) e.currentTarget.style.borderColor = THEME_COLORS.primary; }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      <ParticipantForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveRequest} initialData={editingData} isSaving={isSaving} />

      {confirmState.isOpen && (
        <div className={styles.modalOverlay} style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(30, 41, 59, 0.5)', zIndex: 9999 }}>
          <div className={styles.modalBox} style={{ maxWidth: '440px', width: '90%', padding: '32px', textAlign: 'center', borderRadius: '20px', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0', animation: 'modalPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', zIndex: 9999 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', backgroundColor: confirmState.type === 'danger' ? '#fef2f2' : THEME_COLORS.purpleTint, color: confirmState.type === 'danger' ? '#ef4444' : THEME_COLORS.primary, border: `2px solid ${confirmState.type === 'danger' ? '#fecaca' : THEME_COLORS.purpleLight}` }}>
              {confirmState.type === 'danger' ? <Trash2 size={28} strokeWidth={1.5} /> : <AlertTriangle size={28} strokeWidth={1.5} />}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: THEME_COLORS.textMain, margin: '0 0 10px' }}>{confirmState.title}</h3>
            <p style={{ fontSize: '0.95rem', color: THEME_COLORS.textMuted, lineHeight: '1.5', margin: '0 0 24px' }}>{confirmState.message}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={closeConfirm} style={{ flex: 1, padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}>Cancel</button>
              <button onClick={() => { if (confirmState.onConfirm) confirmState.onConfirm(); closeConfirm(); }} style={{ flex: 1, padding: '10px 20px', borderRadius: '10px', border: 'none', background: confirmState.type === 'danger' ? '#ef4444' : `linear-gradient(135deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.secondary} 100%)`, color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>{confirmState.type === 'danger' ? 'Delete' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes modalPopIn { 0% { opacity: 0; transform: scale(0.9) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};

export default Participants;
