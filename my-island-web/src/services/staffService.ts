import { apiRequest } from './apiClient';

export interface StaffMember {
    id: number;
    email: string;
    status: 'INVITED' | 'ACTIVE';
    userName: string | null;
    role: string;
}

export const OWNER_ROLES = [
    { value: 'MANAGER', label: 'Manager', description: 'Full access except billing & staff' },
    { value: 'RECEPTIONIST', label: 'Receptionist', description: 'Check-ins, bookings & calendar' },
    { value: 'GROUNDSKEEPER', label: 'Groundskeeper', description: 'Lots, calendar & property' },
    { value: 'VIEWER', label: 'Viewer', description: 'Read-only access' },
] as const;

export const SUPPLIER_ROLES = [
    { value: 'MANAGER', label: 'Manager', description: 'Full access except billing & staff' },
    { value: 'ASSOCIATE', label: 'Associate', description: 'Offers, redemptions & reviews' },
    { value: 'REDEEMER', label: 'Redeemer', description: 'Voucher redemption only' },
    { value: 'VIEWER', label: 'Viewer', description: 'Read-only access' },
] as const;

export const ownerStaffService = {
    list(): Promise<StaffMember[]> {
        return apiRequest<StaffMember[]>('/owner/staff');
    },

    add(email: string, role: string = 'MANAGER'): Promise<StaffMember> {
        return apiRequest<StaffMember>('/owner/staff', {
            method: 'POST',
            body: { email, role },
        });
    },

    updateRole(id: number, role: string): Promise<StaffMember> {
        return apiRequest<StaffMember>(`/owner/staff/${id}`, {
            method: 'PUT',
            body: { role },
        });
    },

    remove(id: number): Promise<void> {
        return apiRequest<void>(`/owner/staff/${id}`, {
            method: 'DELETE',
        });
    },
};

export const supplierStaffService = {
    list(): Promise<StaffMember[]> {
        return apiRequest<StaffMember[]>('/supplier/staff');
    },

    add(email: string, role: string = 'MANAGER'): Promise<StaffMember> {
        return apiRequest<StaffMember>('/supplier/staff', {
            method: 'POST',
            body: { email, role },
        });
    },

    updateRole(id: number, role: string): Promise<StaffMember> {
        return apiRequest<StaffMember>(`/supplier/staff/${id}`, {
            method: 'PUT',
            body: { role },
        });
    },

    remove(id: number): Promise<void> {
        return apiRequest<void>(`/supplier/staff/${id}`, {
            method: 'DELETE',
        });
    },
};
