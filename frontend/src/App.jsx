import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import RegistrationForm from './components/RegistrationForm';
import './styles.css';

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
