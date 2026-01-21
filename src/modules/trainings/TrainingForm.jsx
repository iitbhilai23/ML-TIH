import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { subjectService } from '../../services/subjectService';
import { locationService } from '../../services/locationService';
import { X } from 'lucide-react';


const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 16px 24px',
    borderBottom: '1px solid #f1f5f9',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
  },
  closeIconBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '50%',
    transition: 'background 0.2s',
  },
  closeIconBtnHover: {
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
  },
  loadingState: {
    padding: '40px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
    // Responsive fallback
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  formGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '6px',
    letterSpacing: '0.025em',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#1e293b',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    outline: 'none',
    boxSizing: 'border-box', // Ensure padding doesn't affect width
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnPrimary: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  btnPrimaryHover: {
    backgroundColor: '#2563eb',
  },
  btnSecondary: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    color: '#475569',
  },
  btnSecondaryHover: {
    backgroundColor: '#f8fafc',
    borderColor: '#94a3b8',
  },
};

const TrainingForm = ({ isOpen, onClose, onSubmit, initialData }) => {
 
  const [trainers, setTrainers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    trainer_id: '', 
    subject_id: '', 
    location_id: '',
    start_date: '', 
    end_date: '', 
    max_participants: 50, 
    status: 'scheduled'
  });

  useEffect(() => {
    if (isOpen) {
      loadDropdowns();
      if (initialData) {
        // Format dates for input field (YYYY-MM-DD)
        const formattedStart = initialData.start_date ? 
          new Date(initialData.start_date).toISOString().split('T')[0] : '';
        const formattedEnd = initialData.end_date ? 
          new Date(initialData.end_date).toISOString().split('T')[0] : '';
        
        setFormData({ 
          ...initialData, 
          start_date: formattedStart, 
          end_date: formattedEnd 
        });
      } else {
        // Reset form
        setFormData({ 
          trainer_id: '', 
          subject_id: '', 
          location_id: '', 
          start_date: '', 
          end_date: '', 
          max_participants: 50, 
          status: 'scheduled' 
        });
      }
    }
  }, [isOpen, initialData]);

  const loadDropdowns = async () => {
    setLoading(true);
    try {
      const [tData, sData, lData] = await Promise.all([
        trainerService.getAllTrainers(),
        subjectService.getAll(),
        locationService.getAll({ limit: 100 })
      ]);
      setTrainers(tData);
      setSubjects(sData);
      setLocations(lData);
    } catch (error) {
      console.error("Failed to load dropdowns:", error);
      alert('Failed to load dropdown data');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const needsNumber = ['trainer_id', 'subject_id', 'location_id', 'max_participants'].includes(name);
    setFormData({ 
      ...formData, 
      [name]: needsNumber ? (value === '' ? '' : Number(value)) : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.trainer_id || !formData.subject_id || !formData.location_id || !formData.start_date) {
      alert('Please fill all required fields');
      return;
    }
    
    // Create clean data object for API
    const cleanData = { ...formData };
    delete cleanData.id;           
    delete cleanData.actual_participants; 
    delete cleanData.created_at;  
    delete cleanData.updated_at;   
    
    onSubmit(cleanData); 
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        
        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <h3 style={styles.title}>
            {initialData ? 'Edit Training' : 'Schedule New Training'}
          </h3>
          <button 
            onClick={onClose} 
            style={styles.closeIconBtn}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.closeIconBtnHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: 'transparent', color: '#64748b' })}
          >
            <X size={20} />
          </button>
        </div>

        {loading && <div style={styles.loadingState}>Loading data...</div>}

        {!loading && (
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            
            {/* Dropdowns Row 1 */}
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Subject *</label>
                <select 
                  required 
                  name="subject_id" 
                  style={styles.input}
                  value={formData.subject_id} 
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Assign Trainer *</label>
                <select 
                  required 
                  name="trainer_id" 
                  style={styles.input}
                  value={formData.trainer_id} 
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                >
                  <option value="">-- Choose Trainer --</option>
                  {trainers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Dropdown */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Location *</label>
              <select 
                required 
                name="location_id" 
                style={styles.input}
                value={formData.location_id} 
                onChange={handleChange}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
              >
                <option value="">-- Choose Location (Village - Block) --</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.village} ({l.block}, {l.district})
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date *</label>
                <input 
                  required 
                  type="date" 
                  name="start_date" 
                  style={styles.input}
                  value={formData.start_date} 
                  onChange={handleChange} 
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>End Date</label>
                <input 
                  type="date" 
                  name="end_date" 
                  style={styles.input}
                  value={formData.end_date} 
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                />
              </div>
            </div>

            {/* Status & Capacity */}
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Max Participants</label>
                <input 
                  type="number" 
                  name="max_participants" 
                  style={styles.input}
                  value={formData.max_participants} 
                  onChange={handleChange} 
                  min="1" 
                  max="1000"
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Current Status</label>
                <select 
                  name="status" 
                  style={styles.input}
                  value={formData.status} 
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button 
                type="button" 
                style={{...styles.btn, ...styles.btnSecondary}}
                onClick={onClose}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.btnSecondaryHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#fff', borderColor: '#cbd5e1', color: '#475569' })}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{...styles.btn, ...styles.btnPrimary}}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.btnPrimaryHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#3b82f6', color: '#fff' })}
              >
                {initialData ? 'Update Schedule' : 'Create Schedule'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TrainingForm;
