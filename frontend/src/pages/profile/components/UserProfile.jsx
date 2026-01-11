import React, { useEffect, useRef } from 'react';
import './ProfileStyles.css';
import ProfileHeader from './ProfileHeader';
import ProfileCard from './ProfileCard';
import ProfileStats from './ProfileStats';

const UserProfile = () => {
  const profileCardRef = useRef(null);
  const profileStatsRef = useRef(null);

  useEffect(() => {
    // Анимация при загрузке
    const profileCard = profileCardRef.current;
    const profileStats = profileStatsRef.current;
    
    if (profileCard) {
      profileCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }
    
    if (profileStats) {
      profileStats.style.transition = 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s';
    }
    
    setTimeout(() => {
      if (profileCard) {
        profileCard.classList.add('loaded');
      }
      
      setTimeout(() => {
        if (profileStats) {
          profileStats.classList.add('loaded');
        }
      }, 200);
    }, 300);
  }, []);

  return (
    <main>
      <div className="container profile-container">
        <ProfileHeader 
          title="Профиль пользователя"
          subtitle="Основная информация и контактные данные"
        />
        
        <ProfileCard ref={profileCardRef} />
        
        <ProfileStats ref={profileStatsRef} />
      </div>
    </main>
  );
};

export default UserProfile;