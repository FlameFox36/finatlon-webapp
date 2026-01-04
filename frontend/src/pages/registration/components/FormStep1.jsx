import React from 'react';
import UserTypeSelector from './UserTypeSelector';

function FormStep1({ userType, onSelectUserType, onNextStep }) {
  const handleNext = () => {
    if (!userType) {
      alert('Пожалуйста, выберите тип пользователя');
      return;
    }
    onNextStep();
  };

  return (
    <div className="form-step active" id="step1Form">
      <h2 className="section-title">Кто вы?</h2>
      <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
        Выберите ваш тип аккаунта для персонализации опыта
      </p>
      
      <UserTypeSelector userType={userType} onSelectUserType={onSelectUserType} />
      
      <input type="hidden" id="userType" name="userType" value={userType} />
      
      <div className="form-navigation">
        <div></div>
        <button type="button" className="btn" onClick={handleNext} id="nextStep1">
          Далее
        </button>
      </div>
    </div>
  );
}

export default FormStep1;