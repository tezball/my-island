// API configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Logging utility
const log = {
    info: (message: string, data?: Record<string, unknown>) => {
        console.log(`[AuthService] ${message}`, data ? JSON.stringify(data) : '');
    },
    error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
        console.error(`[AuthService] ERROR: ${message}`, {
            error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
            ...data,
        });
    },
    debug: (message: string, data?: Record<string, unknown>) => {
        if (import.meta.env.DEV) {
            console.debug(`[AuthService] DEBUG: ${message}`, data ? JSON.stringify(data) : '');
        }
    },
};

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    isOwner?: boolean;
    isSupplier?: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// API Response Types
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
    };
}

// Custom error classes
export class AuthServiceError extends Error {
    readonly code: string;
    readonly statusCode?: number;

    constructor(message: string, code: string, statusCode?: number) {
        super(message);
        this.name = 'AuthServiceError';
        this.code = code;
        this.statusCode = statusCode;
    }
}

export class InvalidCredentialsError extends AuthServiceError {
    constructor(message: string = 'Invalid email or password') {
        super(message, 'INVALID_CREDENTIALS', 401);
        this.name = 'InvalidCredentialsError';
    }
}

export class NetworkError extends AuthServiceError {
    constructor(message: string = 'Unable to connect to the server') {
        super(message, 'NETWORK_ERROR');
        this.name = 'NetworkError';
    }
}

// Transform API response to frontend User type
function transformUser(apiUser: AuthApiResponse['user']): User {
    return {
        id: String(apiUser.id),
        email: apiUser.email,
        name: apiUser.name,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiUser.name)}&background=059669&color=fff`,
        isOwner: apiUser.isOwner,
        isSupplier: apiUser.isSupplier,
    };
}

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const startTime = performance.now();
        log.info('Login attempt', { email });

        let response: Response;
        try {
            response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
        } catch (error) {
            log.error('Network error during login', error);
            throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
        }

        const durationMs = performance.now() - startTime;

        if (!response.ok) {
            if (response.status === 401) {
                log.info('Login failed - invalid credentials', { email, durationMs });
                throw new InvalidCredentialsError();
            }

            let errorBody: string | undefined;
            try {
                errorBody = await response.text();
            } catch {
                // Ignore
            }

            log.error('Login failed', undefined, {
                statusCode: response.status,
                errorBody,
                durationMs
            });
            throw new AuthServiceError(
                'Login failed. Please try again.',
                'LOGIN_ERROR',
                response.status
            );
        }

        const apiResponse: AuthApiResponse = await response.json();
        const result: AuthResponse = {
            user: transformUser(apiResponse.user),
            token: apiResponse.token,
        };

        log.info('Login successful', { userId: result.user.id, durationMs: Math.round(durationMs) });
        return result;
    },

    async signup(name: string, email: string, password: string): Promise<AuthResponse> {
        const startTime = performance.now();
        log.info('Signup attempt', { email, name });

        let response: Response;
        try {
            response = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
        } catch (error) {
            log.error('Network error during signup', error);
            throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
        }

        const durationMs = performance.now() - startTime;

        if (!response.ok) {
            let errorBody: string | undefined;
            try {
                const errorJson = await response.json();
                errorBody = errorJson.message || JSON.stringify(errorJson);
            } catch {
                errorBody = await response.text().catch(() => undefined);
            }

            if (response.status === 409 || errorBody?.toLowerCase().includes('email')) {
                log.info('Signup failed - email already exists', { email, durationMs });
                throw new AuthServiceError('Email already in use', 'EMAIL_EXISTS', 409);
            }

            log.error('Signup failed', undefined, {
                statusCode: response.status,
                errorBody,
                durationMs
            });
            throw new AuthServiceError(
                errorBody || 'Signup failed. Please try again.',
                'SIGNUP_ERROR',
                response.status
            );
        }

        const apiResponse: AuthApiResponse = await response.json();
        const result: AuthResponse = {
            user: transformUser(apiResponse.user),
            token: apiResponse.token,
        };

        log.info('Signup successful', { userId: result.user.id, durationMs: Math.round(durationMs) });
        return result;
    },

    async logout(): Promise<void> {
        log.info('Logout');
        // JWT is stateless - logout is handled client-side by clearing localStorage
        // The AuthContext handles clearing localStorage
    },

    async getCurrentUser(token: string): Promise<User> {
        const startTime = performance.now();
        log.info('Fetching current user');

        let response: Response;
        try {
            response = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            log.error('Network error fetching current user', error);
            throw new NetworkError();
        }

        const durationMs = performance.now() - startTime;

        if (!response.ok) {
            log.error('Failed to fetch current user', undefined, {
                statusCode: response.status,
                durationMs
            });
            throw new AuthServiceError('Failed to get user profile', 'FETCH_USER_ERROR', response.status);
        }

        const apiUser: AuthApiResponse['user'] = await response.json();
        const user = transformUser(apiUser);

        log.info('Current user fetched', { userId: user.id, durationMs: Math.round(durationMs) });
        return user;
    },

    async upgradeUserToOwner(userId: string, propertyData?: {
        propertyName: string;
        county: string;
        town: string;
        propertyType: string;
        description?: string;
    }): Promise<User> {
        const startTime = performance.now();
        log.info('Upgrading user to owner', { userId });

        const token = localStorage.getItem('token');
        if (!token) {
            throw new AuthServiceError('Not authenticated', 'AUTH_ERROR', 401);
        }

        let response: Response;
        try {
            response = await fetch(`${API_BASE}/auth/upgrade/owner`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData || {
                    propertyName: 'My Property',
                    county: 'Dublin',
                    town: 'Dublin',
                    propertyType: 'CAMPSITE',
                }),
            });
        } catch (error) {
            log.error('Network error during owner upgrade', error);
            throw new NetworkError();
        }

        const durationMs = performance.now() - startTime;

        if (!response.ok) {
            log.error('Owner upgrade failed', undefined, {
                statusCode: response.status,
                durationMs
            });
            throw new AuthServiceError('Failed to upgrade to owner', 'UPGRADE_ERROR', response.status);
        }

        const apiResponse: AuthApiResponse = await response.json();
        const user = transformUser(apiResponse.user);

        // Update token if a new one was issued
        if (apiResponse.token) {
            localStorage.setItem('token', apiResponse.token);
        }

        log.info('User upgraded to owner', { userId: user.id, durationMs: Math.round(durationMs) });
        return user;
    },

    async upgradeUserToSupplier(userId: string, businessData?: {
        businessName: string;
        category: string;
        county: string;
        town: string;
        description?: string;
    }): Promise<User> {
        const startTime = performance.now();
        log.info('Upgrading user to supplier', { userId });

        const token = localStorage.getItem('token');
        if (!token) {
            throw new AuthServiceError('Not authenticated', 'AUTH_ERROR', 401);
        }

        let response: Response;
        try {
            response = await fetch(`${API_BASE}/auth/upgrade/supplier`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(businessData || {
                    businessName: 'My Business',
                    category: 'FOOD',
                    county: 'Dublin',
                    town: 'Dublin',
                }),
            });
        } catch (error) {
            log.error('Network error during supplier upgrade', error);
            throw new NetworkError();
        }

        const durationMs = performance.now() - startTime;

        if (!response.ok) {
            log.error('Supplier upgrade failed', undefined, {
                statusCode: response.status,
                durationMs
            });
            throw new AuthServiceError('Failed to upgrade to supplier', 'UPGRADE_ERROR', response.status);
        }

        const apiResponse: AuthApiResponse = await response.json();
        const user = transformUser(apiResponse.user);

        // Update token if a new one was issued
        if (apiResponse.token) {
            localStorage.setItem('token', apiResponse.token);
        }

        log.info('User upgraded to supplier', { userId: user.id, durationMs: Math.round(durationMs) });
        return user;
    },
};
