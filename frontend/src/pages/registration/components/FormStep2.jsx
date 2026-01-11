import React, { useState } from 'react';

function FormStep2({
  formData,
  onFormDataChange,
  userType,
  onPrevStep,
  onNextStep,
  errors,
  validateStep
}) {
  const [localErrors, setLocalErrors] = useState({});

  const handleNext = () => {
    if (validateStep()) {
      onNextStep();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
    
    // Очищаем ошибку при вводе
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="form-step" id="step2Form">
      <h2 className="section-title">Основные данные</h2>
      <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
        Заполните информацию о себе
      </p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName" className="required">ФИО</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className={`form-control ${errors.fullName ? 'error' : ''}`}
            placeholder="Иванов Иван Иванович"
            value={formData.fullName || ''}
            onChange={handleInputChange}
          />
          <div className={`error-message ${errors.fullName ? 'show' : ''}`} id="fullNameError">
            {errors.fullName || 'Пожалуйста, введите ваше ФИО'}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="required">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'error' : ''}`}
            placeholder="example@mail.ru"
            value={formData.email || ''}
            onChange={handleInputChange}
          />
          <div className={`error-message ${errors.email ? 'show' : ''}`} id="emailError">
            {errors.email || 'Пожалуйста, введите корректный email'}
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone" className="required">Телефон</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={`form-control ${errors.phone ? 'error' : ''}`}
            placeholder="+7 (999) 123-45-67"
            value={formData.phone || ''}
            onChange={handleInputChange}
          />
          <div className={`error-message ${errors.phone ? 'show' : ''}`} id="phoneError">
            {errors.phone || 'Пожалуйста, введите номер телефона'}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="birthDate" className="required">Дата рождения</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            className={`form-control ${errors.birthDate ? 'error' : ''}`}
            value={formData.birthDate || getTodayDate()}
            onChange={handleInputChange}
            min={getMinDate()}
            max={getMaxDate()}
          />
          <div className={`error-message ${errors.birthDate ? 'show' : ''}`} id="birthDateError">
            {errors.birthDate || 'Пожалуйста, введите дату рождения'}
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city" className="required">Город</label>
          <input
            type="text"
            id="city"
            name="city"
            className={`form-control ${errors.city ? 'error' : ''}`}
            placeholder="Москва"
            value={formData.city || ''}
            onChange={handleInputChange}
          />
          <div className={`error-message ${errors.city ? 'show' : ''}`} id="cityError">
            {errors.city || 'Пожалуйста, введите город'}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="institution" className="required">Учебное заведение</label>
          <input
            type="text"
            id="institution"
            name="institution"
            className={`form-control ${errors.institution ? 'error' : ''}`}
            placeholder="Школа №123 / МГУ им. Ломоносова"
            value={formData.institution || ''}
            onChange={handleInputChange}
          />
          <div className={`error-message ${errors.institution ? 'show' : ''}`} id="institutionError">
            {errors.institution || 'Пожалуйста, введите учебное заведение'}
          </div>
          <div className="field-note">Укажите школу, колледж или вуз</div>
        </div>
      </div>
      
      {/* Дополнительные поля для родителей */}
      {userType === 'parent' && (
        <div className="child-phone-fields show" id="parentFields">
          <h3 style={{ marginBottom: '20px', color: '#121315' }}>Данные ребенка</h3>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Для привязки аккаунта к ребенку укажите его номер телефона
          </p>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="childPhone" className="required">Телефон ребенка</label>
              <input
                type="tel"
                id="childPhone"
                name="childPhone"
                className={`form-control ${errors.childPhone ? 'error' : ''}`}
                placeholder="+7 (999) 987-65-43"
                value={formData.childPhone || ''}
                onChange={handleInputChange}
              />
              <div className={`error-message ${errors.childPhone ? 'show' : ''}`} id="childPhoneError">
                {errors.childPhone || 'Пожалуйста, введите номер телефона ребенка'}
              </div>
              <div className="field-note">Номер должен быть зарегистрирован в системе Финатлон</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="childName">Имя ребенка</label>
              <input
                type="text"
                id="childName"
                name="childName"
                className="form-control"
                placeholder="Иванов Петр Иванович"
                value={formData.childName || ''}
                onChange={handleInputChange}
              />
              <div className="field-note">Укажите, если известно</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="form-navigation">
        <button type="button" className="btn btn-secondary" onClick={onPrevStep} id="prevStep2">
          Назад
        </button>
        <button type="button" className="btn" onClick={handleNext} id="nextStep2">
          Продолжить
        </button>
      </div>
    </div>
  );
}

export default FormStep2;