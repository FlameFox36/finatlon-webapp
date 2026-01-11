import React from 'react';
import AuthForm from './LoginForm.jsx';

const AuthPage = ({ login }) => {
  return (
    <div className="main-content">
      <div className="auth-container">
        <div className="auth-card">
          <AuthForm login={login}/>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;