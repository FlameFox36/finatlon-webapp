// pages/registration/components/RegistrationPage.jsx
import React, { useState } from 'react';
import ProgressSteps from './ProgressSteps.jsx';
import FormStep1 from './FormStep1.jsx';
import FormStep2 from './FormStep2.jsx';
import FormStep3 from './FormStep3.jsx';
import { useNavigate } from 'react-router-dom';
import authService from '../../../auth/AuthService.js';

function RegistrationForm({ login }) {
  const navigate = useNavigate();
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
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    newsletter: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleFormDataChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep2 = () => {
    const newErrors = {};
    
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
    
    if (userType === 'parent' && !formData.childPhone.trim()) {
      newErrors.childPhone = 'Пожалуйста, введите номер телефона ребенка';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Пожалуйста, введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Пожалуйста, подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Вы должны принять условия соглашения';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    if (currentStep === 3 && !validateStep3()) {
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Подготовка данных для отправки в формате вашего API
      const registrationData = {
        email: formData.email,
        password: formData.password,
        user_type: userType === 'parent' ? 'Parent' : 
                  userType === 'student' ? 'Student' : 'Teacher',
        // Добавьте дополнительные поля, которые принимает ваш API
        fullName: formData.fullName,
        phone: formData.phone,
        birthDate: formData.birthDate,
        city: formData.city,
        institution: formData.institution,
        newsletter: formData.newsletter
      };

      // Для родителей добавляем данные ребенка
      if (userType === 'parent') {
        registrationData.childPhone = formData.childPhone;
        registrationData.childName = formData.childName;
      }

      // Используем AuthService для регистрации
      const result = await authService.register(registrationData);
      
      if (result.success) {
        setRegistrationSuccess(true);
        
        // Вызываем callback для обновления состояния аутентификации
        login();
        
        // Перенаправляем на профиль через 2 секунды
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      
      // Обработка ошибок от API
      let errorMessage = 'Ошибка регистрации. Попробуйте позже.';
      
      if (error.message.includes('email already exists')) {
        errorMessage = 'Пользователь с таким email уже зарегистрирован';
      } else if (error.message.includes('validation failed')) {
        errorMessage = 'Проверьте правильность введенных данных';
      }
      
      setErrors({
        general: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-card">
      <div className="registration-header">
        <h1>Регистрация в Финатлон</h1>
        <p>Присоединяйтесь к платформе мероприятий для студентов, родителей и учителей</p>
      </div>
      
      <div className="registration-content">
        <ProgressSteps currentStep={currentStep} />
        
        {registrationSuccess && (
          <div className="success-message">
            <h2>Регистрация успешно завершена!</h2>
            <p>Вы будете перенаправлены в профиль...</p>
          </div>
        )}
        
        {!registrationSuccess && currentStep === 1 && (
          <FormStep1
            userType={userType}
            onSelectUserType={handleUserTypeSelect}
            onNextStep={handleNextStep}
          />
        )}
        
        {!registrationSuccess && currentStep === 2 && (
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
        
        {!registrationSuccess && currentStep === 3 && (
          <FormStep3
            formData={formData}
            userType={userType}
            onPrevStep={handlePrevStep}
            onSubmit={handleNextStep}
            errors={errors}
            setErrors={setErrors}
            onFormDataChange={handleFormDataChange}
            isLoading={isLoading}
          />
        )}
        
        {errors.general && (
          <div className="error-message" style={{ 
            color: 'red', 
            marginTop: '20px',
            padding: '10px',
            border: '1px solid red',
            borderRadius: '4px'
          }}>
            {errors.general}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationForm;