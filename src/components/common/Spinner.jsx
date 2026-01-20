import React from 'react';

const Spinner = ({ size = 40, overlay = false, label = 'Loading...' }) => {
  const spinnerStyle = {
    width: size,
    height: size
  };

  if (overlay) {
    return (
      <div className="app-spinner-overlay" role="status" aria-live="polite">
        <div className="app-spinner" style={spinnerStyle} />
        {label && <div className="app-spinner-label">{label}</div>}
      </div>
    );
  }

  return (
    <div className="app-spinner-center" role="status" aria-live="polite">
      <div className="app-spinner" style={spinnerStyle} />
      {label && <div className="app-spinner-label">{label}</div>}
    </div>
  );
};

export default Spinner;
