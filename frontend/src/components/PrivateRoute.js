import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles, requireVerification = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'user') return <Navigate to="/user/dashboard" replace />;
    if (user.role === 'pharmacy') return <Navigate to="/pharmacy/verification" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // Check pharmacy verification status
  if (requireVerification && user.role === 'pharmacy' && user.verificationStatus !== 'approved') {
    return <Navigate to="/pharmacy/verification" replace />;
  }

  return children;
};

export default PrivateRoute;
