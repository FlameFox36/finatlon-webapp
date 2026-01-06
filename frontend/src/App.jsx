import './App.css'
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/registration/components/Header.jsx';
import Footer from './pages/registration/components/Footer.jsx';
import Login from './pages/authorization/Login.jsx';
import RegistrationForm from './pages/registration/components/RegistrationForm.jsx';
import './pages/registration/styles.css';
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
          <Route path="/" element={<p>Homepage!</p>}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/registration" element={<RegistrationForm />}/>
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
