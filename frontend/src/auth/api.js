const API_URL = 'http://localhost/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token') || null;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token;
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    // Добавляем токен в заголовки, если он есть
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include'
    };

    try {
      const response = await fetch(url, config);
      
      // Если ответ 401 (Unauthorized), возможно токен истек
      if (response.status === 401) {
        this.removeToken();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Методы для работы с пользователями
  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getProfile() {
    return this.request('/users/profile', {
      method: 'GET'
    });
  }

  async updateProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    // Если на бэкенде есть endpoint для logout
    try {
      await this.request('/users/logout', {
        method: 'POST'
      });
    } finally {
      this.removeToken();
    }
  }
}

const api = new ApiService();
export default api;