export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    isOwner?: boolean;
    isSupplier?: boolean;
    emailVerified?: boolean;
}
