import React, { useState, useEffect } from 'react';
import { subjectService } from '../../services/subjectService';
import styles from './Masters.module.css';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });

  useEffect(() => { loadSubjects(); }, [searchTerm]);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await subjectService.getAll(searchTerm);
      setSubjects(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const cleanPayload = (data) => {
    const cleaned = {};
    Object.keys(data).forEach(key => {
      if (
        data[key] !== '' &&
        data[key] !== null &&
        data[key] !== undefined &&
        key !== 'id'       //  MOST IMPORTANT
      ) {
        cleaned[key] = data[key];
      }
    });
    return cleaned;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = cleanPayload(formData);

      if (formData.id) {
        await subjectService.update(formData.id, payload);
        alert('Subject updated successfully');
      } else {
        await subjectService.create(payload);
        alert('Subject created successfully');
      }

      setIsModalOpen(false);
      loadSubjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Operation Failed');
    }
  };


  const openEdit = (sub) => {
    setFormData({
      id: sub.id,
      name: sub.name,
      description: sub.description || ''
    });
    setIsModalOpen(true);
  };


  const openAdd = () => {
    setFormData({ id: null, name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;

    try {
      await subjectService.delete(id);
      alert('Subject deleted successfully');
      loadSubjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Delete failed');
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
          background: 'white',
          padding: '20px 24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Plus size={24} style={{ color: '#6366f1', transform: 'rotate(45deg)' }} />
              Subjects / Topics
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              margin: 0
            }}>
              Manage training subjects and course topics
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              padding: '12px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '2px'
              }}>
                Total Subjects
              </div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1
              }}>
                {subjects.length}
              </div>
            </div>
            <button
              onClick={openAdd}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              <Plus size={18} /> Add Subject
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          background: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ position: 'relative', maxWidth: '500px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              placeholder="Search subjects..."
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
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th style={{ width: '250px' }}>Subject Name</th>
                <th>Description</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => (
                <tr key={sub.id}>
                  <td><span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>#{sub.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{sub.name}</td>
                  <td style={{ color: '#64748b' }}>{sub.description || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button className={`${styles.iconBtn} ${styles.edit}`} onClick={() => openEdit(sub)}>
                        <Pencil size={16} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => handleDelete(sub.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{formData.id ? 'Edit Subject' : 'New Subject'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Subject Name *</label>
                <input required className={styles.input} value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea rows="3" className={styles.textarea} value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <button type="submit" className={`${styles.btn} ${styles.primary}`} style={{ width: '100%', justifyContent: 'center' }}>
                Save Subject
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;