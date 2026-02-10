import { useAuth } from '../context/AuthContext';

type PermissionGroup = string;

interface PermissionResult {
    canRead: boolean;
    canWrite: boolean;
    role: string | null;
}

/**
 * Hook to check staff permissions for a portal section.
 * Owners/suppliers always get full access. Staff are checked against their role permissions.
 *
 * @param portal - 'owner' or 'supplier'
 * @param group - permission group key (e.g. 'dashboard', 'lots', 'bookings')
 */
export function useStaffPermission(portal: 'owner' | 'supplier', group: PermissionGroup): PermissionResult {
    const { user } = useAuth();

    if (!user) {
        return { canRead: false, canWrite: false, role: null };
    }

    // Direct owner/supplier always has full access
    if (portal === 'owner' && user.isOwner) {
        return { canRead: true, canWrite: true, role: null };
    }
    if (portal === 'supplier' && user.isSupplier) {
        return { canRead: true, canWrite: true, role: null };
    }

    // Staff - check permissions from auth response
    if (user.isStaff && user.staffPermissions) {
        const portalPerms = portal === 'owner' ? user.staffPermissions.owner : user.staffPermissions.supplier;
        if (portalPerms) {
            const level = portalPerms.permissions[group];
            return {
                canRead: level === 'READ' || level === 'FULL',
                canWrite: level === 'FULL',
                role: portalPerms.role,
            };
        }
    }

    return { canRead: false, canWrite: false, role: null };
}

/**
 * Get all permission groups for a portal, useful for sidebar rendering.
 */
export function useAllStaffPermissions(portal: 'owner' | 'supplier'): Record<string, { canRead: boolean; canWrite: boolean }> {
    const { user } = useAuth();

    if (!user) return {};

    // Direct owner/supplier always has full access
    if (portal === 'owner' && user.isOwner) {
        return new Proxy({} as Record<string, { canRead: boolean; canWrite: boolean }>, {
            get: () => ({ canRead: true, canWrite: true }),
        });
    }
    if (portal === 'supplier' && user.isSupplier) {
        return new Proxy({} as Record<string, { canRead: boolean; canWrite: boolean }>, {
            get: () => ({ canRead: true, canWrite: true }),
        });
    }

    // Staff
    if (user.isStaff && user.staffPermissions) {
        const portalPerms = portal === 'owner' ? user.staffPermissions.owner : user.staffPermissions.supplier;
        if (portalPerms) {
            const result: Record<string, { canRead: boolean; canWrite: boolean }> = {};
            for (const [group, level] of Object.entries(portalPerms.permissions)) {
                result[group] = {
                    canRead: level === 'READ' || level === 'FULL',
                    canWrite: level === 'FULL',
                };
            }
            return result;
        }
    }

    return {};
}
