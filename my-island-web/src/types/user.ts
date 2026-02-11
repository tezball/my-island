export interface PortalPermissions {
    role: string;
    permissions: Record<string, 'NONE' | 'READ' | 'FULL'>;
}

export interface StaffPermissions {
    owner: PortalPermissions | null;
    supplier: PortalPermissions | null;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    isOwner?: boolean;
    isSupplier?: boolean;
    isStaff?: boolean;
    isAdmin?: boolean;
    emailVerified?: boolean;
    staffPermissions?: StaffPermissions | null;
}
