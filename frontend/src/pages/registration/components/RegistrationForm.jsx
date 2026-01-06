import React, { useState } from 'react';
import ProgressSteps from './ProgressSteps.jsx';
import FormStep1 from './FormStep1.jsx';
import FormStep2 from './FormStep2.jsx';
import FormStep3 from './FormStep3.jsx';

const apiHost = process.env.API_HOST;

function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    city: '',
    institution: '',
    childPhone: '',
    childName: '',
    agreeTerms: false,
    newsletter: true
  });
  const [errors, setErrors] = useState({});

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleFormDataChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    // Проверка обязательных полей
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Пожалуйста, введите ваше ФИО';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Пожалуйста, введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Пожалуйста, введите корректный email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, введите номер телефона';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Пожалуйста, введите дату рождения';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Пожалуйста, введите город';
    }
    
    if (!formData.institution.trim()) {
      newErrors.institution = 'Пожалуйста, введите учебное заведение';
    }
    
    // Для родителей проверяем телефон ребенка
    if (userType === 'parent' && !formData.childPhone.trim()) {
      newErrors.childPhone = 'Пожалуйста, введите номер телефона ребенка';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Здесь обычно отправка данных на сервер
    console.log('Отправка данных:', { userType, ...formData });
    sendFormData({ userType, ...formData })
    
    // Сброс формы
    setUserType('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      city: '',
      institution: '',
      childPhone: '',
      childName: '',
      agreeTerms: false,
      newsletter: true
    });
    setErrors({});
    setCurrentStep(1);
  };

  const sendFormData = (formData) => {
    fetch(`http://${apiHost}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка сети: ' + response.statusText);
      }
      return response.json();
    })
    .then(result => {
      console.log('Ответ сервера:', result);
    })
    .catch(error => {
      console.error('Ошибка при отправке данных:', error);
    });
  };

  return (
    <div className="registration-card">
      <div className="registration-header">
        <h1>Регистрация в Финатлон</h1>
        <p>Присоединяйтесь к платформе мероприятий для студентов, родителей и учителей</p>
      </div>
      
      <div className="registration-content">
        <ProgressSteps currentStep={currentStep} />
        
        {currentStep === 1 && (
          <FormStep1
            userType={userType}
            onSelectUserType={handleUserTypeSelect}
            onNextStep={handleNextStep}
          />
        )}
        
        {currentStep === 2 && (
          <FormStep2
            formData={formData}
            onFormDataChange={handleFormDataChange}
            userType={userType}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            errors={errors}
            validateStep={validateStep2}
          />
        )}
        
        {currentStep === 3 && (
          <FormStep3
            formData={formData}
            userType={userType}
            onPrevStep={handlePrevStep}
            onSubmit={handleSubmit}
            errors={errors}
            setErrors={setErrors}
            onFormDataChange={handleFormDataChange}
          />
        )}
      </div>
    </div>
  );
}

export default RegistrationForm;