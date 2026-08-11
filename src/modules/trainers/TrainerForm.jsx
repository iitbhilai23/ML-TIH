import React, { useState, useEffect, useRef } from 'react';
import styles from './Trainers.module.css';

// Props: initialData, onSave (callback), isSaving (boolean), onClose
const TrainerForm = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', bio: '', profile_image_url: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.profile_image_url) {
        setFilePreview(initialData.profile_image_url);
      }
    } else {
      setFormData({ name: '', email: '', phone: '', bio: '', profile_image_url: '' });
      setSelectedFile(null);
      setFilePreview('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const trainerInitial = (formData.name || '?').trim().charAt(0).toUpperCase() || '?';

  // Updated cleanPayload: Ab empty strings ('') ko bhi filter karega
  // Taake backend ko khali email/phone na bhejena pade.
  const cleanPayload = (data) =>
    Object.fromEntries(
      Object.entries(data).filter(
        ([_, v]) => v !== null && v !== undefined && v !== ''
      )
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare clean data
    const dataToSave = cleanPayload({
      name: (formData.name || '').trim(),
      email: (formData.email || '').trim(),
      phone: (formData.phone || '').replace(/\D/g, ''),
      bio: (formData.bio || '').trim(),
    });

    // Pass data and file up to parent
    onSave(dataToSave, selectedFile);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.title} style={{ marginBottom: '20px' }}>
          {initialData ? 'Edit Trainer' : 'Add New Trainer'}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Profile Image</label>
            <div onClick={() => fileInputRef.current.click()}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '2px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                background: '#f8fafc',
                margin: '0 auto',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.background = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.background = '#f8fafc';
              }}
            >
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="preview"
                  onError={() => setFilePreview('')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span
                  aria-label="Trainer initial"
                  style={{ color: '#7B3F99', fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}
                >
                  {trainerInitial}
                </span>
              )}

              <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                fontSize: '10px',
                textAlign: 'center',
                padding: '4px 0',
                opacity: 0,
                transition: 'opacity 0.2s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
              >
                Change
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Click above to upload (Max 5MB)</small>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name *</label>
            <input
              required
              className={styles.input}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <div className={styles.formGroup} style={{ flex: 1 }}>
              {/* CHANGE 1: Label se '*' hata diya */}
              <label className={styles.label}>Email Address</label>
              {/* CHANGE 2: 'required' attribute hata diya */}
              <input
                className={styles.input}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Bio */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Bio / Specialization</label>
            <textarea
              className={styles.input}
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button 
                type="button" 
                onClick={onClose} 
                className={`${styles.btn}`} 
                style={{ background: '#f1f5f9', color: '#333' }}
                disabled={isSaving}
            >
                Cancel
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.primary}`}
              disabled={isSaving}
            >
              {isSaving && <div className={styles.spinner}></div>}
              <span>{isSaving ? 'Saving...' : (initialData ? 'Update Trainer' : 'Save Trainer')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerForm;
