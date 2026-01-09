import React from 'react';
import AuthForm from './AuthForm.jsx';
import ProtectedRoute from '../../authorization/ProtectedRoute.jsx';

const AuthPage = () => {
  return (
    <div className="main-content">
      <div className="auth-container">
        <div className="auth-card">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;