// auth/AuthService.js
import api from './api.js';

class AuthService {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Инициализация
  init() {
    // Можно добавить проверку валидности токена
    const token = api.getToken();
    if (token) {
      // Проверяем, не истек ли токен
      if (this.isTokenExpired(token)) {
        this.logout();
      }
    }
  }

  // Логин
  async login(credentials) {
    try {
      const data = await api.login(credentials);
      
      if (data.accessToken) {
        api.setToken(data.accessToken);
        
        // Получаем данные профиля
        const userData = await api.getProfile();
        this.setUser(userData);
        
        return {
          success: true,
          user: userData
        };
      }
      
      throw new Error('No token received');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Регистрация
  async register(userData) {
    try {
      const data = await api.register(userData);
      
      if (data.accessToken) {
        api.setToken(data.accessToken);
        
        // Если сервер возвращает данные пользователя при регистрации
        if (data.user) {
          this.setUser(data.user);
        } else {
          // Иначе получаем профиль
          const userData = await api.getProfile();
          this.setUser(userData);
        }
        
        return {
          success: true,
          data
        };
      }
      
      throw new Error('Registration failed - no token received');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Выход
  logout() {
    api.removeToken();
    localStorage.removeItem('user');
    this.user = null;
    window.location.href = '/login';
  }

  // Проверка аутентификации
  isAuthenticated() {
    const token = api.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Получение данных пользователя
  getUser() {
    return this.user;
  }

  // Сохранение данных пользователя
  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Получение токена
  getToken() {
    return api.getToken();
  }

  // Обновление профиля
  async updateProfile(userData) {
    try {
      const updatedUser = await api.updateProfile(userData);
      this.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Проверка истечения токена
  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Конвертируем в миллисекунды
      return Date.now() > expiry;
    } catch {
      return true;
    }
  }

  // Проверка роли пользователя
  hasRole(role) {
    return this.user?.userType === role;
  }

  // Является ли пользователь родителем
  isParent() {
    return this.hasRole('parent');
  }

  // Является ли пользователь студентом
  isStudent() {
    return this.hasRole('student');
  }

  // Является ли пользователь учителем
  isTeacher() {
    return this.hasRole('teacher');
  }
}

const authService = new AuthService();
export default authService;