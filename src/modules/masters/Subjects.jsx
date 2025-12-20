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
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>Subjects / Topics</h2>
        <button className={`${styles.btn} ${styles.primary}`} onClick={openAdd}>
          <Plus size={18} /> Add Subject
        </button>
      </div>

      <div className={styles.filterBar}>
        <Search size={20} color="#94a3b8" />
        <input 
          className={styles.searchInput} placeholder="Search subjects..." 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{width: '60px'}}>ID</th>
                <th style={{width: '250px'}}>Subject Name</th>
                <th>Description</th>
                <th style={{width: '100px', textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => (
                <tr key={sub.id}>
                  <td><span style={{fontWeight:'bold', color:'var(--primary)'}}>#{sub.id}</span></td>
                  <td style={{fontWeight:500}}>{sub.name}</td>
                  <td style={{color:'#64748b'}}>{sub.description || '-'}</td>
                  <td>
                    <div style={{display:'flex', gap:'8px', justifyContent:'center'}}>
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
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea rows="3" className={styles.textarea} value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" className={`${styles.btn} ${styles.primary}`} style={{width:'100%', justifyContent:'center'}}>
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