import './App.css'
import Header from './pages/registration/components/Header.jsx';
import Footer from './pages/registration/components/Footer.jsx';
import RegistrationForm from './pages/registration/components/RegistrationForm.jsx';
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
