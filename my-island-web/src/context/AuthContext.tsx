import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type User } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    upgradeToOwner: () => Promise<void>;
    upgradeToSupplier: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse user from local storage:', error);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login(email, password);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.signup(name, email, password);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const upgradeToOwner = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const upgradedUser = await authService.upgradeUserToOwner(user.id);
            const newUser = { ...user, ...upgradedUser, isOwner: true };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        } finally {
            setIsLoading(false);
        }
    };

    const upgradeToSupplier = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const upgradedUser = await authService.upgradeUserToSupplier(user.id);
            const newUser = { ...user, ...upgradedUser, isSupplier: true };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        } finally {
            setIsLoading(false);
        }
    };

    const requestPasswordReset = async (email: string) => {
        setIsLoading(true);
        try {
            await authService.requestPasswordReset(email);
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (token: string, newPassword: string) => {
        setIsLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, upgradeToOwner, upgradeToSupplier, requestPasswordReset, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
