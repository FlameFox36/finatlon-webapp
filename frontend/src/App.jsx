import './App.css'
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/registration/components/RegistrationPage.jsx';
import Homepage from './pages/home/components/Homepage.jsx';
import ProfilePage from './pages/profile/components/ProfilePage.jsx';
import LoginPage from './pages/login/components/LoginPage.jsx';
import Header from './pages/common/Header.jsx';
import Footer from './pages/common/Footer.jsx';

import './pages/home/styles.css'; 
import './pages/registration/styles.css';
import './pages/profile/styles.css';
import './pages/login/styles.css';

import ProtectedRoute from './pages/profile/components/ProtectedRoute.jsx';
import authService from './auth/AuthService.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Проверяем аутентификацию при загрузке приложения
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    
    checkAuth();
    
    // Можно добавить периодическую проверку токена
    const interval = setInterval(checkAuth, 60000); // Каждую минуту
    
    return () => clearInterval(interval);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <Header isAuthenticated={isAuthenticated} logout={logout} /> 
        <Routes>
          <Route path="/" element={<Homepage />}/>
          <Route path="/registration" element={<RegistrationPage login={login}/>}/>
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage logout={logout}/>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage login={login}/>}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;