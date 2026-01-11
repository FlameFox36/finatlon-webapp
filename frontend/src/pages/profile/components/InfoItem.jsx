import React from 'react';

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="info-item">
      <div className="info-label">
        <i className={icon}></i>
        {label}
      </div>
      <div className="info-value">{value}</div>
    </div>
  );
};

export default InfoItem;