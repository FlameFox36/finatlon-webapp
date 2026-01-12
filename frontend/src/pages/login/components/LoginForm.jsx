// components/AuthForm.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVk, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import authService from '../../../auth/AuthService.js'; // Импортируем AuthService

const AuthForm = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Валидация полей
    if (!email.trim()) {
      setError('Пожалуйста, введите email');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Пожалуйста, введите пароль');
      setIsLoading(false);
      return;
    }

    try {
      // Используем AuthService для авторизации
      const credentials = {
        email: email.trim(),
        password: password.trim()
      };

      const result = await authService.login(credentials);
      
      if (result.success) {
        // Вызываем callback для обновления состояния в App.js
        login();
        
        // Если установлен флажок "Запомнить меня"
        if (rememberMe) {
          // Здесь можно сохранить что-то дополнительно
          console.log('Запомнить пользователя:', email);
        }
        
        // Перенаправляем на профиль
        navigate('/profile');
      }
      
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      
      // Определяем понятное сообщение об ошибке
      let errorMessage = 'Ошибка авторизации';
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        errorMessage = 'Неверный email или пароль';
      } else if (err.message.includes('network')) {
        errorMessage = 'Проблемы с подключением к серверу. Проверьте интернет-соединение';
      } else if (err.message.includes('email')) {
        errorMessage = 'Пользователь с таким email не найден';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    alert(`Авторизация через ${provider} будет реализована в будущем`);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Перенаправляем на страницу восстановления пароля
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Вход в аккаунт</h1>
        <p className="auth-subtitle">
          Войдите, чтобы получить доступ ко всем возможностям платформы
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="example@mail.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            Запомнить меня
          </label>
          <a 
            onClick={handleForgotPassword}
            className="forgot-password"
          >
            Забыли пароль?
          </a>
        </div>

        {error && (
          <div className="error-message" style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <div className="auth-divider">
        или войдите через
      </div>

      <div className="social-auth">
        <button
          className="social-btn vk"
          onClick={() => handleSocialAuth('VK')}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faVk} />
          ВКонтакте
        </button>
        <button
          className="social-btn google"
          onClick={() => handleSocialAuth('Google')}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faGoogle} />
          Google
        </button>
      </div>

      <div className="auth-footer">
        Еще нет аккаунта?{' '}
        <a href="/registration" className="register-link">
          Зарегистрироваться
        </a>
      </div>
    </>
  );
};

export default AuthForm;