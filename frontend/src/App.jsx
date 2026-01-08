import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/registration/components/RegistrationForm.jsx';
import Header from './pages/common/Header.jsx';
import Footer from './pages/common/Footer.jsx';
import Homepage from './pages/home/components/Homepage.jsx';

import './pages/registration/styles.css';
import './pages/home/styles.css';



function App() {
  return (
      <BrowserRouter className='App'>
      <Header />
        <Routes>
          <Route path="/" element={<Homepage />}/>
          <Route path="/registration" element={<RegistrationForm />}/>
        </Routes>
      <Footer />
      </BrowserRouter>
  );
}

export default App;
