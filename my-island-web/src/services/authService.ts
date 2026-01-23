export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role: 'admin' | 'user';
}

export interface AuthResponse {
    user: User;
    token: string;
}

const MOCK_USER: User = {
    id: 'u1',
    email: 'test@example.com',
    name: 'Sarah O\'Connor',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5BNuO8loW1yn3QgoTqdTTkR3gR2Pplm0zpvBGEqcc44eQAYXmvthnp4ANjmGs-9vZA2JDrNs-nO4lq5pa0X97RD7tVs_JsTet1fS0NEbXDfbQPGlHwEuqa99U0KO60UPf6XuPACdJP9c7zn9rh3Wzw9ZYTIOdST9IVM7rEXnHa7fn16pRfPkZ7pQdRh9Vcyu4gdrfIqZeeHHvYeUp0dh1nDzi_1jLmiXqhwhn3dM31DGe1TZLWoAryZVPcqxapsD_B5efMjfoKg',
    role: 'user',
};

export const MOCK_USERS = [
    {
        email: 'test@example.com',
        password: 'password',
        label: 'Sarah O\'Connor (Default User)',
        role: 'user' as const
    },
    {
        email: 'john@example.com',
        password: 'password',
        label: 'John Doe (New User)',
        role: 'user' as const
    },
    {
        email: 'admin@myisland.com',
        password: 'password',
        label: 'Admin User (Power User)',
        role: 'admin' as const
    }
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        await delay(800); // Simulate network request for 0.8s

        if (email === 'test@example.com' && password === 'password') {
            return {
                user: MOCK_USER,
                token: 'mock-jwt-token-12345',
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
                    role: email.includes('admin') ? 'admin' : 'user',
                },
                token: 'mock-jwt-token-random',
            };
        }

        throw new Error('Invalid credentials');
    },

    async signup(name: string, email: string, password: string): Promise<AuthResponse> {
        await delay(1000); // Simulate network request

        if (email === 'taken@example.com') {
            throw new Error('Email already already in use');
        }

        return {
            user: {
                id: Math.random().toString(36).substr(2, 9),
                email,
                name,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                role: 'user',
            },
            token: 'mock-jwt-token-new-user',
        };
    },

    async logout(): Promise<void> {
        await delay(300);
    }
};
