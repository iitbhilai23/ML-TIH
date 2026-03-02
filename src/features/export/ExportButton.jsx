import { FileText, Table } from 'lucide-react';

const ExportButtons = ({ onPDF, onExcel }) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      
      {/* PDF Button */}
      <button
        onClick={onPDF}
        style={{
          background: '#ffffff',
          color: '#ef4444',
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1px solid #fecaca',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <FileText size={16} /> PDF
      </button>

      {/* Excel Button */}
      <button
        onClick={onExcel}
        style={{
          background: '#ffffff',
          color: '#16a34a',
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1px solid #bbf7d0',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <Table size={16} /> Excel
      </button>

    </div>
  );
};

export default ExportButtons;