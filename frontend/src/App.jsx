import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/registration/components/Header.jsx';
import Footer from './pages/registration/components/Footer.jsx';
import RegistrationForm from './pages/registration/components/RegistrationForm.jsx';
import './pages/registration/styles.css';

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="" element={<p>Homepage!</p>}/>
          <Route path="registration" element={<RegistrationForm />}/>
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
