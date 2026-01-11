import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../../auth/AuthService.js';

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/auth" />;
  }
  else {
    return children;
  }
}

export default ProtectedRoute;