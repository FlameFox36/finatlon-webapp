import React, { useState, useEffect, useRef } from 'react';
import ProfileHeader from './ProfileHeader.jsx';
import ProfileCard from './ProfileCard.jsx';
import ProfileStats from './ProfileStats.jsx';

const UserProfileManager = () => {
  // Состояние пользовательских данных
  const [userData, setUserData] = useState({
    fullName: "Иванов Иван Петрович",
    email: "ivanov@example.ru",
    phone: "+7 (912) 345-67-89",
    birthDate: "15 марта 1998 г.",
    city: "Москва",
    education: "Московский государственный университет",
    avatarInitials: "ИП",
    isEditing: false
  });

  // Состояние статистики
  const [stats, setStats] = useState([
    { id: 1, value: "12", label: "Мероприятий", color: "#ff5d00" },
    { id: 2, value: "5", label: "Наград", color: "#ff5d00" },
    { id: 3, value: "3", label: "Текущих проекта", color: "#ff5d00" },
    { id: 4, value: "24", label: "Месяца с нами", color: "#ff5d00" }
  ]);

  // Состояние заголовка
  const [profileTitle, setProfileTitle] = useState({
    title: "Профиль пользователя",
    subtitle: "Основная информация и контактные данные"
  });

  // Ссылки для анимации
  const profileCardRef = useRef(null);
  const profileStatsRef = useRef(null);

  // Инициализация анимации
  useEffect(() => {
    initializeAnimation();
    
    // Загрузка данных (симуляция API запроса)
    setTimeout(() => {
      console.log("Данные профиля загружены");
    }, 1000);
  }, []);

  const initializeAnimation = () => {
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
  };

  // Обработчики действий
  const handleEditProfile = () => {
    setUserData(prev => ({ ...prev, isEditing: true }));
  };

  const handleSaveProfile = (updatedData) => {
    setUserData(prev => ({ ...prev, ...updatedData, isEditing: false }));
    console.log('Данные сохранены:', updatedData);
  };

  const handleCancelEdit = () => {
    setUserData(prev => ({ ...prev, isEditing: false }));
  };

  const handleExportData = () => {
    const exportData = {
      userData,
      stats,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `profile_data_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const updateStatValue = (statId, newValue) => {
    setStats(prevStats => 
      prevStats.map(stat => 
        stat.id === statId ? { ...stat, value: newValue } : stat
      )
    );
  };

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const resetProfile = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все изменения?')) {
      setUserData({
        fullName: "Иванов Иван Петрович",
        email: "ivanov@example.ru",
        phone: "+7 (912) 345-67-89",
        birthDate: "15 марта 1998 г.",
        city: "Москва",
        education: "Московский государственный университет",
        avatarInitials: "ИП",
        isEditing: false
      });
      
      setStats([
        { id: 1, value: "12", label: "Мероприятий", color: "#ff5d00" },
        { id: 2, value: "5", label: "Наград", color: "#ff5d00" },
        { id: 3, value: "3", label: "Текущих проекта", color: "#ff5d00" },
        { id: 4, value: "24", label: "Месяца с нами", color: "#ff5d00" }
      ]);
    }
  };

  return (
    <div className="profile-isolation-wrapper">
      <main>
        <div className="profile-container">
          {/* Заголовок профиля */}
          <ProfileHeader 
            title={profileTitle.title}
            subtitle={profileTitle.subtitle}
          />
          
          {/* Карточка профиля */}
          <ProfileCard 
            ref={profileCardRef}
            userData={userData}
            onEdit={handleEditProfile}
            onExport={handleExportData}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
            onUpdate={updateUserData}
            isEditing={userData.isEditing}
          />
          
          {/* Статистика */}
          <ProfileStats 
            ref={profileStatsRef}
            stats={stats}
            onUpdateStat={updateStatValue}
          />
        </div>
      </main>
    </div>
  );
};

export default UserProfileManager;