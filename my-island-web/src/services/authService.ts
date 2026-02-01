import { MOCK_DB } from './mockData';

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

export const MOCK_USERS = MOCK_DB.users;

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        await delay(800);

        // Check against mock DB
        const dbUser = MOCK_DB.users.find(u => u.email === email && u.password === password);
        if (dbUser) {
            return {
                user: dbUser.userProfile,
                token: `mock-jwt-token-${dbUser.userProfile.id}`,
            };
        }

        // Allow any login with "password" for easier testing if not specific user
        if (password === 'password') {
            return {
                user: {
                    id: Math.random().toString(36).substr(2, 9),
                    email,
                    name: email.split('@')[0],
                    avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
                },
                token: 'mock-jwt-token-random',
            };
        }

        throw new Error('Invalid credentials');
    },

    async signup(name: string, email: string, _password: string): Promise<AuthResponse> {
        await delay(1000);

        if (email === 'taken@example.com') {
            throw new Error('Email already already in use');
        }

        return {
            user: {
                id: Math.random().toString(36).substr(2, 9),
                email,
                name,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            },
            token: 'mock-jwt-token-new-user',
        };
    },

    async logout(): Promise<void> {
        await delay(300);
    },

    async upgradeUserToOwner(userId: string): Promise<User> {
        await delay(800);
        return {
            id: userId,
            email: 'user@example.com',
            name: 'Property Owner',
            avatarUrl: '',
            isOwner: true
        };
    },

    async upgradeUserToSupplier(userId: string): Promise<User> {
        await delay(800);
        return {
            id: userId,
            email: 'user@example.com',
            name: 'Supplier',
            avatarUrl: '',
            isSupplier: true
        };
    }
};
