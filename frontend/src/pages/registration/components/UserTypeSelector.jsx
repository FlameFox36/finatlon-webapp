import React from 'react';

function UserTypeSelector({ userType, onSelectUserType }) {
  const userTypes = [
    {
      type: 'student',
      icon: 'fas fa-graduation-cap',
      title: 'Студент',
      description: 'Участие в олимпиадах, конкурсах, хакатонах. Отслеживание мероприятий и результатов.'
    },
    {
      type: 'parent',
      icon: 'fas fa-user-friends',
      title: 'Родитель',
      description: 'Контроль участия ребенка, уведомления о мероприятиях, просмотр результатов.'
    },
    {
      type: 'teacher',
      icon: 'fas fa-chalkboard-teacher',
      title: 'Учитель',
      description: 'Организация мероприятий для учеников, доступ к методическим материалам.'
    }
  ];

  return (
    <div className="user-type-selector">
      {userTypes.map((item) => (
        <div
          key={item.type}
          className={`user-type-card ${userType === item.type ? 'selected' : ''}`}
          onClick={() => onSelectUserType(item.type)}
          data-type={item.type}
        >
          <div className="user-type-icon">
            <i className={item.icon}></i>
          </div>
          <div className="user-type-title">{item.title}</div>
          <div className="user-type-description">
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserTypeSelector;