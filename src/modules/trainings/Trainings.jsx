import React, { useState, useEffect, useCallback } from 'react';
import { trainingService } from '../../services/trainingService';
import TrainingForm from './TrainingForm';
import styles from './Trainings.module.css';
import { Plus, Pencil, Trash2, Calendar, MapPin, User, BookOpen, ChevronLeft, ChevronRight, AlertTriangle, Check, FileText, Table } from 'lucide-react';
import '../../styles/shared.css';
import Spinner from '../../components/common/Spinner';
import { toast, Toaster } from 'sonner';
import { useExport } from '../../features/export/useExport';
import ExportButtons from '../../features/export/ExportButton';
import DataTable from '../../components/common/DataTable';


// --- HELPER FUNCTIONS MOVED OUTSIDE COMPONENT (Performance Fix) ---

const getTrainingDetails = (training) => {
  if (!training) return {
    subject_name: 'Marketplace Literacy',
    trainer_name: 'N/A',
    location_details: {},
    start_date: null,
    end_date: null,
    actual_participants: 0,
    max_participants: 0,
    status: 'scheduled',
    id: null
  };

  let rawSubject = training.subject_name || 'Marketplace Literacy';
  let subject = rawSubject;
  if (!rawSubject || rawSubject === 'N/A' || /advanced/i.test(rawSubject) || /digital/i.test(rawSubject)) {
    subject = 'Marketplace Literacy';
  }

  return {
    subject_name: subject,
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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};


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
    type: 'danger'
  });

  // Saving State
  const [isSaving, setIsSaving] = useState(false);
  const { exportPDF, exportExcel } = useExport(trainings);

  // --- API LOGIC ---

  const loadTrainings = useCallback(async () => {
    setLoading(true);
    try {
      const filters = filterStatus ? { status: filterStatus } : {};
      // const data = await trainingService.getAll(filters);
      // setTrainings(data);
      const data = await trainingService.getAll(filters);

const sortedTrainings = Array.isArray(data)
  ? [...data].sort((a, b) =>
      (a.trainer_name || "")
        .trim()
        .localeCompare(
          (b.trainer_name || "").trim(),
          undefined,
          { sensitivity: "base" }
        )
    )
  : [];

setTrainings(sortedTrainings);
    } catch (err) {
      console.error('Failed to load trainings:', err);
      toast.error('Failed to load trainings');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadTrainings();
    setCurrentPage(1);
  }, [loadTrainings]);

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

  // --- HANDLERS ---

  const handleSaveRequest = (data) => {
    if (editingTraining) {
      openConfirm(
        'Save Changes?',
        'Are you sure you want to update the details for this training?',
        () => executeSave(data),
        'primary'
      );
    } else {
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

  const handlePDFExport = () => {
    exportPDF({
      title: 'Trainings Report',
      fileName: 'trainings.pdf',
      columns: [
        { header: '#', dataKey: 'index' },
        { header: 'Trainer', dataKey: 'trainer' },
        { header: 'Subject', dataKey: 'subject' },
        { header: 'Location', dataKey: 'location' },
        { header: 'Start Date', dataKey: 'start' },
        { header: 'End Date', dataKey: 'end' },
        { header: 'Participants', dataKey: 'participants' },
        { header: 'Status', dataKey: 'status' }
      ],
      mapper: (t, index) => {
        const d = getTrainingDetails(t);
        return {
          index: index + 1,
          trainer: d.trainer_name,
          subject: d.subject_name,
          location: `${d.location_details?.village || 'N/A'}, ${d.location_details?.block || 'N/A'}`,
          start: formatDate(d.start_date),
          end: formatDate(d.end_date),
          participants: `${d.actual_participants} / ${d.max_participants}`,
          status: d.status.charAt(0).toUpperCase() + d.status.slice(1)
        };
      }
    });
  };

  const handleExcelExport = () => {
    exportExcel({
      fileName: 'trainings.csv',
      mapper: (t, index) => {
        const d = getTrainingDetails(t);
        return {
          No: index + 1,
          'Trainer Name': d.trainer_name,
          'Subject': d.subject_name,
          'Village': d.location_details?.village || 'N/A',
          'Block': d.location_details?.block || 'N/A',
          'District': d.location_details?.district || 'N/A',
          'Start Date': formatDate(d.start_date),
          'End Date': formatDate(d.end_date),
          'Actual Participants': d.actual_participants,
          'Max Participants': d.max_participants,
          'Status': d.status.charAt(0).toUpperCase() + d.status.slice(1)
        };
      }
    });
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

          {/* Action Buttons Area */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: '0 0 auto' }}>

            <div style={{ display: 'flex', gap: '8px' }}>
              <ExportButtons
                onPDF={handlePDFExport}
                onExcel={handleExcelExport}
              />
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '30px', background: '#e2e8f0' }}></div>

            {/* Add Button */}
            <button
              onClick={openAdd}
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
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
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(124, 58, 237, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.35)';
              }}
            >
              <Plus size={18} /> Add Training
            </button>
          </div>
        </div>
      </div>

      {/* --- TanStack Table v8 --- */}
      <DataTable
        data={trainings}
        columns={[
          {
            id: 'index',
            header: '#',
            size: 50,
            cell: ({ row }) => (
              <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem' }}>
                {row.index + 1}
              </span>
            ),
          },
          {
            accessorKey: 'trainer_name',
            header: () => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={12} /> Trainer
              </div>
            ),
            cell: ({ row }) => {
              const details = getTrainingDetails(row.original);
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    {(details.trainer_name || '?').charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{details.trainer_name}</span>
                </div>
              );
            },
          },
          {
            accessorKey: 'subject_name',
            header: () => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={12} /> Subject
              </div>
            ),
            cell: ({ row }) => {
              const details = getTrainingDetails(row.original);
              return (
                <div style={{ fontWeight: 700, color: '#6b21a8', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={13} color="#a855f7" />
                  {details.subject_name}
                </div>
              );
            },
          },
          {
            id: 'location',
            header: () => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={12} /> Location
              </div>
            ),
            cell: ({ row }) => {
              const details = getTrainingDetails(row.original);
              return (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                    <MapPin size={13} color="#10b981" />
                    {details.location_details?.village || 'N/A'}, {details.location_details?.block || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', paddingLeft: '18px' }}>
                    {details.location_details?.district || 'N/A'}
                  </div>
                </div>
              );
            },
          },
          {
            id: 'dates',
            header: () => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={12} /> Dates
              </div>
            ),
            cell: ({ row }) => {
              const details = getTrainingDetails(row.original);
              return (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                    <Calendar size={13} color="#6366f1" />
                    {formatDate(details.start_date)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', paddingLeft: '18px' }}>
                    → {formatDate(details.end_date)}
                  </div>
                </div>
              );
            },
          },
          {
            id: 'participants',
            header: 'Participants',
            cell: ({ row }) => {
              const details = getTrainingDetails(row.original);
              return (
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  {details.actual_participants}
                </div>
              );
            },
          },
          /* {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
              const details = getTrainingDetails(row.original);
              return (
                <span className={`${styles.badge} ${styles[details.status]}`}>
                  {details.status}
                </span>
              );
            },
          }, */
          {
            id: 'actions',
            header: 'Actions',
            meta: { align: 'center' },
            cell: ({ row }) => {
              const t = row.original;
              const details = getTrainingDetails(t);
              return (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button
                    onClick={() => openEdit(t)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 13px', borderRadius: '99px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s ease', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.color = '#4338ca'; e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(details.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 13px', borderRadius: '99px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#991b1b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s ease', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              );
            },
          },
        ]}
        loading={loading}
        pageSize={itemsPerPage}
        emptyText="No trainings found. Add your first training to get started."
        emptyIcon={<BookOpen size={48} style={{ margin: '0 auto 12px', opacity: 0.2, color: '#94a3b8' }} />}
      />

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
    </div>
  );
};

export default Trainings;