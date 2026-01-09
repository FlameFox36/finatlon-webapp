import React, { forwardRef } from 'react';
import InfoItem from './InfoItem';

const ProfileCard = forwardRef((props, ref) => {
  const userData = {
    fullName: "Иванов Иван Петрович",
    email: "ivanov@example.ru",
    phone: "+7 (912) 345-67-89",
    birthDate: "15 марта 1998 г.",
    city: "Москва",
    education: "Московский государственный университет"
  };

  const handleEditProfile = () => {
    alert('Редактирование профиля');
    // Здесь будет логика редактирования профиля
  };

  const handleExportData = () => {
    alert('Экспорт данных');
    // Здесь будет логика экспорта данных
  };

  return (
    <div className="profile-card" ref={ref}>
      <div className="profile-cover">
        <div className="profile-avatar">ИП</div>
      </div>
      
      <div className="profile-info">
        <div className="profile-info-grid">
          <InfoItem 
            icon="fas fa-user"
            label="ФИО"
            value={userData.fullName}
          />
          
          <InfoItem 
            icon="fas fa-envelope"
            label="Email"
            value={userData.email}
          />
          
          <InfoItem 
            icon="fas fa-phone"
            label="Телефон"
            value={userData.phone}
          />
          
          <InfoItem 
            icon="fas fa-birthday-cake"
            label="Дата рождения"
            value={userData.birthDate}
          />
          
          <InfoItem 
            icon="fas fa-map-marker-alt"
            label="Город"
            value={userData.city}
          />
          
          <InfoItem 
            icon="fas fa-graduation-cap"
            label="Учебное заведение"
            value={userData.education}
          />
        </div>
        
        <div className="profile-actions">
          <button className="btn" onClick={handleEditProfile}>
            <i className="fas fa-edit"></i> Редактировать профиль
          </button>
          <button className="btn btn-secondary" onClick={handleExportData}>
            <i className="fas fa-download"></i> Экспорт данных
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProfileCard;