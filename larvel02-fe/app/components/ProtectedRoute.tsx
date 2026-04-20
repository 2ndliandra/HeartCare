import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const token = localStorage.getItem('auth_token');
    const userString = localStorage.getItem('user');
    let user = null;
    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
    }

    console.log('ProtectedRoute Check:', {
        path: window.location.pathname,
        token: !!token,
        user,
        roles: user?.roles,
        allowedRoles
    });

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user) {
        // If user object has roles property (from our login change)
        const userRoles = user.roles || [];
        const hasPermission = allowedRoles.some(role => userRoles.includes(role));

        // Also check if roles are stored directly on user object for some reason, 
        // or if we need to fetch them. 
        // For now, assuming roles are in user.roles as per our Login.tsx change.

        if (!hasPermission) {
            // Redirect to appropriate dashboard if authorized, or home if not
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
