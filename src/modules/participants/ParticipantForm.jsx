import React, { useState, useEffect } from 'react';
import { trainingService } from '../../services/trainingService'; 
import styles from './Participants.module.css';
import { X } from 'lucide-react';

const ParticipantForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [trainings, setTrainings] = useState([]);
  
  const [formData, setFormData] = useState({
    training_id: '', name: '', phone: '', age: '', 
    caste: '', education: '', category: '', attendance_status: 'present'
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
        });
      } else {
        setFormData({
          training_id: '',
          name: '',
          phone: '',
          age: '',
          caste: '',
          education: '',
          category: '',
          attendance_status: 'present',
        });
      }
    }
  }, [isOpen, initialData]);

  const loadTrainings = async () => {
    try {
      const data = await trainingService.getAll();
      setTrainings(data);
    } catch (err) { console.error(err); }
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
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(cleanPayload(formData)); }}>
          
          {/* Training Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Training Batch *</label>
            <select
              name="training_id"
              className={styles.input}
              value={formData.training_id}
              onChange={handleChange}
              required
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
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select 
                name="category" 
                className={styles.input} 
                value={formData.category} 
                onChange={handleChange}
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
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Attendance</label>
              <select 
                name="attendance_status" 
                className={styles.input} 
                value={formData.attendance_status} 
                onChange={handleChange}
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
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              {initialData ? 'Update Details' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;

// import React, { useState, useEffect } from 'react';
// import { trainingService } from '../../services/trainingService'; 
// import styles from './Participants.module.css';
// import { X } from 'lucide-react';

// const ParticipantForm = ({ isOpen, onClose, onSubmit, initialData }) => {
//   const [trainings, setTrainings] = useState([]);
  
//   const [formData, setFormData] = useState({
//     training_id: '', name: '', phone: '', age: '', 
//     caste: '', education: '', category: '', attendance_status: 'present'
//   });

// const cleanPayload = (data) => {
//   const payload = { ...data };

//   Object.keys(payload).forEach(key => {
//     if (payload[key] === '') {
//       delete payload[key]; 
//     }
//   });

//   return payload;
// };

//   useEffect(() => {
//   if (isOpen) {
//     loadTrainings();

//     if (initialData) {
//       setFormData({
//         training_id: initialData.training_id,
//         name: initialData.name || '',
//         phone: initialData.phone || '',
//         age: initialData.age || '',
//         caste: initialData.caste || '',
//         education: initialData.education || '',
//         category: initialData.category || '',
//         attendance_status: initialData.attendance_status || 'present',
//       });
//     } else {
//       setFormData({
//         training_id: '',
//         name: '',
//         phone: '',
//         age: '',
//         caste: '',
//         education: '',
//         category: '',
//         attendance_status: 'present',
//       });
//     }
//   }
// }, [isOpen, initialData]);


//   const loadTrainings = async () => {
//     try {
//      const data = await trainingService.getAll();
// setTrainings(data);

//     } catch (err) { console.error(err); }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
  

//     if (name === 'training_id' || name === 'age') {
//     setFormData({ ...formData, [name]: value ? Number(value) : '' });
//   } else {
//     setFormData({ ...formData, [name]: value });
//   }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalBox}>
//         <div className="flex justify-between items-center mb-5 border-b pb-3">
//            <h3 className="font-bold text-lg">{initialData ? 'Edit Participant' : 'Register New Participant'}</h3>
//            <button onClick={onClose}><X size={20} /></button>
//         </div>

//         <form onSubmit={(e) => { e.preventDefault(); onSubmit(cleanPayload(formData)); }}>
          
//           {/* Training Selection */}
//           <div className={styles.formGroup}>
//             <label className={styles.label}>Select Training Batch *</label>
        

          
//             <select
//   name="training_id"
//   value={formData.training_id}
//   onChange={handleChange}
//   required
// >

//   <option value="">Select Training</option>
//   {trainings.map(t => (
//     <option key={t.id} value={t.id}>
//       {t.subject_name} | {t.trainer_name} | {t.location_details?.village}
//     </option>
//   ))}
// </select>

//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Full Name *</label>
//               <input required name="name" className={styles.input} value={formData.name} onChange={handleChange} />
//             </div>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Phone Number</label>
//               <input name="phone" className={styles.input} value={formData.phone} onChange={handleChange} maxLength={10}/>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-3 mb-4">
//              <div>
//                <label className={styles.label}>Age</label>
//                <input type="number" name="age" className={styles.input} value={formData.age} onChange={handleChange} />
//              </div>
//              <div>
//                <label className={styles.label}>Gender / Category</label>
//                <select name="category" className={styles.input} value={formData.category} onChange={handleChange}>
//                  <option value="">Select</option>
//                  <option value="Male">Male</option>
//                  <option value="Female">Female</option>
//                  <option value="Youth">Youth</option>
//                </select>
//              </div>
//              <div>
//                 <label className={styles.label}>Caste</label>
//                 <select name="caste" className={styles.input} value={formData.caste} onChange={handleChange}>
//                   <option value="">Select</option>
//                   <option value="General">General</option>
//                   <option value="OBC">OBC</option>
//                   <option value="SC">SC</option>
//                   <option value="ST">ST</option>
//                 </select>
//              </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Education</label>
//               <input name="education" className={styles.input} value={formData.education} onChange={handleChange} placeholder="e.g. 10th Pass"/>
//             </div>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Attendance</label>
//               <select name="attendance_status" className={styles.input} value={formData.attendance_status} onChange={handleChange}>
//                 <option value="present">Present</option>
//                 <option value="absent">Absent</option>
//                 <option value="late">Late</option>
//               </select>
//             </div>
//           </div>

//           <button type="submit" className={styles.btn} style={{width:'100%'}}>
//             {initialData ? 'Update Details' : 'Register Student'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ParticipantForm;