import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import TrainerForm from './TrainerForm';
import styles from './Trainers.module.css';
import { Plus, Search, Pencil, Trash2, Phone, Mail } from 'lucide-react';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, [searchTerm]);

const fetchTrainers = async () => {
  setLoading(true);
  try {
    const data = await trainerService.getAllTrainers(searchTerm);

    //  FORCE RE-RENDER (NO MANUAL REFRESH NEEDED)
    setTrainers(Array.isArray(data) ? [...data] : []);
  } catch (error) {
    console.error('Failed to fetch trainers:', error);
    alert('Failed to fetch trainers');
  } finally {
    setLoading(false);
  }
};


//   const handleSave = async (formData) => {
//   try {
//     if (editingTrainer) {
//       await trainerService.updateTrainer(editingTrainer.id, formData);
//       alert('Trainer updated successfully!');
//     } else {
//       await trainerService.createTrainer(formData);
//       alert('Trainer created successfully!');
//     }
//     setIsModalOpen(false);
//     setEditingTrainer(null);
//     fetchTrainers(); // Force refresh after save
//   } catch (error) {
//     console.error('Error saving trainer:', error);
//     alert('Error saving trainer: ' + error.message);
//   }
// };

const handleSave = async () => {
  // setIsModalOpen(false);
  // setEditingTrainer(null);
  await fetchTrainers(); // list refresh
};


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await trainerService.deleteTrainer(id);
        fetchTrainers();
        alert('Trainer deleted successfully!');
      } catch (error) {
        console.error('Could not delete trainer:', error);
        alert('Could not delete trainer: ' + error.message);
      }
    }
  };

  const openAddModal = () => {
    setEditingTrainer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (trainer) => {
    setEditingTrainer(trainer);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Trainer Management</h2>
        <button className={`${styles.btn} ${styles.primary}`} onClick={openAddModal}>
          <Plus size={18} /> Add New Trainer
        </button>
      </div>

      <div className={styles.header}>
        <div style={{position: 'relative'}}>
            <Search size={16} style={{position: 'absolute', left: 10, top: 10, color: '#94a3b8'}}/>
            <input 
              type="text" 
              className={styles.searchBox} 
              placeholder="Search by name, email or phone..." 
              style={{paddingLeft: '35px'}}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Trainer Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Bio / Specialization</th>
                <th>Profile Image</th>
                <th style={{textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="6" style={{textAlign:'center', padding: '20px'}}>Loading...</td></tr>
              ) : trainers.length === 0 ? (
                 <tr><td colSpan="6" style={{textAlign:'center', padding: '20px'}}>No trainers found</td></tr>
              ) : (
                trainers.map((trainer) => (
                  <tr key={trainer.id}>
                    <td>
                      <div className="flex items-center">
                        <span style={{fontWeight: 500}}>{trainer.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Mail size={12}/>
                        {trainer.email}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Phone size={12}/>
                        {trainer.phone || 'N/A'}
                      </div>
                    </td>
                    <td style={{maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      {trainer.bio || 'N/A'}
                    </td>
                    <td>
                      {trainer.profile_image_url ? (
                        <img 
                          src={`${trainer.profile_image_url}?t=${Date.now()}`}
                          className={styles.avatar}
                        alt={trainer.name}
                        />
                      ) : (
                        <div className={styles.avatar}>
                          {trainer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button 
                          className={`${styles.btn} ${styles.edit}`} 
                          onClick={() => openEditModal(trainer)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          className={`${styles.btn} ${styles.danger}`} 
                          onClick={() => handleDelete(trainer.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TrainerForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={editingTrainer}
      />
    </div>
  );
};

export default TrainerList;