import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdRefresh, MdWarning } from 'react-icons/md';

/**
 * ProtectedRoute Component
 * 
 * A higher-order component that protects routes by checking authentication status.
 * Redirects unauthenticated users to the login page and shows a loading spinner
 * while checking authentication status.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The components to render if authenticated
 * @param {string} props.redirectTo - Custom redirect path (defaults to '/login')
 * @param {boolean} props.requireAuth - Whether authentication is required (defaults to true)
 * @param {string[]} props.allowedRoles - Array of allowed roles (optional)
 * @returns {React.ReactNode} - The protected content or redirect
 */
const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login', 
  requireAuth = true,
  allowedRoles = []
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-4">
            <MdRefresh className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
          <p className="text-sm text-gray-500 mt-1">Checking authentication</p>
        </div>
      </div>
    );
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles.length > 0 && user) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-red-500 via-pink-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl mb-4">
              <MdWarning className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // If authenticated and has required role (if specified), render children
  return children;
};

export default ProtectedRoute;
