import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/registration/components/RegistrationForm.jsx';
import Homepage from './pages/home/components/Homepage.jsx';
import Profile from './pages/profile/components/ProfilePage.jsx';
import Header from './pages/common/Header.jsx';
import Footer from './pages/common/Footer.jsx';

import './pages/home/styles.css'; 
import './pages/registration/styles.css';
import './pages/profile/styles.css';



function App() {
  return (
      <BrowserRouter className='App'>
      <Header />
        <Routes>
          <Route path="/" element={<Homepage />}/>
          <Route path="/registration" element={<RegistrationForm />}/>
          <Route path="/profile" element={<Profile />}/>
        </Routes>
      <Footer />
      </BrowserRouter>
  );
}

export default App;
