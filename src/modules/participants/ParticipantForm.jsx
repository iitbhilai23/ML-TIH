import React, { useState, useEffect } from 'react';
import { trainingService } from '../../services/trainingService';
import styles from './Participants.module.css';
import { X, User, Camera } from 'lucide-react';
import { toast } from 'sonner';

const ParticipantForm = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
  const [trainings, setTrainings] = useState([]);

  const [formData, setFormData] = useState({
    training_id: '', name: '', phone: '', age: '',
    caste: '', education: '', category: '', attendance_status: 'present',
    profile_image_url: ''
  });

  const cleanPayload = (data) => {
    const payload = { ...data };
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        delete payload[key];
      }
    });
    return payload;
  };

  // --- NEW: Image Compressor Function ---
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Maximum dimensions (resize to thumbnail size)
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          // Maintain Aspect Ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to Base64 with 0.7 quality (70%)
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData({ ...formData, profile_image_url: compressedBase64 });
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error('Failed to process image. Please try another file.');
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTrainings();

      if (initialData) {
        setFormData({
          training_id: initialData.training_id,
          name: initialData.name || '',
          phone: initialData.phone || '',
          age: initialData.age || '',
          caste: initialData.caste || '',
          education: initialData.education || '',
          category: initialData.category || '',
          attendance_status: initialData.attendance_status || 'present',
          profile_image_url: initialData.profile_image_url || '',
        });
      } else {
        setFormData({
          training_id: '', name: '', phone: '', age: '',
          caste: '', education: '', category: '', attendance_status: 'present',
          profile_image_url: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const loadTrainings = async () => {
    try {
      const data = await trainingService.getAll();
      setTrainings(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trainings list');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'training_id' || name === 'age') {
      setFormData({ ...formData, [name]: value ? Number(value) : '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        {/* Modern Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {initialData ? 'Edit Participant' : 'Register New Participant'}
          </h3>
          <button
            onClick={onClose}
            className={styles.closeIconBtn}
            aria-label="Close modal"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Image Upload Section --- */}
        <div className={styles.imageUploadSection}>
          <input
            type="file"
            id="profileImageInput"
            hidden
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSaving}
          />
          <div
            className={styles.imageUploaderBox}
            onClick={() => !isSaving && document.getElementById('profileImageInput').click()}
            style={{ opacity: isSaving ? '0.6' : '1', cursor: isSaving ? 'not-allowed' : 'pointer' }}
          >
            {formData.profile_image_url ? (
              <img src={formData.profile_image_url} alt="Profile" className={styles.previewImg} />
            ) : (
              <User size={20} className={styles.uploadPlaceholderIcon} />
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', }}>
          <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Click above to upload (Max 5MB)</small>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          // Pass clean data up to parent (Parent handles confirm & API)
          onSave(cleanPayload(formData));
        }}>

          {/* Training Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Training Batch *</label>
            <select
              name="training_id"
              className={styles.input}
              value={formData.training_id}
              onChange={handleChange}
              required
              disabled={isSaving}
            >
              <option value="">Select Training</option>
              {trainings.map(t => (
                <option key={t.id} value={t.id}>
                  {t.subject_name} | {t.trainer_name} | {t.location_details?.village}
                </option>
              ))}
            </select>
          </div>

          {/* Row 1: Name & Phone */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name *</label>
              <input
                required
                name="name"
                className={styles.input}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                disabled={isSaving}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                name="phone"
                className={styles.input}
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                placeholder="10 digit number"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Row 2: Age, Category, Caste (3 Columns) */}
          <div className={styles.row3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Age</label>
              <input
                type="number"
                name="age"
                className={styles.input}
                value={formData.age}
                onChange={handleChange}
                placeholder="Years"
                disabled={isSaving}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                className={styles.input}
                value={formData.category}
                onChange={handleChange}
                disabled={isSaving}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Youth">Youth</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Caste</label>
              <select
                name="caste"
                className={styles.input}
                value={formData.caste}
                onChange={handleChange}
                disabled={isSaving}
              >
                <option value="">Select</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>

          {/* Row 3: Education & Attendance */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Education</label>
              <input
                name="education"
                className={styles.input}
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. 10th Pass"
                disabled={isSaving}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Attendance</label>
              <select
                name="attendance_status"
                className={styles.input}
                value={formData.attendance_status}
                onChange={handleChange}
                disabled={isSaving}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : (initialData ? 'Update Details' : 'Register Participant')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;