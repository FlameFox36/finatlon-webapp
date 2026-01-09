import React, { useState } from 'react';

function FormStep3({
  formData,
  userType,
  onPrevStep,
  onFormDataChange,
  onSubmit,
  errors,
  setErrors,
  isLoading
}) {
  const userTypeLabels = {
    'student': 'Студент',
    'parent': 'Родитель',
    'teacher': 'Учитель'
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
    
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTermsChange = (e) => {
    onFormDataChange({ agreeTerms: e.target.checked });
    if (errors.agreeTerms) {
      setErrors(prev => ({ ...prev, agreeTerms: '' }));
    }
  };

  // Валидация перед отправкой
  const validateForm = () => {
    const newErrors = {};
    
    // Проверяем пароль
    if (!formData.password) {
      newErrors.password = 'Пожалуйста, введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    // Проверяем подтверждение пароля
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Пожалуйста, подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    // Проверяем согласие с условиями
    if (!formData.agreeTerms) {
      newErrors.terms = 'Необходимо согласиться с условиями';
    }
    
    // Устанавливаем ошибки
    setErrors(prev => ({ ...prev, ...newErrors }));
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Проверяем форму
    if (!validateForm()) {
      return;
    }
    
    // Если все ок - отправляем
    onSubmit();
  };

  return (
    <div className="form-step" id="step3Form">
      <h2 className="section-title">Создание пароля и подтверждение данных</h2>
      <p style={{ textAlign: 'center', marginBottom: '40px', color: '#666' }}>
        Создайте пароль и проверьте введенные данные перед отправкой
      </p>
      
      {/* Поля для пароля */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>Создание пароля</h3>
        
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Пароль *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password || ''}
            onChange={handlePasswordChange}
            placeholder="Введите пароль (минимум 6 символов)"
            className={errors.password ? 'error' : ''}
            style={{ 
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors.password ? '#ff4444' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {errors.password && (
            <div className="error-message show" style={{ color: '#ff4444', fontSize: '14px', marginTop: '5px' }}>
              {errors.password}
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
            Подтверждение пароля *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword || ''}
            onChange={handlePasswordChange}
            placeholder="Повторите пароль"
            className={errors.confirmPassword ? 'error' : ''}
            style={{ 
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors.confirmPassword ? '#ff4444' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {errors.confirmPassword && (
            <div className="error-message show" style={{ color: '#ff4444', fontSize: '14px', marginTop: '5px' }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>
      </div>
      
      {/* Обзор данных */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#333' }}>Проверьте ваши данные:</h3>
        <div id="reviewData">
          <div style={{ marginBottom: '15px' }}>
            <strong>Тип аккаунта:</strong> {userTypeLabels[userType] || userType}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>ФИО:</strong> {formData.fullName}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Email:</strong> {formData.email}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Телефон:</strong> {formData.phone}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Дата рождения:</strong> {formatDate(formData.birthDate)}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Город:</strong> {formData.city}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Учебное заведение:</strong> {formData.institution}
          </div>
          
          {userType === 'parent' && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <strong>Телефон ребенка:</strong> {formData.childPhone}
              </div>
              {formData.childName && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Имя ребенка:</strong> {formData.childName}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Чекбоксы */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            style={{ 
              marginRight: '10px', 
              marginTop: '3px',
              width: '18px',
              height: '18px'
            }}
            checked={formData.agreeTerms || false}
            onChange={handleTermsChange}
          />
          <span>
            Я согласен с <a href="#" style={{ color: '#ff5d00' }}>условиями использования</a> и{' '}
            <a href="#" style={{ color: '#ff5d00' }}>политикой конфиденциальности</a> платформы Финатлон *
          </span>
        </label>
        <div className={`error-message ${errors.terms || errors.agreeTerms ? 'show' : ''}`} id="termsError">
          {errors.terms || errors.agreeTerms}
        </div>
      </div>
      
      <div className="form-group" style={{ marginBottom: '30px' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            style={{ 
              marginRight: '10px', 
              marginTop: '3px',
              width: '18px',
              height: '18px'
            }}
            checked={formData.newsletter !== false}
            onChange={(e) => onFormDataChange({ newsletter: e.target.checked })}
          />
          <span>Я хочу получать уведомления о новых мероприятиях и акциях на email</span>
        </label>
      </div>
      
      {/* Навигация */}
      <div className="form-navigation" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '15px'
      }}>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onPrevStep} 
          id="prevStep3"
          style={{
            flex: 1,
            padding: '12px 20px',
            border: '1px solid #ddd',
            background: '#f8f9fa',
            color: '#333',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Назад
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleSubmit}
          id="submitForm"
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 20px',
            border: 'none',
            background: '#ff5d00',
            color: 'white',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
}

export default FormStep3;