class AuthService {
  constructor() {
    this.tokenKey = 'jwt_token';
    this.userKey = 'user_data';
  }

  // Сохраняем токен и данные пользователя
  login(token, userData) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(userData));
    
    // Устанавливаем заголовок для всех будущих запросов
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Выход из системы
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  }

  // Проверяем, авторизован ли пользователь
  isAuthenticated() {
    return !!this.getToken();
  }

  // Получаем токен из localStorage
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Получаем данные пользователя
  getUser() {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Инициализируем axios при загрузке страницы
  init() {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Проверяем токен (простая проверка без обращения к серверу)
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;
    
    // Простая проверка: если токен есть, считаем его валидным
    // В реальном приложении здесь нужно проверять срок действия
    return true;
  }
}

// Создаем один экземпляр для всего приложения
const authService = new AuthService();
export default authService;