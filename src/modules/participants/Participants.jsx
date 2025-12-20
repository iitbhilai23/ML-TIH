import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participantService';
import { trainingService } from '../../services/trainingService';
import ParticipantForm from './ParticipantForm';
import styles from './Participants.module.css';
import { Plus, Pencil, Trash2, User, Phone, Filter } from 'lucide-react';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [trainings, setTrainings] = useState([]); // Filter dropdown ke liye
  const [loading, setLoading] = useState(false);
  
  // Filter State
  const [selectedTrainingId, setSelectedTrainingId] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // 1. Load Filter Options (Trainings)
  useEffect(() => {
    loadTrainings();
  }, []);

  // 2. Load Participants when filter changes
  useEffect(() => {
    loadParticipants();
  }, [selectedTrainingId]);

  const loadTrainings = async () => {
    try {
       const data = await trainingService.getAll();
       setTrainings(data);
    } catch(e) {}
  };

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const filters = selectedTrainingId ? { training_id: selectedTrainingId } : {};
      const data = await participantService.getAll(filters);
      setParticipants(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };



const handleSave = async (data) => {
  if (editingData) {
    const { training_id, ...updateData } = data; // 🔥 REMOVE
    await participantService.update(editingData.id, updateData);
  } else {
    await participantService.create(data);
  }

  setIsModalOpen(false);
  setEditingData(null);
  await loadParticipants();
};


const handleDelete = async (id) => {
  if (window.confirm('Are You Sure Delete?')) {
    await participantService.delete(id);
    await loadParticipants(); //  MUST
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Participants / Beneficiaries</h2>
        <button className={styles.btn} onClick={() => { setEditingData(null); setIsModalOpen(true); }}>
          <Plus size={18}/> New Registration
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className="flex items-center gap-2 text-indigo-700">
           <Filter size={20}/>
           <span className={styles.filterLabel}>Filter List:</span>
        </div>
        <select 
          className={styles.select} 
          value={selectedTrainingId} 
          onChange={(e) => setSelectedTrainingId(e.target.value)}
        >
          <option value="">-- Show All Participants --</option>
          {trainings.map(t => (
            <option key={t.id} value={t.id}>
              {t.subject_name} ({t.location_details?.district})
            </option>
          ))}
        </select>
        {selectedTrainingId && (
            <span className="text-sm text-gray-500 ml-2">
                Showing {participants.length} students
            </span>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Participant Name</th>
                <th>Training Program</th>
                <th>Category</th>
                <th>Attendance</th>
                <th style={{textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> : 
               participants.length === 0 ? <tr><td colSpan="5" className="p-4 text-center">No participants found</td></tr> : (
                participants.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                           {p.name.charAt(0)}
                         </div>
                         <div>
                           <div className="font-bold">{p.name}</div>
                           <div className="text-xs text-gray-500 flex items-center gap-1">
                             <Phone size={10}/> {p.phone || 'N/A'}
                           </div>
                         </div>
                      </div>
                    </td>


      


<td>
  <b>{p.training_details?.subject_name}</b>
  <div className="text-xs">
    Trainer: {p.training_details?.trainer_name}
  </div>
  <div className="text-xs">
    Village: {p.training_details?.location_details?.village}
  </div>
</td>



                    <td>
                       <span className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {p.category} / {p.caste}
                       </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[p.attendance_status]}`}>
                        {p.attendance_status}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                         <button className="p-1 text-blue-600" onClick={() => { setEditingData(p); setIsModalOpen(true); }}>
                           <Pencil size={16}/>
                         </button>
                         <button className="p-1 text-red-600" onClick={() => handleDelete(p.id)}>
                           <Trash2 size={16}/>
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

      <ParticipantForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={editingData} 
      />
    </div>
  );
};

export default Participants;