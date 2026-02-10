import { apiRequest } from './apiClient';

export interface StaffMember {
    id: number;
    email: string;
    status: 'INVITED' | 'ACTIVE';
    userName: string | null;
}

export const ownerStaffService = {
    list(): Promise<StaffMember[]> {
        return apiRequest<StaffMember[]>('/owner/staff');
    },

    add(email: string): Promise<StaffMember> {
        return apiRequest<StaffMember>('/owner/staff', {
            method: 'POST',
            body: { email },
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

    add(email: string): Promise<StaffMember> {
        return apiRequest<StaffMember>('/supplier/staff', {
            method: 'POST',
            body: { email },
        });
    },

    remove(id: number): Promise<void> {
        return apiRequest<void>(`/supplier/staff/${id}`, {
            method: 'DELETE',
        });
    },
};
