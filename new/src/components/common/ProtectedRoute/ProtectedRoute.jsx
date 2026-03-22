import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute Component
 * @param {Array} allowedRoles - List of roles that can access the route
 * @param {JSX.Element} children - Component to render if authorized
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    // Show nothing while loading (or a spinner)
    if (isLoading) {
        return null; 
    }

    // Not authenticated
    if (!token || !user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Role not authorized
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
