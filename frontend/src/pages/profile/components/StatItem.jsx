import React from 'react';

const StatItem = ({ value, label }) => {
  return (
    <div className="stat-item">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatItem;