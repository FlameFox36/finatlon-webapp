import React from 'react';

const ProfileHeader = ({ title, subtitle }) => {
  return (
    <div className="profile-header">
      <h1 className="profile-title">{title}</h1>
      <p className="profile-subtitle">{subtitle}</p>
    </div>
  );
};

export default ProfileHeader;