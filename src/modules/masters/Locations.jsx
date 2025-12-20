
import React, { useState, useEffect } from 'react';
import { locationService } from '../../services/locationService';
import styles from './Masters.module.css';
import { Plus, Pencil, Trash2, MapPin, X, Filter, AlertCircle } from 'lucide-react';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({ district: '', block: '' });

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, 
    state: 'Chhattisgarh', 
    district: '', 
    block: '', 
    village: '', 
    pincode: '', 
    address_line: '' 
  });

  useEffect(() => { 
    loadLocations(); 
  }, [filters]);

  const loadLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationService.getAll(filters);
      // setLocations(data);
      setLocations(Array.isArray(data) ? [...data] : []);
    } catch (err) {
      console.error("Load Locations Error:", err);
      setError('Failed to load locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cleanPayload = (data) => {
  const cleaned = {};
  Object.keys(data).forEach(key => {
    if (
      data[key] !== '' &&
      data[key] !== null &&
      data[key] !== undefined &&
      key !== 'id'
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
      await locationService.update(formData.id, payload);
      alert('Location updated successfully');
    } else {
      await locationService.create(payload);
      alert('Location created successfully');
    }

    setIsModalOpen(false);
    loadLocations();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Failed to save location');
  }
};


  const handleDelete = async (id) => {
    if(window.confirm('Delete this location? This might affect trainings linked to it.')) {
      try {
        await locationService.delete(id);
        loadLocations();
      } catch (err) {
        console.error("Delete Location Error:", err);
        alert('Failed to delete location. It might be linked to existing trainings.');
      }
    }
  };

  const openAdd = () => {
    setFormData({ 
      id: null, 
      state: 'Chhattisgarh', 
      district: '', 
      block: '', 
      village: '', 
      pincode: '', 
      address_line: '' 
    });
    setIsModalOpen(true);
  };

  const openEdit = (loc) => {
  setFormData({
    id: loc.id,
    state: loc.state || 'Chhattisgarh',
    district: loc.district || '',
    block: loc.block || '',
    village: loc.village || '',
    pincode: loc.pincode || '',
    address_line: loc.address_line || '',
    latitude: loc.latitude ?? '',
    longitude: loc.longitude ?? ''
  });
  setIsModalOpen(true);
};


  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>Locations / Centers</h2>
        <button className={`${styles.btn} ${styles.primary}`} onClick={openAdd}>
          <Plus size={18} /> Add Location
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
           <Filter size={16}/> Filters:
        </div>
        <input 
          className={styles.searchInput} 
          placeholder="Filter by District..." 
          value={filters.district}
          onChange={(e) => setFilters({...filters, district: e.target.value})} 
        />
        <input 
          className={styles.searchInput} 
          placeholder="Filter by Block..." 
          value={filters.block}
          onChange={(e) => setFilters({...filters, block: e.target.value})} 
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingState}>
          Loading locations...
        </div>
      )}

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>District</th>
                <th>Block</th>
                <th>Village</th>
                <th>Pincode</th>
                <th style={{textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 && !loading ? (
                 <tr>
                   <td colSpan="5" className="p-4 text-center text-gray-500">
                     {error ? 'Error loading data' : 'No locations found'}
                   </td>
                 </tr>
              ) : (
                locations.map(loc => (
                  <tr key={loc.id}>
                    <td className="font-medium">{loc.district}</td>
                    <td>{loc.block}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} color="var(--primary)"/> {loc.village}
                      </div>
                    </td>
                    <td>
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                        {loc.pincode || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div style={{display:'flex', gap:'8px', justifyContent:'center'}}>
                        <button 
                          className={`${styles.iconBtn} ${styles.edit}`} 
                          onClick={() => openEdit(loc)}
                          title="Edit Location"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          className={`${styles.iconBtn} ${styles.delete}`} 
                          onClick={() => handleDelete(loc.id)}
                          title="Delete Location"
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

      {/* --- LOCATION MODAL --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox} style={{width: '600px'}}>
             <div className="flex justify-between items-center mb-6 border-b pb-3">
               <h3 className="font-bold text-lg">
                 {formData.id ? 'Update Location' : 'Add New Location'}
               </h3>
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className={styles.closeBtn}
                 title="Close"
               >
                 <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.formGroup} style={{flex:1}}>
                  <label className={styles.label}>District *</label>
                  <input 
                    required 
                    className={styles.input} 
                    value={formData.district} 
                    placeholder="e.g. Raipur"
                    onChange={e => setFormData({...formData, district: e.target.value})} 
                  />
                </div>
                <div className={styles.formGroup} style={{flex:1}}>
                  <label className={styles.label}>Block *</label>
                  <input 
                    required 
                    className={styles.input} 
                    value={formData.block} 
                    placeholder="e.g. Dharsiwa"
                    onChange={e => setFormData({...formData, block: e.target.value})} 
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup} style={{flex:1}}>
                  <label className={styles.label}>Village *</label>
                  <input 
                    required 
                    className={styles.input} 
                    value={formData.village} 
                    placeholder="Village Name"
                    onChange={e => setFormData({...formData, village: e.target.value})} 
                  />
                </div>
                <div className={styles.formGroup} style={{width: '120px'}}>
                  <label className={styles.label}>Pincode</label>
                  <input 
                    className={styles.input} 
                    value={formData.pincode} 
                    maxLength={6}
                    onChange={e => setFormData({...formData, pincode: e.target.value})} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Address Line</label>
                <input 
                  className={styles.input} 
                  value={formData.address_line} 
                  placeholder="Near School, Main Road..."
                  onChange={e => setFormData({...formData, address_line: e.target.value})} 
                />
              </div>

              {/* Hidden fields that will be saved but not shown in form */}
              <input 
                type="hidden" 
                value={formData.state} 
                onChange={e => setFormData({...formData, state: e.target.value})} 
              />

              <div className={styles.row}>
                <div className={styles.formGroup} style={{flex:1}}>
                  <label className={styles.label}>Latitude</label>
                  <input 
                    type="number" 
                    step="any" 
                    className={styles.input} 
                    value={formData.latitude || ''} 
                    placeholder="21.2345"
                    onChange={e => setFormData({...formData, latitude: e.target.value ? parseFloat(e.target.value) : null})} 
                  />
                </div>
                <div className={styles.formGroup} style={{flex:1}}>
                  <label className={styles.label}>Longitude</label>
                  <input 
                    type="number" 
                    step="any" 
                    className={styles.input} 
                    value={formData.longitude || ''} 
                    placeholder="81.2345"
                    onChange={e => setFormData({...formData, longitude: e.target.value ? parseFloat(e.target.value) : null})} 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`${styles.btn} ${styles.primary}`} 
                style={{width:'100%', justifyContent:'center', marginTop:'10px'}}
              >
                {formData.id ? 'Update Location' : 'Save Location'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;