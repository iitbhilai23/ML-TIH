import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { subjectService } from '../../services/subjectService';
import { locationService } from '../../services/locationService';
import styles from './Trainings.module.css';
import { X } from 'lucide-react';

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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.title}>
            {initialData ? 'Edit Training' : 'Schedule New Training'}
          </h3>
          <button onClick={onClose} className={styles.closeIconBtn}>
            <X size={20} />
          </button>
        </div>

        {loading && <div className={styles.loadingState}>Loading data...</div>}

        {!loading && (
          <form onSubmit={handleSubmit}>
            
            {/* Dropdowns Row 1 */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Subject *</label>
                <select 
                  required 
                  name="subject_id" 
                  className={styles.input} 
                  value={formData.subject_id} 
                  onChange={handleChange}
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Assign Trainer *</label>
                <select 
                  required 
                  name="trainer_id" 
                  className={styles.input} 
                  value={formData.trainer_id} 
                  onChange={handleChange}
                >
                  <option value="">-- Choose Trainer --</option>
                  {trainers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Dropdown */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Location *</label>
              <select 
                required 
                name="location_id" 
                className={styles.input} 
                value={formData.location_id} 
                onChange={handleChange}
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
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Start Date *</label>
                <input 
                  required 
                  type="date" 
                  name="start_date" 
                  className={styles.input} 
                  value={formData.start_date} 
                  onChange={handleChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>End Date</label>
                <input 
                  type="date" 
                  name="end_date" 
                  className={styles.input} 
                  value={formData.end_date} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Status & Capacity */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Max Participants</label>
                <input 
                  type="number" 
                  name="max_participants" 
                  className={styles.input} 
                  value={formData.max_participants} 
                  onChange={handleChange} 
                  min="1" 
                  max="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Current Status</label>
                <select 
                  name="status" 
                  className={styles.input} 
                  value={formData.status} 
                  onChange={handleChange}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button 
                type="button" 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`${styles.btn} ${styles.btnPrimary}`}
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

