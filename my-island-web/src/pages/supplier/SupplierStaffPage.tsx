import React from 'react';
import { StaffManagement } from '../../components/staff/StaffManagement';
import { supplierStaffService, SUPPLIER_ROLES } from '../../services/staffService';
import { useAuth } from '../../context/AuthContext';

export const SupplierStaffPage: React.FC = () => {
    const { user } = useAuth();

    if (!user?.isSupplier) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Only suppliers can manage staff members.
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Staff</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Manage your team members
                </p>
            </div>

            <StaffManagement
                listStaff={supplierStaffService.list}
                addStaff={supplierStaffService.add}
                removeStaff={supplierStaffService.remove}
                updateRole={supplierStaffService.updateRole}
                roles={SUPPLIER_ROLES}
                accentColor="lime"
            />
        </div>
    );
};
