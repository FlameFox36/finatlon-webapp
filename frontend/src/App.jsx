import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/registration/components/RegistrationPage.jsx';
import Homepage from './pages/home/components/HomePage.jsx';
import Auth from './pages/auth/components/AuthPage.jsx';
import Header from './pages/common/Header.jsx';
import Footer from './pages/common/Footer.jsx';

import './pages/registration/styles.css';
import './pages/home/styles.css';
import './pages/auth/styles.css';



function App() {
  return (
      <BrowserRouter className='App'>
      <Header />
        <Routes>
          <Route path="/" element={<Homepage />}/>
          <Route path="/registration" element={<RegistrationForm />}/>
          <Route path="/auth" element={<Auth />}/>
        </Routes>
      <Footer />
      </BrowserRouter>
  );
}

export default App;
