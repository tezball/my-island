import { ApiError, NetworkError } from './apiClient';
import type { User } from '../types/user';

// Re-export User type for backward compatibility
export type { User } from '../types/user';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export interface AuthResponse {
    user: User;
    token: string;
}

interface AuthApiResponse {
    token: string;
    tokenType: string;
    expiresIn: number;
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
        isOwner: boolean;
        isSupplier: boolean;
        emailVerified: boolean;
    };
}

function transformUser(apiUser: AuthApiResponse['user']): User {
    return {
        id: String(apiUser.id),
        email: apiUser.email,
        name: apiUser.name,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiUser.name)}&background=059669&color=fff`,
        isOwner: apiUser.isOwner,
        isSupplier: apiUser.isSupplier,
        emailVerified: apiUser.emailVerified,
    };
}

async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    try {
        return await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
    } catch {
        throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
    }
}

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await authFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            if (response.status === 401) throw new ApiError('Invalid email or password', 401);
            throw new ApiError('Login failed. Please try again.', response.status);
        }

        const apiResponse: AuthApiResponse = await response.json();
        return { user: transformUser(apiResponse.user), token: apiResponse.token };
    },

    async signup(name: string, email: string, password: string): Promise<AuthResponse> {
        const response = await authFetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            let errorBody: string | undefined;
            try {
                const json = await response.json();
                errorBody = json.message || JSON.stringify(json);
            } catch {
                errorBody = await response.text().catch(() => undefined);
            }
            if (response.status === 409 || errorBody?.toLowerCase().includes('email')) {
                throw new ApiError('Email already in use', 409);
            }
            throw new ApiError(errorBody || 'Signup failed. Please try again.', response.status);
        }

        const apiResponse: AuthApiResponse = await response.json();
        return { user: transformUser(apiResponse.user), token: apiResponse.token };
    },

    async logout(): Promise<void> {
        // JWT is stateless — logout handled client-side
    },

    async getCurrentUser(token: string): Promise<User> {
        const response = await authFetch('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new ApiError('Failed to get user profile', response.status);
        }

        const apiUser: AuthApiResponse['user'] = await response.json();
        return transformUser(apiUser);
    },

    async upgradeUserToOwner(_userId: string, propertyData?: {
        propertyName: string;
        county: string;
        town: string;
        propertyType: string;
        description?: string;
    }): Promise<User> {
        const token = localStorage.getItem('token');
        if (!token) throw new ApiError('Not authenticated', 401);

        const response = await authFetch('/auth/upgrade/owner', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(propertyData || {
                propertyName: 'My Property', county: 'Dublin',
                town: 'Dublin', propertyType: 'CAMPSITE',
            }),
        });

        if (!response.ok) throw new ApiError('Failed to upgrade to owner', response.status);

        const apiResponse: AuthApiResponse = await response.json();
        if (apiResponse.token) localStorage.setItem('token', apiResponse.token);
        return transformUser(apiResponse.user);
    },

    async upgradeUserToSupplier(_userId: string, businessData?: {
        businessName: string;
        category: string;
        county: string;
        town: string;
        description?: string;
    }): Promise<User> {
        const token = localStorage.getItem('token');
        if (!token) throw new ApiError('Not authenticated', 401);

        const response = await authFetch('/auth/upgrade/supplier', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(businessData || {
                businessName: 'My Business', category: 'FOOD',
                county: 'Dublin', town: 'Dublin',
            }),
        });

        if (!response.ok) throw new ApiError('Failed to upgrade to supplier', response.status);

        const apiResponse: AuthApiResponse = await response.json();
        if (apiResponse.token) localStorage.setItem('token', apiResponse.token);
        return transformUser(apiResponse.user);
    },

    async requestPasswordReset(email: string): Promise<void> {
        await authFetch('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        // Always resolve — API returns 200 even for unknown emails
    },

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const response = await authFetch('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        });
        if (!response.ok) throw new ApiError('Invalid or expired reset link', response.status);
    },

    async verifyEmail(token: string): Promise<void> {
        const response = await authFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        if (!response.ok) throw new ApiError('Invalid or expired verification link', response.status);
    },
};
