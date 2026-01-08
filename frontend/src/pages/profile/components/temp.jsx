import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faBirthdayCake, 
  faMapMarkerAlt, faGraduationCap, faEdit, faDownload,
  faHome, faCalendarAlt, faTrophy, faCog
} from '@fortawesome/free-solid-svg-icons';
import { 
  faVk, faTelegram, faYoutube
} from '@fortawesome/free-brands-svg-icons';

const UserProfile = () => {
  const navLinksRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);

  useEffect(() => {
    // Анимация при загрузке
    const profileCard = document.querySelector('.profile-card');
    const profileStats = document.querySelector('.profile-stats');
    
    if (profileCard) {
      profileCard.style.opacity = '0';
      profileCard.style.transform = 'translateY(20px)';
      profileCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        profileCard.style.opacity = '1';
        profileCard.style.transform = 'translateY(0)';
      }, 300);
    }
    
    if (profileStats) {
      profileStats.style.opacity = '0';
      profileStats.style.transform = 'translateY(20px)';
      profileStats.style.transition = 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s';
      
      setTimeout(() => {
        profileStats.style.opacity = '1';
        profileStats.style.transform = 'translateY(0)';
      }, 500);
    }
  }, []);

  const toggleMobileMenu = () => {
    const navLinks = navLinksRef.current;
    if (navLinks) {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      
      if (window.innerWidth <= 768) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.right = '20px';
        navLinks.style.background = '#121315';
        navLinks.style.padding = '20px';
        navLinks.style.borderRadius = '8px';
        navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        navLinks.style.zIndex = '1000';
        navLinks.style.gap = '15px';
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navLinks = navLinksRef.current;
      const mobileBtn = mobileMenuBtnRef.current;
      
      if (window.innerWidth <= 768 && 
          navLinks && 
          navLinks.style.display === 'flex' && 
          !navLinks.contains(event.target) && 
          mobileBtn && 
          !mobileBtn.contains(event.target)) {
        navLinks.style.display = 'none';
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-profile-container">
      <style jsx>{`
        /* Стили для профиля */
        .user-profile-container {
          font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background-color: #f8f9fa;
          color: #333;
          line-height: 1.6;
          min-height: 100vh;
        }
        
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .btn {
          display: inline-block;
          background-color: #ff5d00;
          color: white;
          padding: 12px 28px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        
        .btn:hover {
          background-color: #e05200;
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background-color: #6c757d;
        }
        
        .btn-secondary:hover {
          background-color: #5a6268;
        }
        
        /* Основной контент профиля */
        .profile-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 800px;
          margin: 0 auto 60px;
          padding-top: 40px;
        }
        
        .profile-header {
          text-align: center;
          margin-bottom: 40px;
          width: 100%;
        }
        
        .profile-title {
          font-size: 36px;
          color: #121315;
          margin-bottom: 10px;
        }
        
        .profile-subtitle {
          color: #666;
          font-size: 18px;
        }
        
        .profile-card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          width: 100%;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .profile-card:hover {
          transform: translateY(-5px);
        }
        
        .profile-cover {
          height: 150px;
          background: linear-gradient(135deg, #121315 0%, #2d2f33 100%);
          position: relative;
        }
        
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 5px solid white;
          background-color: #ff5d00;
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 48px;
          font-weight: bold;
        }
        
        .profile-info {
          padding: 80px 40px 40px;
        }
        
        .profile-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
        }
        
        @media (max-width: 768px) {
          .profile-info-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          padding: 15px;
          border-radius: 8px;
          background-color: #f8f9fa;
          transition: background-color 0.3s ease;
        }
        
        .info-item:hover {
          background-color: #e9ecef;
        }
        
        .info-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-label i {
          color: #ff5d00;
          width: 20px;
        }
        
        .info-value {
          font-size: 18px;
          color: #121315;
          font-weight: 500;
        }
        
        .profile-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #eee;
        }
        
        /* Дополнительная информация */
        .profile-stats {
          display: flex;
          justify-content: space-around;
          background-color: #121315;
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin-top: 40px;
          width: 100%;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #ff5d00;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #ccc;
        }
        
        /* Адаптивность */
        @media (max-width: 768px) {
          .profile-title {
            font-size: 28px;
          }
          
          .profile-info {
            padding: 80px 20px 30px;
          }
          
          .profile-stats {
            flex-direction: column;
            gap: 25px;
          }
        }
        
        @media (max-width: 576px) {
          .profile-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .profile-actions .btn {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>

      {/* Основной контент профиля */}
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Профиль пользователя</h1>
          <p className="profile-subtitle">Основная информация и контактные данные</p>
        </div>

        <div className="profile-card">
          <div className="profile-cover">
            <div className="profile-avatar">ИП</div>
          </div>
          
          <div className="profile-info">
            <div className="profile-info-grid">
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faUser} />
                  ФИО
                </div>
                <div className="info-value">Иванов Иван Петрович</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email
                </div>
                <div className="info-value">ivanov@example.ru</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faPhone} />
                  Телефон
                </div>
                <div className="info-value">+7 (912) 345-67-89</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faBirthdayCake} />
                  Дата рождения
                </div>
                <div className="info-value">15 марта 1998 г.</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Город
                </div>
                <div className="info-value">Москва</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  Учебное заведение
                </div>
                <div className="info-value">Московский государственный университет</div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="btn">
                <FontAwesomeIcon icon={faEdit} style={{marginRight: '8px'}} />
                Редактировать профиль
              </button>
              <button className="btn btn-secondary">
                <FontAwesomeIcon icon={faDownload} style={{marginRight: '8px'}} />
                Экспорт данных
              </button>
            </div>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-value">12</div>
            <div className="stat-label">Мероприятий</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">5</div>
            <div className="stat-label">Наград</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">3</div>
            <div className="stat-label">Текущих проекта</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">24</div>
            <div className="stat-label">Месяца с нами</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;