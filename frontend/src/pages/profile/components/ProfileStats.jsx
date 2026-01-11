import React, { forwardRef } from 'react';
import StatItem from './StatItem';

const ProfileStats = forwardRef((props, ref) => {
  const statsData = [
    { value: "12", label: "Мероприятий" },
    { value: "5", label: "Наград" },
    { value: "3", label: "Текущих проекта" },
    { value: "24", label: "Месяца с нами" }
  ];

  return (
    <div className="profile-stats" ref={ref}>
      {statsData.map((stat, index) => (
        <StatItem 
          key={index}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
});

export default ProfileStats;