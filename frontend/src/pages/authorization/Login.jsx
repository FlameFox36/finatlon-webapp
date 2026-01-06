import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../auth/AuthService.js';
import api from '../../auth/api.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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

    navigate('/'); // Перенаправляет на /dashboard
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}

export default Login;