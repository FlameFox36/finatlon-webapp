import './App.css'
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/registration/components/RegistrationPage.jsx';
import Header from './pages/common/Header.jsx';
import Footer from './pages/common/Footer.jsx';
import Homepage from './pages/home/components/Homepage.jsx';

import './pages/registration/styles.css';
import './pages/home/styles.css';

import authService from './auth/AuthService.js';
import AuthPage from './pages/auth/components/AuthPage.jsx';
import './pages/auth/styles.css';

function App() {
  useEffect(() => {
    authService.init();
  }, []);

  return (
      <BrowserRouter className='App'>
      <Header />
        <Routes>
          <Route path="/" element={<Homepage />}/>
          <Route path="/registration" element={<RegistrationForm />}/>
          <Route path="/auth" element={<AuthPage />}/>
        </Routes>
      <Footer />
      </BrowserRouter>
  );
}

export default App;
