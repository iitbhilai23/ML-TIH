import React, { useState, useEffect } from 'react';
import { locationService } from '../../services/locationService';
import styles from './Masters.module.css';
import { Plus, Pencil, Trash2, MapPin, X, Filter, AlertCircle } from 'lucide-react';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ... (Keep your existing THEME constant exactly as is) ...
  const THEME = {
    primary: '#7c3aed',
    primaryLight: '#ddd6fe',
    secondary: '#ec4899',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    bgGradient: 'linear-gradient(-45deg, #f8fafc, #f1f5f9, #fdfbf7, #f0fdf4)',
    glass: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    softShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    mediumShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    hoverShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  };

  const [filters, setFilters] = useState({ district: '', block: '' });

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

  // ... (Keep your existing useEffect, loadLocations, cleanPayload, handleSubmit, handleDelete, openAdd, openEdit exactly as is) ...

  useEffect(() => {
    loadLocations();
  }, [filters]);

  const loadLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationService.getAll(filters);
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
    if (window.confirm('Delete this location? This might affect trainings linked to it.')) {
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
      {/* --- Header & Filter (Keep exactly as is) --- */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'white',
          padding: '20px 32px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <MapPin size={26} color={THEME.primary} /> Locations / Centers
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: 0,
              marginLeft: '42px'
            }}>
              Manage training centers and their details
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                Total Trainers
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                {locations.length}
              </div>
            </div>
            <button
              onClick={openAdd}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Plus size={18} /> Add Location
            </button>
          </div>
        </div>

        <div className={styles.filterBar} style={{
          background: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingRight: '16px',
            borderRight: '2px solid #e2e8f0',
            minWidth: '100px'
          }}>
            <Filter size={18} style={{ color: '#6366f1' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', letterSpacing: '0.5px' }}>FILTERS</span>
          </div>
          <input
            placeholder="Filter by District..."
            value={filters.district}
            onChange={(e) => setFilters({ ...filters, district: e.target.value })}
            style={{
              padding: '10px 14px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#334155',
              outline: 'none',
              transition: 'all 0.2s ease',
              minWidth: '200px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <input
            placeholder="Filter by Block..."
            value={filters.block}
            onChange={(e) => setFilters({ ...filters, block: e.target.value })}
            style={{
              padding: '10px 14px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#334155',
              outline: 'none',
              transition: 'all 0.2s ease',
              minWidth: '200px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* --- Error & Table (Keep exactly as is) --- */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#991b1b'
        }}>
          <AlertCircle size={18} />
          <span style={{ fontWeight: 500 }}>{error}</span>
        </div>
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    District
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    Block
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    Village
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📍 Pincode
                  </div>
                </th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  <div>Loading locations...</div>
                </td></tr>
              ) : locations.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px' }}>
                  <MapPin size={64} style={{ margin: '0 auto 16px', opacity: 0.2, color: '#94a3b8' }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                    No Locations Found
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    {filters.district || filters.block ? 'Try adjusting your filters' : 'Add your first location to get started'}
                  </div>
                </td></tr>
              ) : (
                locations.map(loc => (
                  <tr key={loc.id}>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{loc.district}</td>
                    <td style={{ color: '#475569' }}>{loc.block}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                        <MapPin size={14} style={{ color: '#6366f1' }} />
                        {loc.village}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        fontFamily: 'monospace'
                      }}>
                        {loc.pincode || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => openEdit(loc)}
                          style={{
                            padding: '8px 12px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '8px',
                            color: '#1e40af',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(loc.id)}
                          style={{
                            padding: '8px 12px',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            color: '#991b1b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                        >
                          <Trash2 size={14} /> Delete
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


      {/* --- UPDATED MODAL SECTION START --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            {/* Modern Modal Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {formData.id ? 'Update Location' : 'Add New Location'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.closeIconBtn}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Row 1: District / Block */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>District *</label>
                  <input
                    required
                    className={styles.input}
                    value={formData.district}
                    placeholder="e.g. Raipur"
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Block *</label>
                  <input
                    required
                    className={styles.input}
                    value={formData.block}
                    placeholder="e.g. Dharsiwa"
                    onChange={e => setFormData({ ...formData, block: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: Village / Pincode */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Village *</label>
                  <input
                    required
                    className={styles.input}
                    value={formData.village}
                    placeholder="Village Name"
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup} style={{ maxWidth: '140px' }}>
                  <label className={styles.label}>Pincode</label>
                  <input
                    className={styles.input}
                    value={formData.pincode}
                    maxLength={6}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Address Line</label>
                <input
                  className={styles.input}
                  value={formData.address_line}
                  placeholder="Near School, Main Road..."
                  onChange={e => setFormData({ ...formData, address_line: e.target.value })}
                />
              </div>

              {/* Row 3: Lat / Long */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className={styles.input}
                    value={formData.latitude || ''}
                    placeholder="21.2345"
                    onChange={e => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className={styles.input}
                    value={formData.longitude || ''}
                    placeholder="81.2345"
                    onChange={e => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
              </div>

              {/* Hidden State Field (Preserved logic) */}
              <input
                type="hidden"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              />

              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  {formData.id ? 'Update Location' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- UPDATED MODAL SECTION END --- */}
    </div>
  );
};

export default Locations;

// import React, { useState, useEffect } from 'react';
// import { locationService } from '../../services/locationService';
// import styles from './Masters.module.css';
// import { Plus, Pencil, Trash2, MapPin, X, Filter, AlertCircle } from 'lucide-react';

// const Locations = () => {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const THEME = {
//     primary: '#7c3aed',
//     primaryLight: '#ddd6fe',
//     secondary: '#ec4899',
//     success: '#10b981',
//     danger: '#ef4444',
//     warning: '#f59e0b',

//     bgGradient: 'linear-gradient(-45deg, #f8fafc, #f1f5f9, #fdfbf7, #f0fdf4)',

//     glass: {
//       background: 'rgba(255, 255, 255, 0.85)',
//       backdropFilter: 'blur(16px)',
//       WebkitBackdropFilter: 'blur(16px)',
//       border: '1px solid rgba(255, 255, 255, 0.9)',
//       borderRadius: '20px',
//       boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
//     },

//     softShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
//     mediumShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
//     hoverShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
//   };

//   // Filters
//   const [filters, setFilters] = useState({ district: '', block: '' });

//   // Form State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     id: null,
//     state: 'Chhattisgarh',
//     district: '',
//     block: '',
//     village: '',
//     pincode: '',
//     address_line: ''
//   });

//   useEffect(() => {
//     loadLocations();
//   }, [filters]);

//   const loadLocations = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await locationService.getAll(filters);
//       // setLocations(data);
//       setLocations(Array.isArray(data) ? [...data] : []);
//     } catch (err) {
//       console.error("Load Locations Error:", err);
//       setError('Failed to load locations. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cleanPayload = (data) => {
//     const cleaned = {};
//     Object.keys(data).forEach(key => {
//       if (
//         data[key] !== '' &&
//         data[key] !== null &&
//         data[key] !== undefined &&
//         key !== 'id'
//       ) {
//         cleaned[key] = data[key];
//       }
//     });
//     return cleaned;
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = cleanPayload(formData);

//       if (formData.id) {
//         await locationService.update(formData.id, payload);
//         alert('Location updated successfully');
//       } else {
//         await locationService.create(payload);
//         alert('Location created successfully');
//       }

//       setIsModalOpen(false);
//       loadLocations();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Failed to save location');
//     }
//   };


//   const handleDelete = async (id) => {
//     if (window.confirm('Delete this location? This might affect trainings linked to it.')) {
//       try {
//         await locationService.delete(id);
//         loadLocations();
//       } catch (err) {
//         console.error("Delete Location Error:", err);
//         alert('Failed to delete location. It might be linked to existing trainings.');
//       }
//     }
//   };

//   const openAdd = () => {
//     setFormData({
//       id: null,
//       state: 'Chhattisgarh',
//       district: '',
//       block: '',
//       village: '',
//       pincode: '',
//       address_line: ''
//     });
//     setIsModalOpen(true);
//   };

//   const openEdit = (loc) => {
//     setFormData({
//       id: loc.id,
//       state: loc.state || 'Chhattisgarh',
//       district: loc.district || '',
//       block: loc.block || '',
//       village: loc.village || '',
//       pincode: loc.pincode || '',
//       address_line: loc.address_line || '',
//       latitude: loc.latitude ?? '',
//       longitude: loc.longitude ?? ''
//     });
//     setIsModalOpen(true);
//   };


//   return (
//     <div className={styles.container}>
//       {/* Modern Header Section */}
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '20px',
//         marginBottom: '24px'
//       }}>
//         {/* Header Card */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           background: 'white',
//           padding: '20px 32px',
//           borderRadius: '16px',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
//           //  marginBottom: '20px'
//         }}>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', }}>
//             <h2 style={{
//               fontSize: '1.5rem',
//               fontWeight: 700,
//               color: '#1e293b',
//               margin: 0,
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px'
//             }}>
//               <MapPin size={26} color={THEME.primary} /> Locations / Centers
//             </h2>
//             <p style={{
//               fontSize: '0.95rem',
//               color: '#64748b',
//               margin: 0,
//               marginLeft: '42px'
//             }}>
//               Manage training centers and their details
//             </p>
//           </div>

//           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
//             {/* Vibrant Total Trainer Card (Fixing "Light" look) */}
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px',
//               background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
//               padding: '12px 20px',
//               borderRadius: '12px',
//               boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)' // Stronger shadow
//             }}>
//               <div style={{
//                 fontSize: '0.9rem',
//                 color: 'rgba(255,255,255,0.9)',
//                 fontWeight: 600,
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.5px',
//                 marginBottom: '2px'
//               }}>
//                 Total Trainers
//               </div>
//               <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
//                 {locations.length}
//               </div>
//             </div>

//             <button
//               onClick={openAdd}
//               style={{
//                 background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
//                 color: 'white',
//                 padding: '12px 20px',
//                 borderRadius: '10px',
//                 border: 'none',
//                 fontWeight: 600,
//                 fontSize: '0.9rem',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
//                 transition: 'all 0.2s ease'
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//             >
//               <Plus size={18} /> Add Location
//             </button>
//           </div>
//         </div>

//         {/* Filter Bar */}
//         <div className={styles.filterBar} style={{
//           background: 'white',
//           padding: '16px 20px',
//           borderRadius: '12px',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             paddingRight: '16px',
//             borderRight: '2px solid #e2e8f0',
//             minWidth: '100px'
//           }}>
//             <Filter size={18} style={{ color: '#6366f1' }} />
//             <span style={{
//               fontWeight: 700,
//               fontSize: '0.95rem',
//               color: '#1e293b',
//               letterSpacing: '0.5px'
//             }}>FILTERS</span>
//           </div>
//           <input
//             placeholder="Filter by District..."
//             value={filters.district}
//             onChange={(e) => setFilters({ ...filters, district: e.target.value })}
//             style={{
//               padding: '10px 14px',
//               border: '2px solid #e2e8f0',
//               borderRadius: '8px',
//               fontSize: '0.9rem',
//               fontWeight: 500,
//               color: '#334155',
//               outline: 'none',
//               transition: 'all 0.2s ease',
//               minWidth: '200px'
//             }}
//             onFocus={(e) => {
//               e.currentTarget.style.borderColor = '#6366f1';
//               e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
//             }}
//             onBlur={(e) => {
//               e.currentTarget.style.borderColor = '#e2e8f0';
//               e.currentTarget.style.boxShadow = 'none';
//             }}
//           />
//           <input
//             placeholder="Filter by Block..."
//             value={filters.block}
//             onChange={(e) => setFilters({ ...filters, block: e.target.value })}
//             style={{
//               padding: '10px 14px',
//               border: '2px solid #e2e8f0',
//               borderRadius: '8px',
//               fontSize: '0.9rem',
//               fontWeight: 500,
//               color: '#334155',
//               outline: 'none',
//               transition: 'all 0.2s ease',
//               minWidth: '200px'
//             }}
//             onFocus={(e) => {
//               e.currentTarget.style.borderColor = '#6366f1';
//               e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
//             }}
//             onBlur={(e) => {
//               e.currentTarget.style.borderColor = '#e2e8f0';
//               e.currentTarget.style.boxShadow = 'none';
//             }}
//           />
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div style={{
//           background: '#fef2f2',
//           border: '1px solid #fecaca',
//           borderRadius: '10px',
//           padding: '14px 16px',
//           marginBottom: '20px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '10px',
//           color: '#991b1b'
//         }}>
//           <AlertCircle size={18} />
//           <span style={{ fontWeight: 500 }}>{error}</span>
//         </div>
//       )}

//       {/* Table */}
//       <div className={styles.tableCard}>
//         <div className={styles.tableWrapper}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                     <MapPin size={14} />
//                     District
//                   </div>
//                 </th>
//                 <th>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                     <MapPin size={14} />
//                     Block
//                   </div>
//                 </th>
//                 <th>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                     <MapPin size={14} />
//                     Village
//                   </div>
//                 </th>
//                 <th>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                     📍 Pincode
//                   </div>
//                 </th>
//                 <th style={{ textAlign: 'center' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
//                   <div>Loading locations...</div>
//                 </td></tr>
//               ) : locations.length === 0 ? (
//                 <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px' }}>
//                   <MapPin size={64} style={{ margin: '0 auto 16px', opacity: 0.2, color: '#94a3b8' }} />
//                   <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
//                     No Locations Found
//                   </div>
//                   <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
//                     {filters.district || filters.block ? 'Try adjusting your filters' : 'Add your first location to get started'}
//                   </div>
//                 </td></tr>
//               ) : (
//                 locations.map(loc => (
//                   <tr key={loc.id}>
//                     <td style={{ fontWeight: 600, color: '#1e293b' }}>{loc.district}</td>
//                     <td style={{ color: '#475569' }}>{loc.block}</td>
//                     <td>
//                       <div style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '6px',
//                         color: '#334155'
//                       }}>
//                         <MapPin size={14} style={{ color: '#6366f1' }} />
//                         {loc.village}
//                       </div>
//                     </td>
//                     <td>
//                       <span style={{
//                         background: '#f1f5f9',
//                         color: '#475569',
//                         padding: '4px 10px',
//                         borderRadius: '6px',
//                         fontSize: '0.85rem',
//                         fontWeight: 600,
//                         fontFamily: 'monospace'
//                       }}>
//                         {loc.pincode || 'N/A'}
//                       </span>
//                     </td>
//                     <td>
//                       <div style={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         gap: '8px'
//                       }}>
//                         <button
//                           onClick={() => openEdit(loc)}
//                           style={{
//                             padding: '8px 12px',
//                             background: '#eff6ff',
//                             border: '1px solid #bfdbfe',
//                             borderRadius: '8px',
//                             color: '#1e40af',
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '4px',
//                             fontSize: '0.85rem',
//                             fontWeight: 600,
//                             transition: 'all 0.2s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background = '#dbeafe';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background = '#eff6ff';
//                           }}
//                         >
//                           <Pencil size={14} /> Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(loc.id)}
//                           style={{
//                             padding: '8px 12px',
//                             background: '#fef2f2',
//                             border: '1px solid #fecaca',
//                             borderRadius: '8px',
//                             color: '#991b1b',
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '4px',
//                             fontSize: '0.85rem',
//                             fontWeight: 600,
//                             transition: 'all 0.2s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background = '#fee2e2';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background = '#fef2f2';
//                           }}
//                         >
//                           <Trash2 size={14} /> Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>


//       {/* --- LOCATION MODAL --- */}
//       {isModalOpen && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalBox} style={{ width: '600px' }}>
//             <div className="flex justify-between items-center mb-6 border-b pb-3">
//               <h3 className="font-bold text-lg">
//                 {formData.id ? 'Update Location' : 'Add New Location'}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className={styles.closeBtn}
//                 title="Close"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className={styles.row}>
//                 <div className={styles.formGroup} style={{ flex: 1 }}>
//                   <label className={styles.label}>District *</label>
//                   <input
//                     required
//                     className={styles.input}
//                     value={formData.district}
//                     placeholder="e.g. Raipur"
//                     onChange={e => setFormData({ ...formData, district: e.target.value })}
//                   />
//                 </div>
//                 <div className={styles.formGroup} style={{ flex: 1 }}>
//                   <label className={styles.label}>Block *</label>
//                   <input
//                     required
//                     className={styles.input}
//                     value={formData.block}
//                     placeholder="e.g. Dharsiwa"
//                     onChange={e => setFormData({ ...formData, block: e.target.value })}
//                   />
//                 </div>
//               </div>

//               <div className={styles.row}>
//                 <div className={styles.formGroup} style={{ flex: 1 }}>
//                   <label className={styles.label}>Village *</label>
//                   <input
//                     required
//                     className={styles.input}
//                     value={formData.village}
//                     placeholder="Village Name"
//                     onChange={e => setFormData({ ...formData, village: e.target.value })}
//                   />
//                 </div>
//                 <div className={styles.formGroup} style={{ width: '120px' }}>
//                   <label className={styles.label}>Pincode</label>
//                   <input
//                     className={styles.input}
//                     value={formData.pincode}
//                     maxLength={6}
//                     onChange={e => setFormData({ ...formData, pincode: e.target.value })}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Full Address Line</label>
//                 <input
//                   className={styles.input}
//                   value={formData.address_line}
//                   placeholder="Near School, Main Road..."
//                   onChange={e => setFormData({ ...formData, address_line: e.target.value })}
//                 />
//               </div>

//               {/* Hidden fields that will be saved but not shown in form */}
//               <input
//                 type="hidden"
//                 value={formData.state}
//                 onChange={e => setFormData({ ...formData, state: e.target.value })}
//               />

//               <div className={styles.row}>
//                 <div className={styles.formGroup} style={{ flex: 1 }}>
//                   <label className={styles.label}>Latitude</label>
//                   <input
//                     type="number"
//                     step="any"
//                     className={styles.input}
//                     value={formData.latitude || ''}
//                     placeholder="21.2345"
//                     onChange={e => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : null })}
//                   />
//                 </div>
//                 <div className={styles.formGroup} style={{ flex: 1 }}>
//                   <label className={styles.label}>Longitude</label>
//                   <input
//                     type="number"
//                     step="any"
//                     className={styles.input}
//                     value={formData.longitude || ''}
//                     placeholder="81.2345"
//                     onChange={e => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : null })}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className={`${styles.btn} ${styles.primary}`}
//                 style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
//               >
//                 {formData.id ? 'Update Location' : 'Save Location'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Locations;