import React, { useState, useEffect, useRef } from 'react';
import { trainerService } from '../../services/trainerService';
import styles from './Trainers.module.css';
import { toast, Toaster } from 'sonner';

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8' }}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
)

// REMOVED showToast from props
const TrainerForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', bio: '', profile_image_url: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  const cleanPayload = (data) =>
    Object.fromEntries(
      Object.entries(data).filter(
        ([_, v]) => v !== null && v !== undefined
      )
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let trainer;

      if (initialData) {
        trainer = await trainerService.updateTrainer(
          initialData.id,
          cleanPayload({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
          })
        );
      } else {
        trainer = await trainerService.createTrainer({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
        });
      }

      if (selectedFile) {
        const uploadRes = await trainerService.uploadTrainerPhoto(
          trainer.id,
          selectedFile
        );

        await trainerService.updateTrainer(trainer.id, {
          profile_image_url: uploadRes.file_url,
        });
      }

      // SONNER TOAST
      toast.success(
        initialData
          ? 'Trainer updated successfully!'
          : 'Trainer created successfully!'
      );

      onSubmit();
      onClose();
    } catch (error) {
      console.error(error);
      // SONNER TOAST
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <CameraIcon />
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
              <label className={styles.label}>Email Address *</label>
              <input
                required
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
                type="text"
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
            <button type="button" onClick={onClose} className={`${styles.btn}`} style={{ background: '#f1f5f9', color: '#333' }}>Cancel</button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.primary}`}
              disabled={isUploading}
            >
              {isUploading && <div className={styles.spinner}></div>}
              <span>{isUploading ? 'Saving...' : (initialData ? 'Update Trainer' : 'Save Trainer')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerForm;

