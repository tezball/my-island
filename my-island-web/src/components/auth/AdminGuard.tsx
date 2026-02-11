import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminGuard: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/signin" replace />;
    }

    if (!user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
