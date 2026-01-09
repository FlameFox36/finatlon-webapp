// components/AuthForm.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVk, faGoogle } from '@fortawesome/free-brands-svg-icons';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Отправляем запрос на сервер
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      // Сохраняем токен и данные пользователя
      authService.login(response.data.token, response.data.user);
      
      // Перенаправляем на главную страницу
      window.location.href = '/';
      
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }

    navigate(-1); // Перенаправляет на предыдущую страницу
  };

  const handleSocialAuth = (provider) => {
    alert(`Авторизация через ${provider} будет реализована в будущем`);
  };

  const handleForgotPassword = () => {
    alert('Функция восстановления пароля будет доступна в ближайшее время');
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
          />
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
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

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
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
        >
          <FontAwesomeIcon icon={faVk} />
          ВКонтакте
        </button>
        <button
          className="social-btn google"
          onClick={() => handleSocialAuth('Google')}
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