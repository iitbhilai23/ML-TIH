
import React, { useState, useEffect } from 'react';
import { locationService } from '../../services/locationService';
import styles from './Masters.module.css';
import { Plus, Pencil, Trash2, MapPin, X, Filter, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  useEffect(() => {
    loadLocations();
    setCurrentPage(1); // Reset to page 1 on filter change
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocations = locations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(locations.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optional: scroll to top of table on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* --- Header & Filter (Keep exactly as is) --- */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          background: '#FFFFFF',
          padding: '24px 32px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}>

          {/* Left Section: Title & Stat */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: '1 1 250px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              letterSpacing: '-0.025em',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              Location Management
            </h2>

            {/* Modern Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#f1f5f9',
                padding: '6px 16px',
                borderRadius: '9999px', // Fully rounded (Pill)
                border: '1px solid transparent',
                alignSelf: 'flex-start',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Icon */}
              <MapPin size={18} color="#6366f1" strokeWidth={2} />

              {/* Label */}
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Total Locations
              </span>

              {/* Count */}
              <span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  lineHeight: 1
                }}
              >
                {locations.length}
              </span>
            </div>
          </div>

          {/* Middle Section: Filters Group */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flex: '1 1 300px',
            minWidth: '300px', // Ensure inputs don't squish too much
          }}>

            {/* District Input */}
            <input
              placeholder="Filter by District..."
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#334155',
                backgroundColor: '#f8fafc',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {/* Block Input */}
            <input
              placeholder="Filter by Block..."
              value={filters.block}
              onChange={(e) => setFilters({ ...filters, block: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#334155',
                backgroundColor: '#f8fafc',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

          </div>

          {/* Right Section: Action Button */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: '0 0 auto' }}>
            <button
              onClick={openAdd}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
              }}
            >
              <Plus size={18} /> Add Location
            </button>
          </div>
        </div>
      </div>

      {/* --- Error & Table (Keep exactly as is, but map currentLocations) --- */}
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
                  <Spinner overlay={false} />
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
                currentLocations.map(loc => (
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
                        background: '#ffffff',
                        color: '#0f172a',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        letterSpacing: '0.08em',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '86px'
                      }}>
                        {loc.pincode || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                          onClick={() => openEdit(loc)}
                          style={{
                            padding: '8px 14px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#6366f1';
                            e.currentTarget.style.color = '#4338ca';
                            e.currentTarget.style.boxShadow = '0 6px 14px rgba(99, 102, 241, 0.18)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.color = '#1e293b';
                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                          }}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(loc.id)}
                          style={{
                            padding: '8px 14px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            color: '#991b1b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#fecaca';
                            e.currentTarget.style.boxShadow = '0 6px 14px rgba(239, 68, 68, 0.18)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                          }}
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

        {/* Pagination Controls */}
        {!loading && locations.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            marginTop: '0px'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, locations.length)} of {locations.length} entries
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#cbd5e1' : '#475569',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div style={{
                display: 'flex',
                gap: '4px',
                margin: '0 8px'
              }}>
                {/* Simple page indicator */}
                <span style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)'
                }}>
                  {currentPage}
                </span>
                <span style={{
                  padding: '8px 4px',
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  of {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === totalPages || totalPages === 0 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages || totalPages === 0 ? '#cbd5e1' : '#475569',
                  cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages && totalPages !== 0) e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages && totalPages !== 0) e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
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
