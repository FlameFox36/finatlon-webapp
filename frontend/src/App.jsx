import './App.css'
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/authorization/Login.jsx';
import RegistrationForm from './pages/registration/components/RegistrationForm.jsx';
import Header from './pages/common/Header.jsx';
import Footer from './pages/common/Footer.jsx';
import Homepage from './pages/home/components/Homepage.jsx';

import './pages/registration/styles.css';
import './pages/home/styles.css';

import authService from './auth/AuthService.js';

function App() {
  useEffect(() => {
    authService.init();
  }, []);

  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Homepage />}/>
          <Route path="/login" element={<Login />} />
          <Route path="registration" element={<RegistrationForm />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
