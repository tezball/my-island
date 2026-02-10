import React from 'react';
import { StaffManagement } from '../../components/staff/StaffManagement';
import { ownerStaffService } from '../../services/staffService';
import { useAuth } from '../../context/AuthContext';

export const OwnerStaffPage: React.FC = () => {
    const { user } = useAuth();

    if (!user?.isOwner) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Only property owners can manage staff members.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Staff</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your team members</p>
            </div>

            <StaffManagement
                listStaff={ownerStaffService.list}
                addStaff={ownerStaffService.add}
                removeStaff={ownerStaffService.remove}
            />
        </div>
    );
};
