import React, { useState } from 'react';
import ProgressSteps from './ProgressSteps.jsx';
import FormStep1 from './FormStep1.jsx';
import FormStep2 from './FormStep2.jsx';
import FormStep3 from './FormStep3.jsx';

// Импортируем наш сервис авторизации
import authService from '../../../auth/AuthService.js';
import api from '../../../auth/api.js';

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
    password: '', // Добавляем поле для пароля
    confirmPassword: '', // Добавляем подтверждение пароля
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

  // Добавляем валидацию для шага 3 (пароли)
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
      return; // Не переходим дальше, если есть ошибки
    }
    if (currentStep === 3 && !validateStep3()) {
      return; // Не отправляем, если есть ошибки
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      handleSubmit(); // На третьем шаге отправляем форму
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return; // Не отправляем, если есть ошибки
    }

    setIsLoading(true);
    
    try {
      // Подготовка данных для отправки
      const registrationData = {
        userType: userType,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        city: formData.city,
        institution: formData.institution,
        password: formData.password,
        agreeTerms: formData.agreeTerms,
        newsletter: formData.newsletter
      };

      // Добавляем данные ребенка только для родителей
      if (userType === 'parent') {
        registrationData.childPhone = formData.childPhone;
        registrationData.childName = formData.childName;
      }

      // Отправляем запрос на регистрацию
      const response = await api.post('/auth/register', registrationData);
      
      // Если сервер вернул токен - сохраняем его
      if (response.data.token) {
        // Получаем данные пользователя из ответа сервера
        const userData = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          userType: response.data.user.userType
          // Добавьте другие поля, которые возвращает сервер
        };
        
        // Сохраняем токен и данные пользователя
        authService.login(response.data.token, userData);
        
        // Показываем сообщение об успехе
        setRegistrationSuccess(true);
        
        // Через 2 секунды перенаправляем на главную страницу
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
        
      } else {
        throw new Error('Сервер не вернул токен авторизации');
      }

    } catch (error) {
      console.error('Ошибка регистрации:', error);
      
      // Показываем ошибку пользователю
      if (error.response && error.response.data) {
        const serverErrors = error.response.data.errors || {};
        
        // Преобразуем ошибки сервера в формат для отображения
        const displayErrors = {};
        Object.keys(serverErrors).forEach(key => {
          if (serverErrors[key]) {
            displayErrors[key] = serverErrors[key];
          }
        });
        
        // Если есть общая ошибка (например, email уже занят)
        if (error.response.data.message) {
          displayErrors.general = error.response.data.message;
        }
        
        setErrors(displayErrors);
      } else {
        setErrors({
          general: 'Ошибка подключения к серверу. Попробуйте позже.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Сброс формы (если нужно)
  const resetForm = () => {
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
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      newsletter: true
    });
    setErrors({});
    setCurrentStep(1);
    setRegistrationSuccess(false);
  };

  return (
    <div className="registration-card">
      <div className="registration-header">
        <h1>Регистрация в Финатлон</h1>
        <p>Присоединяйтесь к платформе мероприятий для студентов, родителей и учителей</p>
      </div>
      
      <div className="registration-content">
        <ProgressSteps currentStep={currentStep} />
        
        {/* Сообщение об успешной регистрации */}
        {registrationSuccess && (
          <div className="success-message">
            <h2>Регистрация успешно завершена!</h2>
            <p>Вы будете перенаправлены на главную страницу...</p>
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
            onSubmit={handleNextStep} // Теперь это вызывает handleSubmit
            errors={errors}
            setErrors={setErrors}
            onFormDataChange={handleFormDataChange}
            isLoading={isLoading}
          />
        )}
        
        {/* Показываем общую ошибку, если есть */}
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