
import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import TrainerForm from './TrainerForm';
import styles from './Trainers.module.css';
import { Plus, Search, Pencil, Trash2, User, Users, ChevronLeft, ChevronRight, AlertTriangle, Check } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import { toast, Toaster } from 'sonner';
import { useExport } from '../../features/export/useExport';
import ExportButtons from '../../features/export/ExportButton';
import DataTable from '../../components/common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

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
  const { exportPDF, exportExcel } = useExport(trainers);

  // Updated columns for export (Removed Email and Phone)
  const trainerColumns = [
    { header: "No", dataKey: "index" },
    { header: "Name", dataKey: "name" },
    { header: "Bio", dataKey: "bio" }
  ];

  const THEME = {
    primary: '#6366f1',
    danger: '#ef4444',
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchTrainers();
  }, [searchTerm]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const data = await trainerService.getAllTrainers(searchTerm);
      // const sortedData = Array.isArray(data)
      //   ? [...data].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      //   : [];
      const sortedData = Array.isArray(data)
        ? [...data].sort((a, b) =>
          (a.name || "")
            .trim()
            .localeCompare((b.name || "").trim(), undefined, {
              sensitivity: "base",
            })
        )
        : [];
      setTrainers(sortedData);
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
      toast.error('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  // --- API LOGIC (Executed after confirmation) ---

  const executeSave = async (data, file) => {
    setIsSaving(true);
    try {
      let trainer;

      if (editingTrainer) {
        // Update Trainer
        trainer = await trainerService.updateTrainer(
          editingTrainer.id,
          {
            name: data.name,
            email: data.email, // Still sending to API in case backend requires it
            phone: data.phone, // Still sending to API
            bio: data.bio,
          }
        );
      } else {
        // Create Trainer
        trainer = await trainerService.createTrainer({
          name: data.name,
          email: data.email,
          phone: data.phone,
          bio: data.bio,
        });
      }

      // Handle File Upload if exists
      if (file) {
        const uploadRes = await trainerService.uploadTrainerPhoto(
          trainer.id,
          file
        );
        await trainerService.updateTrainer(trainer.id, {
          profile_image_url: uploadRes.file_url,
        });
      }

      toast.success(
        editingTrainer
          ? 'Trainer updated successfully!'
          : 'Trainer created successfully!'
      );

      setIsModalOpen(false);
      setEditingTrainer(null);
      fetchTrainers();
    } catch (error) {
      console.error('Could not save trainer:', error);
      toast.error('Could not save trainer: ' + (error.message || 'Something went wrong'));
    } finally {
      setIsSaving(false);
    }
  };

  const executeDelete = async (id) => {
    try {
      await trainerService.deleteTrainer(id);
      toast.success('Trainer deleted successfully!');
      fetchTrainers();
    } catch (error) {
      console.error('Could not delete trainer:', error);
      toast.error('Could not delete trainer: ' + error.message);
    }
  };

  // --- HANDLERS (Triggers Confirmation) ---

  const handleSaveRequest = (data, file) => {
    if (editingTrainer) {
      openConfirm(
        'Save Changes?',
        'Are you sure you want to update the details for this trainer?',
        () => executeSave(data, file),
        'primary'
      );
    } else {
      executeSave(data, file);
    }
  };

  const handleDeleteClick = (id) => {
    openConfirm(
      'Delete Trainer?',
      'This action cannot be undone. This will permanently remove the trainer from the database.',
      () => executeDelete(id),
      'danger'
    );
  };

  const openAddModal = () => {
    setEditingTrainer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (trainer) => {
    setEditingTrainer(trainer);
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
  const currentTrainers = trainers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(trainers.length / itemsPerPage);

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              Trainers Management
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)', padding: '6px 16px', borderRadius: '9999px', border: '1px solid rgba(192, 132, 252, 0.35)', alignSelf: 'flex-start', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)' }}>
              <Users size={18} color="#7c3aed" strokeWidth={2.2} />
              <span style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Trainers</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#3b0764', lineHeight: 1 }}>{trainers.length}</span>
            </div>
          </div>

          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '520px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', transition: 'color 0.2s' }} />
            <input
              type="text"
              placeholder="Search by name..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 46px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 500, color: '#334155', backgroundColor: '#f8fafc', outline: 'none', transition: 'all 0.2s ease' }}
              onFocus={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(168, 85, 247, 0.12)'; }}
              onBlur={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: '0 0 auto' }}>
            <ExportButtons
              onPDF={() => exportPDF({
                title: "Trainers Report",
                columns: trainerColumns,
                fileName: "trainers_report.pdf",
                mapper: (trainer, index) => ({
                  index: index + 1,
                  name: trainer.name || "N/A",
                  bio: trainer.bio || "N/A"
                })
              })
              }
              onExcel={() => exportExcel({
                fileName: "trainers_report.csv",
                mapper: (trainer, index) => ({
                  No: index + 1,
                  Name: trainer.name || "N/A",
                  Bio: trainer.bio || "N/A"
                })
              })
              }
            />

            <button onClick={openAddModal} style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)', color: 'white', padding: '14px 24px', borderRadius: '12px', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)', transition: 'all 0.2s ease', fontFamily: 'inherit' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(124, 58, 237, 0.45)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.35)'; }}>
              <Plus size={18} /> Add Trainer
            </button>
          </div>
        </div>
      </div>

      {/* --- TanStack Table v8 --- */}
      <DataTable
        data={trainers}
        columns={[
          {
            accessorKey: 'name',
            header: () => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Trainer
              </div>
            ),
            cell: ({ row }) => {
              const trainer = row.original;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {trainer.profile_image_url ? (
                    <img
                      src={`${trainer.profile_image_url}?t=${Date.now()}`}
                      alt={trainer.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7B3F99, #9B59B6)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                      }}
                    >
                      {(trainer.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{trainer.name || 'Unknown Trainer'}</span>
                </div>
              );
            },
          },
          {
            accessorKey: 'bio',
            header: 'Bio / Specialization',
            cell: ({ getValue }) => (
              <div style={{ maxWidth: '250px', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>
                {getValue() || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>No bio provided</span>}
              </div>
            ),
          },
          {
            accessorKey: 'profile_image_url',
            id: 'profile',
            header: 'Profile',
            meta: { align: 'center' },
            cell: ({ getValue }) =>
              getValue() ? (
                <span
                  style={{
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
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✓ Set
                </span>
              ) : null,
          },
          {
            id: 'actions',
            header: 'Actions',
            meta: { align: 'center' },
            cell: ({ row }) => {
              const trainer = row.original;
              return (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
                      transition: 'all 0.2s ease',
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
                    onClick={() => handleDeleteClick(trainer.id)}
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
                      transition: 'all 0.2s ease',
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
              );
            },
          },
        ]}
        loading={loading}
        globalFilter={searchTerm}
        pageSize={itemsPerPage}
        emptyText={searchTerm ? 'No trainers match your search' : 'No trainers found. Add your first trainer to get started.'}
        emptyIcon={<Users size={56} style={{ margin: '0 auto 12px', opacity: 0.25, color: '#94a3b8' }} />}
      />

      {/* --- TRAINER FORM (Refactored) --- */}
      <TrainerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRequest}
        initialData={editingTrainer}
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

export default TrainerList;
