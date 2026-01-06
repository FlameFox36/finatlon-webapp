import React, { useState } from 'react';

function FormStep3({
  formData,
  userType,
  onPrevStep,
  onSubmit,
  errors,
  setErrors
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTypeLabels = {
    'student': 'Студент',
    'parent': 'Родитель',
    'teacher': 'Учитель'
  };

  const onFormDataChange = () => {
    console.log('onFormDataChange raised');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const handleSubmit = () => {
    if (!formData.agreeTerms) {
      setErrors(prev => ({ ...prev, terms: 'Необходимо согласиться с условиями' }));
      return;
    }

    setErrors(prev => ({ ...prev, terms: '' }));
    setIsSubmitting(true);
    
    // Имитация отправки данных
    setTimeout(() => {
      onSubmit();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="form-step" id="step3Form">
      <h2 className="section-title">Проверка данных</h2>
      <p style={{ textAlign: 'center', marginBottom: '40px', color: '#666' }}>
        Проверьте введенные данные перед отправкой
      </p>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
        <div id="reviewData">
          <div style={{ marginBottom: '20px' }}>
            <strong>Тип аккаунта:</strong> {userTypeLabels[userType] || userType}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>ФИО:</strong> {formData.fullName}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Email:</strong> {formData.email}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Телефон:</strong> {formData.phone}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Дата рождения:</strong> {formatDate(formData.birthDate)}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Город:</strong> {formData.city}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Учебное заведение:</strong> {formData.institution}
          </div>
          
          {userType === 'parent' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <strong>Телефон ребенка:</strong> {formData.childPhone}
              </div>
              {formData.childName && (
                <div style={{ marginBottom: '20px' }}>
                  <strong>Имя ребенка:</strong> {formData.childName}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            style={{ marginRight: '10px', marginTop: '3px' }}
            checked={formData.agreeTerms || false}
            onChange={(e) => onFormDataChange({ agreeTerms: e.target.checked })}
          />
          <span>
            Я согласен с <a href="#" style={{ color: '#ff5d00' }}>условиями использования</a> и{' '}
            <a href="#" style={{ color: '#ff5d00' }}>политикой конфиденциальности</a> платформы Финатлон
          </span>
        </label>
        <div className={`error-message ${errors.terms ? 'show' : ''}`} id="termsError">
          {errors.terms}
        </div>
      </div>
      
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            style={{ marginRight: '10px', marginTop: '3px' }}
            checked={formData.newsletter !== false}
            onChange={(e) => onFormDataChange({ newsletter: e.target.checked })}
          />
          <span>Я хочу получать уведомления о новых мероприятиях и акциях на email</span>
        </label>
      </div>
      
      <div className="form-navigation">
        <button type="button" className="btn btn-secondary" onClick={onPrevStep} id="prevStep3">
          Назад
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleSubmit}
          id="submitForm"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : 'Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
}

export default FormStep3;