import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './pages/registration/components/Header';
import Footer from './pages/registration/components/Footer';
import RegistrationForm from './pages/registration/components/RegistrationForm';
import './pages/registration/styles.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="registration-wrapper">
        <div className="container registration-container">
          <RegistrationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
