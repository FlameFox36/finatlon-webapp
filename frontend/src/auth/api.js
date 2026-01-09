import axios from 'axios';

// Настраиваем базовый URL (измените на свой)
const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_HOST}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик для автоматической проверки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Если сервер вернул 401 (Unauthorized) - разлогиниваем
      authService.logout();
    }
    return Promise.reject(error);
  }
);

export default api;