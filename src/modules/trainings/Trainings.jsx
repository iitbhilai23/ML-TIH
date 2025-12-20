import React, { useState, useEffect } from 'react';
import { trainingService } from '../../services/trainingService';
import TrainingForm from './TrainingForm';
import styles from './Trainings.module.css';
import { Plus, Pencil, Trash2, Calendar, MapPin, User, BookOpen, Filter } from 'lucide-react';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);

  useEffect(() => { 
    loadTrainings(); 
  }, [filterStatus]);

  const loadTrainings = async () => {
    setLoading(true);
    try {
      // Pass filters to backend
      const filters = filterStatus ? { status: filterStatus } : {};
      const data = await trainingService.getAll(filters);
      setTrainings(data);
    } catch (err) { 
      console.error('Failed to load trainings:', err);
    }
    setLoading(false);
  };

  const handleSave = async (data) => {
    try {
      if (editingTraining) {
        await trainingService.update(editingTraining.id, data);
      } else {
        await trainingService.create(data);
      }
      setIsModalOpen(false);
      loadTrainings();
    } catch (err) { 
      alert('Failed to save training: ' + (err.response?.data?.message || err.message)); 
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this training?')) {
      try {
        await trainingService.delete(id);
        loadTrainings();
      } catch (err) {
        alert('Failed to delete training: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const openAdd = () => { 
    setEditingTraining(null); 
    setIsModalOpen(true); 
  };
  
  const openEdit = (item) => { 
    setEditingTraining(item); 
    setIsModalOpen(true); 
  };

  // Helper to format date nicely
  const formatDate = (dateString) => {
    if(!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Helper to get training details safely
  const getTrainingDetails = (training) => {
    if (!training) return { 
      subject_name: 'N/A', 
      trainer_name: 'N/A', 
      location_details: {}, 
      start_date: null,
      end_date: null,
      actual_participants: 0,
      max_participants: 0,
      status: 'scheduled',
      id: null
    };    
  
    return {
      subject_name: training.subject_name || 'N/A',
      trainer_name: training.trainer_name || 'N/A',
      location_details: training.location_details || {},
      start_date: training.start_date,
      end_date: training.end_date,
      actual_participants: training.actual_participants || 0,
      max_participants: training.max_participants || 0,
      status: training.status || 'scheduled',
      id: training.id
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Training Schedule</h2>
        <button className={styles.btn} onClick={openAdd}>
          <Plus size={18}/> Schedule New
        </button>
      </div>

      <div className={styles.filterBar}>
        <div className="flex items-center gap-2 font-bold text-gray-500">
          <Filter size={16}/> Filter Status:
        </div>
        <select 
          className={styles.select} 
          onChange={(e) => setFilterStatus(e.target.value)} 
          value={filterStatus}
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Training Details (Subject/Trainer)</th>
                <th>Location</th>
                <th>Dates</th>
                <th>Participants</th>
                <th>Status</th>
                <th style={{textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">Loading trainings...</td>
                </tr>
              ) : trainings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">No trainings found</td>
                </tr>
              ) : (
                trainings.map(t => {
                  const details = getTrainingDetails(t);
                  return (
                    <tr key={details.id}>
                      <td>
                        <div className="font-bold text-indigo-700 flex items-center gap-2">
                          <BookOpen size={14}/> {details.subject_name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <User size={12}/> {details.trainer_name}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400"/>
                          {details.location_details?.village || 'N/A'}, {details.location_details?.block || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {details.location_details?.district || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400"/>
                          {formatDate(details.start_date)}
                        </div>
                        <div className="text-xs text-gray-400 ml-5">
                          to {formatDate(details.end_date)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <span className="font-bold">{details.actual_participants}</span> / {details.max_participants}
                        </div>
                        <div className="w-16 h-1 bg-gray-200 mt-1 rounded">
                          <div 
                            style={{width: `${details.max_participants > 0 ? (details.actual_participants/details.max_participants)*100 : 0}%`}} 
                            className="h-full bg-green-500 rounded"
                          ></div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[details.status]}`}>
                          {details.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <button 
                            className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" 
                            onClick={() => openEdit(t)}
                          >
                            <Pencil size={16}/>
                          </button>
                          <button 
                            className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100" 
                            onClick={() => handleDelete(details.id)}
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TrainingForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={editingTraining} 
      />
    </div>
  );
};

export default Trainings;