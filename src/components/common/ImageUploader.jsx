import React, { useState } from 'react';
import { fileUploadService } from '../../services/fileUploadService';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onUploadSuccess, existingImage }) => {
  const [preview, setPreview] = useState(existingImage || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      // Backend Upload Call
      const result = await fileUploadService.uploadImage(file);
      onUploadSuccess(result.file_url); 
    } catch (error) {
      alert("Upload failed!");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#f8fafc' }}>
      {preview ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
          <button 
            type="button"
            onClick={() => { setPreview(null); onUploadSuccess(''); }}
            style={{ position: 'absolute', top: -10, right: -10, background: 'red', color: 'white', borderRadius: '50%', border: 'none', padding: '4px', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '50%' }}>
                {uploading ? <div className="spinner">...</div> : <Upload size={24} color="#4f46e5" />}
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                {uploading ? "Uploading..." : "Click to Upload Photo"}
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
        </>
      )}
    </div>
  );
};

export default ImageUploader;